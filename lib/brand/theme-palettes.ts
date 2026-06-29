import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Route } from "next";

import { brandColorTokens, type BrandColorToken } from "@/lib/brand/color-tokens";

export type ThemeDocId = "utekos" | "havdyp" | "dnb" | "vy" | "custom";

export type ThemePaletteColor = {
  id: string;
  label: string;
  value: string;
  displayValue: string;
  copyValue: string;
  color: string;
  cssVar?: string;
  sourceToken?: string;
};

export type ThemePaletteGroup = {
  id: string;
  title: string;
  description?: string;
  colors: ThemePaletteColor[];
  missingMessage?: string;
};

export type ThemePalette = {
  theme: ThemeDocId;
  title: string;
  summary: string;
  sourceLabel: string;
  sourceDetail: string;
  groups: ThemePaletteGroup[];
};

export type ThemePaletteIndexItem = {
  theme: ThemeDocId;
  title: string;
  href: Route;
  sourceLabel: string;
  colorCount: number;
  swatches: ThemePaletteColor[];
};

const semanticTokenNames = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
  "--header-nav-active",
  "--header-nav-active-foreground",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-ring",
];

const themeOrder: ThemeDocId[] = ["utekos", "havdyp", "dnb", "vy", "custom"];
const repoFileReaders = {
  "PLAN.md": () => readFileSync(join(process.cwd(), "PLAN.md"), "utf8"),
  "styles/themes/dnb.css": () =>
    readFileSync(join(process.cwd(), "styles", "themes", "dnb.css"), "utf8"),
  "styles/themes/havdyp.css": () =>
    readFileSync(join(process.cwd(), "styles", "themes", "havdyp.css"), "utf8"),
  "styles/themes/utekos.css": () =>
    readFileSync(join(process.cwd(), "styles", "themes", "utekos.css"), "utf8"),
  "styles/themes/vy.css": () =>
    readFileSync(join(process.cwd(), "styles", "themes", "vy.css"), "utf8"),
  "styles/tokens/palette.css": () =>
    readFileSync(join(process.cwd(), "styles", "tokens", "palette.css"), "utf8"),
} as const;

type RepoFilePath = keyof typeof repoFileReaders;

const fileCache = new Map<string, string>();
const paletteCache = new Map<ThemeDocId, ThemePalette>();

export function getThemePalette(theme: ThemeDocId) {
  const cached = paletteCache.get(theme);

  if (cached) {
    return cached;
  }

  const palette = buildThemePalette(theme);
  paletteCache.set(theme, palette);
  return palette;
}

export function getThemePaletteIndex(): ThemePaletteIndexItem[] {
  return themeOrder.map((theme) => {
    const palette = getThemePalette(theme);
    const colors = palette.groups.flatMap((group) => group.colors);

    return {
      theme,
      title: palette.title,
      href: `/themes/${theme}` as Route,
      sourceLabel: palette.sourceLabel,
      colorCount: colors.length,
      swatches: colors.slice(0, 8),
    };
  });
}

function buildThemePalette(theme: ThemeDocId): ThemePalette {
  switch (theme) {
    case "dnb":
      return buildDnbPalette();
    case "vy":
      return buildVyPalette();
    case "havdyp":
      return buildHavdypPalette();
    case "custom":
      return buildCustomPalette();
    case "utekos":
    default:
      return buildUtekosPalette();
  }
}

