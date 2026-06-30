import type { Route } from "next";
import Link from "next/link";

import {
  getThemePalette,
  type ThemeDocId,
  type ThemePaletteColor,
  type ThemePaletteGroup,
} from "@/lib/brand/theme-palettes";
import { getPaletteDoc, type PaletteDocColor, type PaletteDocId } from "@/lib/brand/palette-docs";

type PaletteOverviewColor = {
  id: string;
  label: string;
  value: string;
  color: string;
};

type PaletteOverviewItem = {
  id: string;
  title: string;
  href: Route;
  colors: PaletteOverviewColor[];
};

const themeOverviewOrder = [
  "utekos",
  "vy",
  "dnb",
  "havdyp",
  "custom",
] as const satisfies readonly ThemeDocId[];

const themeOverviewTitles: Record<ThemeDocId, string> = {
  utekos: "Utekos",
  vy: "Vy",
  dnb: "DnB",
  havdyp: "Havdyp",
  custom: "Custom",
};

const paletteOverviewOrder = [
  "hovedpalett",
  "all-year-palette",
  "primary-blue",
  "teal",
  "maritime-monochromatic",
  "maritime-monochromatic-secondary",
] as const satisfies readonly PaletteDocId[];

const paletteOverviewTitles: Record<PaletteDocId, string> = {
  hovedpalett: "Hovedpalett",
  "all-year-palette": "All-year palette",
  "primary-blue": "Primary blue",
  teal: "Teal",
  "maritime-monochromatic": "Maritime monochromatic",
  "maritime-monochromatic-secondary": "Maritime secondary",
};

export function ThemeColorDocumentation({ theme }: { theme: ThemeDocId }) {
  const palette = getThemePalette(theme);
  const groups = palette.groups.filter(isThemeDocumentationGroup);

  return (
    <section className="brand-doc-wide theme-color-doc space-y-12">
      <div className="space-y-12">
        {groups.map((group) => (
          <ThemeColorGroup key={`${theme}-${group.id}`} theme={theme} group={group} />
        ))}
      </div>
    </section>
  );
}

export function ThemeIndex() {
  const items = [...createThemeOverviewItems(), ...createPaletteOverviewItems()];

  return (
    <section className="brand-doc-wide mx-auto grid w-full justify-items-center gap-20 text-center">
      {items.map((item) => (
        <ThemeIndexPalette key={item.id} item={item} />
      ))}
    </section>
  );
}

function createThemeOverviewItems(): PaletteOverviewItem[] {
  return themeOverviewOrder.map((theme) => {
    const palette = getThemePalette(theme);

    return {
      id: `theme-${theme}`,
      title: themeOverviewTitles[theme],
      href: `/theme/${theme}` as Route,
      colors: getThemePreviewColors(theme, palette.groups),
    };
  });
}

function createPaletteOverviewItems(): PaletteOverviewItem[] {
  return paletteOverviewOrder.map((paletteId) => {
    const palette = getPaletteDoc(paletteId);

    return {
      id: `palette-${palette.id}`,
      title: paletteOverviewTitles[paletteId],
      href: palette.href,
      colors: palette.colors.map(mapPaletteDocColor),
    };
  });
}

function getThemePreviewColors(theme: ThemeDocId, groups: ThemePaletteGroup[]) {
  const sourceGroups = theme === "custom" ? groups : groups.filter(isThemeDocumentationGroup);
  const mainGroup = sourceGroups.find((group) => group.colors.length > 0);

  return mainGroup?.colors.map(mapThemeColor) ?? [];
}

function ThemeIndexPalette({ item }: { item: PaletteOverviewItem }) {
  return (
    <section className="grid w-full justify-items-center gap-8">
      <Link
        href={item.href}
        aria-label={`Åpne ${item.title}`}
        className="focus-visible:ring-ring group grid w-full justify-items-center gap-8 rounded-[3.25rem] text-center no-underline focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
      >
        <h2 className="text-foreground text-3xl font-semibold tracking-tight text-balance md:text-5xl">
          {item.title}
        </h2>

        <ThemeIndexSwatches colors={item.colors} />
      </Link>
    </section>
  );
}

