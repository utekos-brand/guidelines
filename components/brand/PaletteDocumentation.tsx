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
          egen grid, derived scales, fargepsykologi og realistiske UI-eksempler.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="border-border bg-panel text-foreground hover:border-primary grid gap-4 rounded-xl border px-4 py-4 no-underline transition sm:grid-cols-[minmax(0,1fr)_14rem] sm:items-center"
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
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-4">
        {doc.colors.map((color) => (
          <PaletteColorTile key={color.id} color={color} />
        ))}
      </div>
    </section>
  );
}

function PaletteColorTile({ color }: { color: PaletteDocColor }) {
  return (
    <article className="border-border bg-panel text-foreground block min-w-0 overflow-hidden rounded-xl border">
      <span
        aria-hidden="true"
        className="block aspect-4/3 w-full"
        style={{ backgroundColor: color.color }}
      />
      <span className="sr-only">{`${color.label} ${color.value}`}</span>
    </article>
  );
}

function DerivedColorSection({ colors }: { colors: PaletteDocColor[] }) {
  return (
    <section className="space-y-6">
      <header className="max-w-3xl">
        <h2 className="mdx-h2">Nyanser</h2>
      </header>

      <div className="space-y-6">
        {colors.map((color) => (
          <article key={color.id} className="border-border bg-panel rounded-xl border px-4 py-4">
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

                  <div className="border-border grid grid-cols-6 overflow-hidden rounded-xl border">
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
            className="border-border bg-panel text-foreground hover:border-primary block rounded-xl border px-4 py-4 no-underline transition"
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
        "border-border mt-3 grid overflow-hidden rounded-xl border",
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