function buildDnbPalette(): ThemePalette {
  const css = readRepoFile("styles/themes/dnb.css");
  const entries = parseCustomPropertyEntries(css);
  const rawVars = new Map(entries.filter(([name]) => name.startsWith("--dnb-")));
  const lightSemanticVars = parseCustomProperties(
    extractCssBlock(css, '[data-theme="dnb"][data-color-mode="light"]'),
  );
  const darkSemanticVars = parseCustomProperties(
    extractCssBlock(css, '[data-theme="dnb"][data-color-mode="dark"]'),
  );

  return {
    theme: "dnb",
    title: "DNB theme",
    summary:
      "Eksakt DNB/Eufemia tokenpalett med lys og mørk tokenmodell, først som hovedpalett og deretter gruppert etter Eufemia-kategoriene.",
    sourceLabel: "Eufemia tokens + styles/themes/dnb.css",
    sourceDetail:
      "DNB-verdiene kommer fra Eufemia-tokenkilden som allerede ligger i theme-CSS-en. Semantiske shadcn-variabler løses tilbake til de samme DNB-tokenene.",
    groups: [
      createGroupFromNames(
        "dnb-main",
        "Hovedpalett",
        "Kjernefarger som styrer handling, flater, tekst, status og dekorative DNB-roller.",
        [
          "--dnb-light-token-color-background-action",
          "--dnb-light-token-color-background-page-background",
          "--dnb-light-token-color-text-neutral",
          "--dnb-light-token-color-background-warning",
          "--dnb-light-token-color-background-error",
          "--dnb-light-token-color-decorative-first-base",
          "--dnb-light-token-color-decorative-second-base",
          "--dnb-light-token-color-decorative-third-base",
          "--dnb-dark-token-color-background-action",
          "--dnb-dark-token-color-background-page-background",
          "--dnb-dark-token-color-text-neutral",
          "--dnb-dark-token-color-background-warning",
          "--dnb-dark-token-color-background-error",
        ],
        rawVars,
      ),
      createSemanticGroup("dnb-light-semantic", "Semantikk - light", {
        sourceVars: lightSemanticVars,
        resolveVars: rawVars,
      }),
      createSemanticGroup("dnb-dark-semantic", "Semantikk - dark", {
        sourceVars: darkSemanticVars,
        resolveVars: rawVars,
      }),
      ...createDnbTokenGroups(entries, rawVars),
    ],
  };
}

function createDnbTokenGroups(entries: Array<[string, string]>, rawVars: Map<string, string>) {
  const categories = [
    ["background", "Background"],
    ["text", "Text"],
    ["icon", "Icon"],
    ["stroke", "Stroke"],
    ["decorative", "Decorative"],
    ["component", "Component"],
  ] as const;

  return (["light", "dark"] as const).flatMap((mode) =>
    categories.map(([category, title]) =>
      createGroupFromNames(
        `dnb-${mode}-${category}`,
        `DNB ${mode === "light" ? "Light" : "Dark"} - ${title}`,
        `Alle ${title.toLowerCase()}-tokens i DNB ${mode}.`,
        namesByPrefix(entries, `--dnb-${mode}-token-color-${category}-`),
        rawVars,
      ),
    ),
  );
}

function buildVyPalette(): ThemePalette {
  const css = readRepoFile("styles/themes/vy.css");
  const entries = parseCustomPropertyEntries(css);
  const rawVars = new Map(entries.filter(([name]) => name.startsWith("--vy-")));
  const lightSemanticVars = parseCustomProperties(
    extractCssBlock(css, '[data-theme="vy"][data-color-mode="light"]'),
  );
  const darkSemanticVars = parseCustomProperties(
    extractCssBlock(css, '[data-theme="vy"][data-color-mode="dark"]'),
  );

  return {
    theme: "vy",
    title: "Vy theme",
    summary:
      "Eksakt Spor/Vy digitalpalett, med hovedpalett først og full skala for grå, grønn, blå, gul, oransje, rød og alpha-toner.",
    sourceLabel: "Spor MCP snapshot + styles/themes/vy.css",
    sourceDetail:
      "Vy-verdiene er hentet fra Spor vyDigital-paletten i repoets theme-CSS. Semantiske tokens vises med hvilken rå Vy-verdi de peker på.",
    groups: [
      createGroupFromNames(
        "vy-main",
        "Hovedpalett",
        "Fargene som bærer Vy-opplevelsen og de primære semantiske rollene.",
        [
          "--vy-green-700",
          "--vy-green-200",
          "--vy-green-1100",
          "--vy-grey-800",
          "--vy-white",
          "--vy-blue-800",
          "--vy-yellow-400",
          "--vy-orange-500",
          "--vy-red-600",
        ],
        rawVars,
      ),
      createSemanticGroup("vy-light-semantic", "Semantikk - light", {
        sourceVars: lightSemanticVars,
        resolveVars: rawVars,
      }),
      createSemanticGroup("vy-dark-semantic", "Semantikk - dark", {
        sourceVars: darkSemanticVars,
        resolveVars: rawVars,
      }),
      createGroupFromNames(
        "vy-grey",
        "Grey",
        "Vy gråskala fra 50 til 1100.",
        namesByPrefix(entries, "--vy-grey-"),
        rawVars,
      ),
      createGroupFromNames(
        "vy-green",
        "Green",
        "Vy grønnskala fra 50 til 1100.",
        namesByPrefix(entries, "--vy-green-"),
        rawVars,
      ),
      createGroupFromNames(
        "vy-blue",
        "Blue",
        "Vy blåskala fra 50 til 1100.",
        namesByPrefix(entries, "--vy-blue-"),
        rawVars,
      ),
      createGroupFromNames(
        "vy-yellow",
        "Yellow",
        "Vy gulskala fra 50 til 1100.",
        namesByPrefix(entries, "--vy-yellow-"),
        rawVars,
      ),
      createGroupFromNames(
        "vy-orange",
        "Orange",
        "Vy oransjeskala fra 50 til 1100.",
        namesByPrefix(entries, "--vy-orange-"),
        rawVars,
      ),
      createGroupFromNames(
        "vy-red",
        "Red",
        "Vy rødskala fra 50 til 1100.",
        namesByPrefix(entries, "--vy-red-"),
        rawVars,
      ),
      createGroupFromNames(
        "vy-base",
        "Base",
        "Hvitt og sort i Vy-paletten.",
        ["--vy-white", "--vy-black"],
        rawVars,
      ),
      createGroupFromNames(
        "vy-white-alpha",
        "White alpha",
        "Transparente hvitverdier for mørke flater.",
        namesByPrefix(entries, "--vy-white-alpha-"),
        rawVars,
      ),
      createGroupFromNames(
        "vy-black-alpha",
        "Black alpha",
        "Transparente sortverdier for lyse flater.",
        namesByPrefix(entries, "--vy-black-alpha-"),
        rawVars,
      ),
    ],
  };
}

