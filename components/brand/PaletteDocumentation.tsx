import Link from "next/link";

import { CopyableColorTile } from "@/components/brand/CopyableColorTile";
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
    <section className="brand-doc-wide space-y-24">
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
    <section className="space-y-8">
      <PaletteSectionHeader title="Palett" />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-4">
        {doc.colors.map((color) => (
          <CopyableColorTile
            key={color.id}
            color={color.color}
            value={color.value}
            label={color.label}
          />
        ))}
      </div>
    </section>
  );
}

function DerivedColorSection({ colors }: { colors: PaletteDocColor[] }) {
  return (
    <section className="space-y-10">
      <PaletteSectionHeader title="Nyanser" />

      <div className="grid gap-8">
        {colors.map((color) => (
          <article
            key={color.id}
            className="border-border bg-panel grid gap-4 rounded-xl border p-4 lg:grid-cols-[minmax(8rem,12rem)_minmax(0,1fr)]"
          >
            <CopyableColorTile
              color={color.color}
              value={color.value}
              label={color.label}
              className="aspect-4/3 w-full"
            />

            <div className="grid min-w-0 gap-4 lg:grid-cols-3">
              {derivedRamps.map((ramp) => (
                <div key={ramp.id} className="min-w-0">
                  <span className="sr-only">{ramp.title}</span>

                  <div className="border-border grid grid-cols-6 overflow-hidden rounded-xl border">
                    {derivedStops.map((amount) => {
                      const value = `color-mix(in oklab, ${color.color} ${amount}%, ${ramp.mixWith})`;
                      const label = `${color.label} ${ramp.title} ${amount}%`;

                      return (
                        <CopyableColorTile
                          key={amount}
                          color={value}
                          value={value}
                          label={label}
                          className="aspect-square w-full rounded-none border-0 focus-visible:rounded-sm"
                        />
                      );
                    })}
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
    <section className="space-y-8">
      <PaletteSectionHeader title="Andre paletter" />

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

function PaletteSectionHeader({ title }: { title: string }) {
  return (
    <header className="max-w-none">
      <h2 className="text-foreground text-4xl font-semibold tracking-tight text-balance md:text-5xl">
        {title}
      </h2>
    </header>
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
