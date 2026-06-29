import Link from "next/link";

import {
  getPaletteDoc,
  getPaletteDocIndex,
  type PaletteDoc,
  type PaletteDocColor,
  type PaletteDocId,
} from "@/lib/brand/palette-docs";

const derivedStops = [95, 85, 70, 55, 40, 25] as const;

const derivedRamps = [
  {
    id: "tints",
    title: "Tints",
    mixWith: "white",
  },
  {
    id: "tones",
    title: "Tones",
    mixWith: "oklch(0.55 0 0)",
  },
  {
    id: "shades",
    title: "Shades",
    mixWith: "black",
  },
] as const;

export function PaletteDocumentation({ palette }: { palette: PaletteDocId }) {
  const doc = getPaletteDoc(palette);

  return (
    <section className="brand-doc-wide space-y-14">
      <PaletteOverview doc={doc} />
      <DerivedColorSection colors={doc.colors} />
      <ColorPsychologySection colors={doc.colors} />
      <DesignTokenSection doc={doc} />
      <UsageExamplesSection doc={doc} />
      <RelatedPalettes current={doc.id} />
    </section>
  );
}

export function PaletteIndex() {
  const items = getPaletteDocIndex();

  return (
    <section className="space-y-4">
      <header className="max-w-3xl">
        <h2 className="mdx-h2">Dedikerte palettsider</h2>
        <p className="text-muted-foreground mt-3 text-sm">
          Disse sidene holder arbeids- og brandpalettene separert fra theme-sidene. Hver palett får
          egen grid, derived scales, fargepsykologi, design tokens og realistiske UI-eksempler.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="border-border bg-panel text-foreground hover:border-primary grid gap-4 border px-4 py-4 no-underline transition sm:grid-cols-[minmax(0,1fr)_14rem] sm:items-center"
          >
            <span className="min-w-0">
              <span className="block text-lg font-semibold">{item.title}</span>
              <span className="text-muted-foreground mt-2 block text-sm">{item.summary}</span>
            </span>
            <PaletteIndexSwatches colors={item.swatches} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function PaletteOverview({ doc }: { doc: PaletteDoc }) {
  return (
    <section className="space-y-5">
      <header className="max-w-3xl">
        <h2 className="mdx-h2">Palett</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Store fargeflater først. Hver flis er trykkbar og går til tekniske detaljer lenger ned på
          siden. Token-navn og metadata holdes vekk fra hovedgridet for å unngå visuell støy.
        </p>
      </header>

      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-4">
        {doc.colors.map((color) => (
          <PaletteColorTile key={color.id} color={color} />
        ))}
      </div>
    </section>
  );
}

function PaletteColorTile({ color }: { color: PaletteDocColor }) {
  return (
    <a
      href={`#${color.id}-details`}
      className="border-border bg-panel text-foreground hover:border-primary focus-visible:ring-ring group block min-w-0 overflow-hidden border no-underline transition focus-visible:ring-2 focus-visible:outline-none"
    >
      <span
        aria-hidden="true"
        className="block aspect-[4/3] w-full"
        style={{ backgroundColor: color.color }}
      />
      <span className="block px-3 py-3">
        <span className="block truncate text-sm font-semibold">{color.label}</span>
        <span className="text-muted-foreground mt-1 block truncate font-mono text-xs">
          {color.value}
        </span>
      </span>
    </a>
  );
}

function DerivedColorSection({ colors }: { colors: PaletteDocColor[] }) {
  return (
    <section className="space-y-6">
      <header className="max-w-3xl">
        <h2 className="mdx-h2">Tints, tones og shades</h2>
      </header>

      <div className="space-y-6">
        {colors.map((color) => (
          <article key={color.id} className="border-border bg-panel border px-4 py-4">
            <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-foreground text-sm font-semibold">{color.label}</h3>
              <code className="text-muted-foreground font-mono text-xs">{color.value}</code>
            </header>

            <div className="grid gap-4 lg:grid-cols-3">
              {derivedRamps.map((ramp) => (
                <div key={ramp.id} className="space-y-2">
                  <p className="text-foreground text-xs font-semibold tracking-wide uppercase">
                    {ramp.title}
                  </p>

                  <div className="border-border grid grid-cols-6 overflow-hidden border">
                    {derivedStops.map((amount) => (
                      <span
                        key={amount}
                        className="aspect-square"
                        title={`${color.label} ${ramp.title} ${amount}%`}
                        style={{
                          backgroundColor: `color-mix(in oklab, ${color.color} ${amount}%, ${ramp.mixWith})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ColorPsychologySection({ colors }: { colors: PaletteDocColor[] }) {
  return (
    <section className="space-y-5">
      <header className="max-w-3xl">
        <h2 className="mdx-h2">Fargepsykologi og bruk</h2>
      </header>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {colors.map((color) => (
          <article
            key={color.id}
            className="border-border bg-panel grid grid-cols-[3rem_minmax(0,1fr)] gap-3 border px-3 py-3"
          >
            <span
              aria-hidden="true"
              className="border-border block aspect-square w-12 border"
              style={{ backgroundColor: color.color }}
            />
            <span className="min-w-0">
              <h3 className="text-foreground text-sm font-semibold">{color.label}</h3>
              <p className="text-muted-foreground mt-1 text-xs leading-5">{color.description}</p>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function DesignTokenSection({ doc }: { doc: PaletteDoc }) {
  return (
    <section className="space-y-6">
      <header className="max-w-3xl">
        <h2 className="mdx-h2">Design tokens</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Palettverdier er primitive tokens. Komponenter bør bruke semantiske tokens som beskriver
          rolle og state. Tabellen under viser anbefalt mapping for denne paletten.
        </p>
      </header>

      <div className="border-border overflow-hidden border">
        <div className="bg-panel-muted text-muted-foreground grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem] gap-3 px-4 py-3 text-xs font-semibold tracking-wide uppercase max-md:hidden">
          <span>Semantisk token</span>
          <span>Primitive token</span>
          <span>Rolle</span>
        </div>
        <div className="divide-border divide-y">
          {doc.tokenMappings.map((mapping) => (
            <article
              key={`${mapping.semanticToken}-${mapping.primitiveToken}`}
              className="bg-panel grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_8rem] md:items-start"
            >
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-semibold uppercase md:hidden">
                  Semantisk token
                </p>
                <code className="text-foreground font-mono text-xs break-all">
                  {mapping.semanticToken}
                </code>
                <p className="text-muted-foreground mt-2 text-xs leading-5">{mapping.usage}</p>
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground mb-1 text-xs font-semibold uppercase md:hidden">
                  Primitive token
                </p>
                <code className="text-foreground font-mono text-xs break-all">
                  {mapping.primitiveToken}
                </code>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-semibold uppercase md:hidden">
                  Rolle
                </p>
                <p className="text-foreground text-sm">{mapping.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TokenCodeBlock title="Primitive palette tokens" code={createPrimitiveTokenCss(doc)} />
        <TokenCodeBlock title="Semantic aliases" code={createSemanticTokenCss(doc)} />
      </div>

      <div className="space-y-3">
        <h3 className="text-foreground text-base font-semibold">Tekniske detaljer per farge</h3>
        <div className="grid gap-3">
          {doc.colors.map((color) => (
            <article
              key={color.id}
              id={`${color.id}-details`}
              className="border-border bg-panel scroll-mt-28 border px-4 py-4"
            >
              <div className="grid gap-4 sm:grid-cols-[5rem_minmax(0,1fr)]">
                <span
                  aria-hidden="true"
                  className="border-border block aspect-square w-20 border"
                  style={{ backgroundColor: color.color }}
                />
                <div className="min-w-0">
                  <h4 className="text-foreground text-sm font-semibold">{color.label}</h4>
                  <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
                    <div className="min-w-0">
                      <dt className="text-muted-foreground">Primitive token</dt>
                      <dd className="text-foreground mt-1 font-mono break-all">{color.token}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-muted-foreground">Verdi</dt>
                      <dd className="text-foreground mt-1 font-mono break-all">{color.value}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-muted-foreground">Anbefalt rolle</dt>
                      <dd className="text-foreground mt-1 leading-5">{color.description}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TokenCodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <article className="border-border bg-panel overflow-hidden border">
      <h3 className="border-border bg-panel-muted border-b px-4 py-3 text-sm font-semibold">
        {title}
      </h3>
      <pre className="overflow-x-auto p-4 text-xs leading-6">
        <code>{code}</code>
      </pre>
    </article>
  );
}

function UsageExamplesSection({ doc }: { doc: PaletteDoc }) {
  const primary = findFirst(doc.colors, ["700", "600", "maritime-blue", "primary-blue-600"]);
  const surface = findFirst(doc.colors, ["cloud", "parchment-50", "50", "100"]);
  const accent = findFirst(doc.colors, ["400", "500", "iced", "amber", "teal-600"]);
  const dark = findFirst(doc.colors, ["950", "900", "havdyp", "vargnatt"]);
  const primaryText = getReadableTextColor(primary.color);
  const surfaceText = getReadableTextColor(surface.color);
  const accentText = getReadableTextColor(accent.color);
  const darkText = getReadableTextColor(dark.color);

  return (
    <section className="space-y-6">
      <header className="max-w-3xl">
        <h2 className="mdx-h2">Eksempler i bruk</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Klassiske UI-mønstre gjør paletten lettere å vurdere i praksis: produktkort, borders,
          cards, badges, knapper og mørke brandflater.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <article
          className="border-border border p-5 shadow-sm"
          style={{ backgroundColor: surface.color, color: surfaceText }}
        >
          <span
            className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: accent.color, color: accentText }}
          >
            Produktkort
          </span>
          <h3 className="mt-5 text-lg font-semibold">Guideline-pakke</h3>
          <p className="mt-2 text-sm leading-6 opacity-80">
            Eksempel på card, badge, teksthierarki og CTA med palettens anbefalte kontrastretning.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex cursor-pointer items-center border px-4 py-2 text-sm font-semibold transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              backgroundColor: primary.color,
              borderColor: primary.color,
              color: primaryText,
            }}
          >
            Primær handling
          </button>
        </article>

        <article className="border-border bg-panel border p-5">
          <span
            aria-hidden="true"
            className="mb-5 block h-2 w-20"
            style={{ backgroundColor: primary.color }}
          />
          <h3 className="text-foreground text-lg font-semibold">Border og surface</h3>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Denne varianten bruker appens nøytrale panel, men lar paletten styre markør, fokus og
            visuell aksent.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[surface, accent, primary].map((color) => (
              <span
                key={color.id}
                className="border-border aspect-video border"
                style={{ backgroundColor: color.color }}
                title={color.label}
              />
            ))}
          </div>
        </article>

        <article className="p-5" style={{ backgroundColor: dark.color, color: darkText }}>
          <span className="text-xs font-semibold tracking-wide uppercase opacity-75">
            Dark surface
          </span>
          <h3 className="mt-4 text-lg font-semibold">Mørk brandflate</h3>
          <p className="mt-2 text-sm leading-6 opacity-80">
            Brukes til hero, footer eller premium-moduler. Her er spacing og kontrast viktigere enn
            mengden dekor.
          </p>
          <span
            className="mt-5 inline-flex border px-3 py-1.5 text-xs font-semibold"
            style={{ borderColor: darkText, color: darkText }}
          >
            Badge / status
          </span>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GuidanceList title="Anbefalt bruk" items={doc.usage} />
        <GuidanceList title="Unngå" items={doc.avoid} />
      </div>
    </section>
  );
}

function GuidanceList({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="border-border bg-panel border px-4 py-4">
      <h3 className="text-foreground text-sm font-semibold">{title}</h3>
      <ul className="text-muted-foreground mt-3 grid gap-2 text-sm leading-6">
        {items.map((item) => (
          <li key={item} className="pl-1">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function RelatedPalettes({ current }: { current: PaletteDocId }) {
  const items = getPaletteDocIndex().filter((item) => item.id !== current);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="mdx-h2">Andre paletter</h2>
      </header>
      <div className="grid gap-3 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="border-border bg-panel text-foreground hover:border-primary block border px-4 py-4 no-underline transition"
          >
            <span className="block text-sm font-semibold">{item.title}</span>
            <PaletteIndexSwatches colors={item.swatches.slice(0, 6)} compact />
          </Link>
        ))}
      </div>
    </section>
  );
}

function PaletteIndexSwatches({
  colors,
  compact = false,
}: {
  colors: PaletteDocColor[];
  compact?: boolean;
}) {
  return (
    <span
      className={[
        "border-border mt-3 grid overflow-hidden border",
        compact ? "h-10 grid-cols-6" : "h-16 grid-cols-4 sm:mt-0",
      ].join(" ")}
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

function createPrimitiveTokenCss(doc: PaletteDoc) {
  return [
    `/* ${doc.title} */`,
    "@theme static {",
    ...doc.colors.map((color) => `  ${color.token}: ${color.value};`),
    "}",
  ].join("\n");
}

function createSemanticTokenCss(doc: PaletteDoc) {
  return [
    `/* Semantic aliases for ${doc.title}. Adjust selector to your active theme. */`,
    `[data-theme="utekos"] {`,
    ...doc.tokenMappings.map(
      (mapping) => `  ${mapping.semanticToken}: var(${mapping.primitiveToken});`,
    ),
    "}",
  ].join("\n");
}

function findFirst(colors: PaletteDocColor[], needles: string[]): PaletteDocColor {
  if (colors.length === 0) {
    throw new Error("Palette documentation requires at least one color.");
  }

  return (
    colors.find((color) =>
      needles.some((needle) =>
        `${color.id} ${color.label} ${color.token}`.toLowerCase().includes(needle.toLowerCase()),
      ),
    ) ?? colors[0]!
  );
}

function getReadableTextColor(color: string) {
  const hex = color.match(/^#([0-9a-fA-F]{6})$/)?.[1];

  if (hex) {
    const red = Number.parseInt(hex.slice(0, 2), 16) / 255;
    const green = Number.parseInt(hex.slice(2, 4), 16) / 255;
    const blue = Number.parseInt(hex.slice(4, 6), 16) / 255;
    const luminance =
      0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);

    return luminance > 0.52 ? "#0b1f24" : "#ffffff";
  }

  const oklchLightness = color.match(/oklch\(\s*([0-9.]+)%?/i)?.[1];

  if (oklchLightness) {
    const lightnessValue = Number.parseFloat(oklchLightness);
    const normalizedLightness = lightnessValue > 1 ? lightnessValue / 100 : lightnessValue;

    return normalizedLightness > 0.62 ? "#0b1f24" : "#ffffff";
  }

  return "#ffffff";
}

function linearize(value: number) {
  return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}