function buildUtekosPalette(): ThemePalette {
  const baseCss = readRepoFile("styles/tokens/palette.css");
  const themeCss = readRepoFile("styles/themes/utekos.css");
  const baseVars = parseCustomProperties(baseCss);
  const lightSemanticVars = parseCustomProperties(
    extractCssBlock(themeCss, '[data-theme="utekos"][data-color-mode="light"]'),
  );
  const darkSemanticVars = parseCustomProperties(
    extractCssBlock(themeCss, '[data-theme="utekos"][data-color-mode="dark"]'),
  );

  return {
    theme: "utekos",
    title: "Utekos theme",
    summary:
      "Arbeidsretningen for Utekos, basert på aktive semantiske tokens, rå basefarger og eksisterende fargedata i color-tokens.json.",
    sourceLabel: "styles/tokens/palette.css + color-tokens.json + PLAN.md",
    sourceDetail:
      "UI-komponenter skal fortsatt bruke semantiske tokens. Rå farger vises her fordi dette er en brand-dokumentasjonsside.",
    groups: [
      createGroupFromNames(
        "utekos-main",
        "Hovedpalett",
        "Aktive basefarger som dagens Utekos-theme peker på.",
        [
          "--color-maritime-blue",
          "--color-cloud-dancer",
          "--color-iced-apricot",
          "--color-fjellbla",
          "--color-havdyp-950",
          "--color-havdyp-900",
          "--color-havdyp-800",
          "--color-parchment-50",
          "--color-parchment-100",
        ],
        baseVars,
      ),
      createSemanticGroup("utekos-light-semantic", "Semantikk - light", {
        sourceVars: lightSemanticVars,
        resolveVars: baseVars,
      }),
      createSemanticGroup("utekos-dark-semantic", "Semantikk - dark", {
        sourceVars: darkSemanticVars,
        resolveVars: baseVars,
      }),
      ...createPlanPaletteGroups({ includeMissing: false }),
      ...createBrandTokenGroups([
        "maritime-blue",
        "maritime-blue-scale",
        "cloud-dancer",
        "maritime-blue-complementary",
        "dazzling-blue",
        "utekos-svale",
      ]),
    ],
  };
}

function buildHavdypPalette(): ThemePalette {
  const baseCss = readRepoFile("styles/tokens/palette.css");
  const themeCss = readRepoFile("styles/themes/havdyp.css");
  const baseVars = parseCustomProperties(baseCss);
  const lightSemanticVars = parseCustomProperties(
    extractCssBlock(themeCss, '[data-theme="havdyp"][data-color-mode="light"]'),
  );
  const darkSemanticVars = parseCustomProperties(
    extractCssBlock(themeCss, '[data-theme="havdyp"][data-color-mode="dark"]'),
  );

  return {
    theme: "havdyp",
    title: "Havdyp theme",
    summary: "Mørkere Utekos-retning som bruker havdyp- og parchment-tokenene i dagens repo.",
    sourceLabel: "styles/themes/havdyp.css + styles/tokens/palette.css",
    sourceDetail:
      "Havdyp-siden viser de faktiske repo-tokenene theme-et bruker, med semantiske light/dark-mappinger.",
    groups: [
      createGroupFromNames(
        "havdyp-main",
        "Hovedpalett",
        "Kjerneverdier for Havdyp-retningen.",
        [
          "--color-havdyp-950",
          "--color-havdyp-900",
          "--color-havdyp-800",
          "--color-cloud-dancer",
          "--color-parchment-50",
          "--color-parchment-100",
          "--color-iced-apricot",
          "--color-fjellbla",
          "--color-vargnatt",
        ],
        baseVars,
      ),
      createSemanticGroup("havdyp-light-semantic", "Semantikk - light", {
        sourceVars: lightSemanticVars,
        resolveVars: baseVars,
      }),
      createSemanticGroup("havdyp-dark-semantic", "Semantikk - dark", {
        sourceVars: darkSemanticVars,
        resolveVars: baseVars,
      }),
      createGroupFromNames(
        "havdyp-base",
        "Rå repo-verdier",
        "Alle rå basefarger som ligger i den delte palette-filen nå.",
        [...baseVars.keys()].filter((name) => name.startsWith("--color-")),
        baseVars,
      ),
    ],
  };
}