function ThemeColorGroup({ theme, group }: { theme: ThemeDocId; group: ThemePaletteGroup }) {
  const headingId = `${theme}-${group.id}`;

  return (
    <section className="min-w-0 space-y-5">
      <header className="max-w-3xl">
        <h2 id={headingId} className="mdx-h2 scroll-mt-28">
          {group.title}
        </h2>
        {group.description ? (
          <p className="text-muted-foreground mt-3 text-sm leading-6">{group.description}</p>
        ) : null}
      </header>

      {group.missingMessage ? (
        <div className="border-border bg-panel-muted text-muted-foreground rounded-xl border border-dashed px-4 py-4 text-sm">
          {group.missingMessage}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-4">
            {group.colors.map((color) => (
              <ThemeColorTile key={color.id} color={color} />
            ))}
          </div>

          <ThemeTokenDetails group={group} />
        </>
      )}
    </section>
  );
}

function ThemeColorTile({ color }: { color: ThemePaletteColor }) {
  const displayValue = extractHex(color.displayValue) ?? color.displayValue;

  return (
    <a
      href={`#${color.id}-details`}
      className="border-border bg-panel text-foreground hover:border-primary focus-visible:ring-ring group block min-w-0 overflow-hidden rounded-xl border no-underline transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label={`${color.label}, ${displayValue}`}
    >
      <span
        aria-hidden="true"
        className="block aspect-4/3 w-full"
        style={{ backgroundColor: color.color }}
      />
      <span className="sr-only">{`${color.label}, ${displayValue}`}</span>
    </a>
  );
}

function ThemeTokenDetails({ group }: { group: ThemePaletteGroup }) {
  return (
    <section className="space-y-3">
      <h3 className="text-foreground text-base font-semibold">Design tokens og detaljer</h3>
      <p className="text-muted-foreground max-w-3xl text-sm leading-6">
        Token-navn, kilde-token og tekniske verdier vises her i stedet for inne i palettgridet. Det
        holder fargeoversikten ryddig, men bevarer sporbarheten.
      </p>

      <div className="grid gap-3">
        {group.colors.map((color) => (
          <article
            key={color.id}
            id={`${color.id}-details`}
            className="border-border bg-panel scroll-mt-28 rounded-xl border px-4 py-4"
          >
            <div className="grid gap-4 rounded-lg sm:grid-cols-[5rem_minmax(0,1fr)]">
              <span
                aria-hidden="true"
                className="border-border block aspect-square w-20 rounded-lg border"
                style={{ backgroundColor: color.color }}
              />
              <div className="min-w-0">
                <h4 className="text-foreground text-sm font-semibold">{color.label}</h4>
                <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
                  {color.cssVar ? (
                    <div className="min-w-0">
                      <dt className="text-muted-foreground">CSS token</dt>
                      <dd className="text-foreground mt-1 font-mono break-all">{color.cssVar}</dd>
                    </div>
                  ) : null}

                  <div className="min-w-0">
                    <dt className="text-muted-foreground">Verdi</dt>
                    <dd className="text-foreground mt-1 font-mono break-all">
                      {color.displayValue}
                    </dd>
                  </div>

                  {color.sourceToken ? (
                    <div className="min-w-0">
                      <dt className="text-muted-foreground">Kilde</dt>
                      <dd className="text-foreground mt-1 font-mono break-all">
                        {color.sourceToken}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ThemeIndexSwatches({ colors }: { colors: PaletteOverviewColor[] }) {
  if (colors.length === 0) {
    return (
      <span className="border-border text-muted-foreground grid min-h-72 w-full max-w-5xl place-items-center rounded-[3rem] border text-sm sm:min-h-88 lg:min-h-104">
        Ingen dokumenterte fargeverdier
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="border-border group-hover:border-primary grid min-h-72 w-full max-w-5xl overflow-hidden rounded-[3rem] border transition sm:min-h-88 lg:min-h-104"
      style={{ gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))` }}
    >
      {colors.map((color) => (
        <span
          key={color.id}
          style={{ backgroundColor: color.color }}
          title={`${color.label} ${color.value}`}
        />
      ))}
    </span>
  );
}

function mapThemeColor(color: ThemePaletteColor): PaletteOverviewColor {
  return {
    id: color.id,
    label: color.label,
    value: color.displayValue,
    color: color.color,
  };
}

function mapPaletteDocColor(color: PaletteDocColor): PaletteOverviewColor {
  return {
    id: color.id,
    label: color.label,
    value: color.value,
    color: color.color,
  };
}

function isThemeDocumentationGroup(group: ThemePaletteGroup) {
  return !group.id.startsWith("plan-") && !group.id.startsWith("brand-token-");
}

function extractHex(value: string) {
  return value.match(/#[0-9a-fA-F]{3,8}\b/)?.[0] ?? null;
}
