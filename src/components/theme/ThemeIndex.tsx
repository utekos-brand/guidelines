import Link from "next/link";

import { getThemePaletteIndex } from "@/lib/brand/theme-palettes";
import { ThemeIndexSwatches } from "./ThemeIndexSwatches";

export function ThemeIndex() {
  const items = getThemePaletteIndex();

  return (
    <section className="brand-doc-wide grid gap-2">
      {items.map((item) => (
        <Link
          key={item.theme}
          href={item.href}
          className="border-border bg-panel text-foreground hover:border-primary grid gap-4 border px-4 py-4 no-underline transition sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-center"
        >
          <span className="min-w-0">
            <span className="block text-lg font-semibold">{item.title}</span>
            <span className="text-muted-foreground mt-1 block text-sm">{item.sourceLabel}</span>
            <span className="text-muted-foreground mt-2 block text-sm">
              {item.colorCount} dokumenterte fargeverdier
            </span>
          </span>
          <ThemeIndexSwatches colors={item.swatches} />
        </Link>
      ))}
    </section>
  );
}