function buildCustomPalette(): ThemePalette {
  return {
    theme: "custom",
    title: "Custom palettes",
    summary:
      "Canva-navngitte arbeids-paletter basert på verdiene i PLAN.md fra `--color-maritime-50` og nedover.",
    sourceLabel: "PLAN.md",
    sourceDetail:
      "Siden viser bare verdier som finnes i PLAN.md eller repoets fargedata. Manglende Canva-paletter får statusfelt i stedet for oppdiktede swatches.",
    groups: createPlanPaletteGroups({ includeMissing: true }),
  };
}

function createPlanPaletteGroups({ includeMissing }: { includeMissing: boolean }) {
  const planVars = parseCustomProperties(readRepoFile("PLAN.md"));

  const groups: ThemePaletteGroup[] = [
    createGroupFromNames(
      "plan-maritime-monochromatic",
      "Maritime Monochromatic",
      "PLAN.md-skalaen fra --color-maritime-50 til --color-maritime-950.",
      planScaleNames("--color-maritime"),
      planVars,
    ),
  ];

  if (includeMissing) {
    groups.push(
      createMissingGroup(
        "plan-maritime-monochromatic-secondary",
        "Maritime Monochromatic Secondary",
        "Det finnes ingen eksakt `--color-maritime-secondary-*`-skala eller tilsvarende navngitt verdi i PLAN.md. Ingen swatches genereres før verdiene finnes.",
      ),
    );
  }

  groups.push(
    createGroupFromNames(
      "plan-all-year-amber",
      "All Year Pallet - Amber",
      "Amber-skalaen i PLAN.md.",
      planScaleNames("--color-amber"),
      planVars,
    ),
    createGroupFromNames(
      "plan-all-year-yellow",
      "All Year Pallet - Yellow",
      "Yellow-skalaen i PLAN.md.",
      planScaleNames("--color-yellow"),
      planVars,
    ),
    createGroupFromNames(
      "plan-teal",
      "Teal",
      "Teal-skalaen i PLAN.md.",
      planScaleNames("--color-teal"),
      planVars,
    ),
    createGroupFromNames(
      "plan-primary-blue",
      "PrimaryBlue",
      "Primærblå verdier som er definert i PLAN.md.",
      ["--color-primary-blue-900", "--color-primary-blue", "--color-primary-800"],
      planVars,
    ),
  );

  if (includeMissing) {
    groups.push(
      createMissingGroup(
        "plan-custom-orange",
        "Custom - Orange",
        "PLAN.md nevner Orange, men definerer ingen `--color-orange-*` eller enkel orange-verdi. Ingen swatches genereres før verdiene finnes.",
      ),
    );
  }

  return groups;
}

function createBrandTokenGroups(sectionIds: string[]): ThemePaletteGroup[] {
  return sectionIds.flatMap((sectionId) => {
    const section = brandColorTokens.sections.find((candidate) => candidate.id === sectionId);

    if (!section) {
      return [];
    }

    return [
      {
        id: `brand-token-${section.id}`,
        title: section.title,
        description: `${section.sourceTitle}. ${section.tokens.length} verdier fra lib/brand/color-tokens.json.`,
        colors: section.tokens.map(createColorFromBrandToken),
      },
    ];
  });
}

function createColorFromBrandToken(token: BrandColorToken): ThemePaletteColor {
  const displayValue = token.hex ?? token.value;
  const sourceToken = token.value !== displayValue ? token.value : undefined;

  return {
    id: slugify(token.id),
    label: token.label,
    value: token.value,
    displayValue,
    copyValue: displayValue,
    color: token.hex ?? token.resolvedValue,
    cssVar: token.cssVar,
    sourceToken,
  };
}

function createSemanticGroup(
  id: string,
  title: string,
  {
    sourceVars,
    resolveVars,
  }: {
    sourceVars: Map<string, string>;
    resolveVars: Map<string, string>;
  },
): ThemePaletteGroup {
  const mergedVars = new Map([...resolveVars, ...sourceVars]);

  return {
    id,
    title,
    description: "Semantiske shadcn-variabler med faktisk fargeverdi og kilde-token.",
    colors: semanticTokenNames
      .map((name) => createColorFromDeclaration(name, sourceVars.get(name), mergedVars))
      .filter((color): color is ThemePaletteColor => Boolean(color)),
  };
}

function createGroupFromNames(
  id: string,
  title: string,
  description: string,
  names: string[],
  vars: Map<string, string>,
): ThemePaletteGroup {
  return {
    id,
    title,
    description,
    colors: names
      .map((name) => createColorFromDeclaration(name, vars.get(name), vars))
      .filter((color): color is ThemePaletteColor => Boolean(color)),
  };
}

function createMissingGroup(id: string, title: string, missingMessage: string): ThemePaletteGroup {
  return {
    id,
    title,
    colors: [],
    missingMessage,
  };
}

function createColorFromDeclaration(
  cssVar: string,
  value: string | undefined,
  resolveVars: Map<string, string>,
): ThemePaletteColor | null {
  if (!value) {
    return null;
  }

  const displayValue = resolveCustomProperty(value, resolveVars);

  return {
    id: slugify(cssVar),
    label: formatCssVarLabel(cssVar),
    value,
    displayValue,
    copyValue: displayValue,
    color: displayValue,
    cssVar,
    sourceToken: value === displayValue ? undefined : value,
  };
}

function resolveCustomProperty(
  value: string,
  vars: Map<string, string>,
  seen = new Set<string>(),
): string {
  const varMatch = value.match(/^var\(\s*(--[\w-]+)\s*\)$/);

  if (!varMatch) {
    return value;
  }

  const name = varMatch[1];
  if (!name || seen.has(name)) {
    return value;
  }

  const nextValue = vars.get(name);
  if (!nextValue) {
    return value;
  }

  return resolveCustomProperty(nextValue, vars, new Set([...seen, name]));
}

function namesByPrefix(entries: Array<[string, string]>, prefix: string) {
  return unique(entries.map(([name]) => name).filter((name) => name.startsWith(prefix))).sort(
    naturalCompare,
  );
}

function planScaleNames(prefix: string) {
  return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => `${prefix}-${step}`);
}

function parseCustomProperties(source: string) {
  return new Map(parseCustomPropertyEntries(source));
}

function parseCustomPropertyEntries(source: string): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  const declaration = /(--[\w-]+)\s*:\s*([^;]+);/g;

  for (const match of source.matchAll(declaration)) {
    const name = match[1];
    const rawValue = match[2];

    if (name && rawValue) {
      entries.push([name, normalizeCssValue(rawValue)]);
    }
  }

  return entries;
}

function extractCssBlock(source: string, selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`));

  return match?.[1] ?? "";
}

function readRepoFile(relativePath: RepoFilePath) {
  const cached = fileCache.get(relativePath);

  if (cached) {
    return cached;
  }

  const file = repoFileReaders[relativePath]();
  fileCache.set(relativePath, file);
  return file;
}

function normalizeCssValue(value: string) {
  return value.replace(/\s+/g, " ").replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").trim();
}

function formatCssVarLabel(cssVar: string) {
  return cssVar
    .replace(/^--/, "")
    .replace(/^dnb-(light|dark)-token-color-/, "$1 ")
    .replace(/^vy-/, "")
    .replace(/^color-/, "")
    .split("-")
    .map(formatLabelPart)
    .join(" ");
}

function formatLabelPart(part: string) {
  if (/^\d+$/.test(part)) {
    return part;
  }

  const upper = part.toUpperCase();
  if (["dnb", "vy", "rgb", "cmyk", "oklch"].includes(part)) {
    return upper;
  }

  return part.charAt(0).toUpperCase() + part.slice(1);
}

function slugify(value: string) {
  return value
    .replace(/^--/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function naturalCompare(a: string, b: string) {
  return a.localeCompare(b, "nb", {
    numeric: true,
    sensitivity: "base",
  });
}

function unique(values: string[]) {
  return [...new Set(values)];
}
