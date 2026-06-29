import Link from "next/link";

import { BrandColorCopySwatch } from "@/components/brand/BrandColorCopySwatch";
import {
  getThemePalette,
  getThemePaletteIndex,
  type ThemeDocId,
  type ThemePaletteColor,
  type ThemePaletteGroup,
} from "@/lib/brand/theme-palettes";

export function ThemeColorDocumentation({ theme }: { theme: ThemeDocId }) {
  const palette = getThemePalette(theme);

  return (
    <section className="brand-doc-wide theme-color-doc space-y-10">
      <header className="border-border bg-panel border px-4 py-4 sm:px-5">
        <p className="text-muted-foreground text-xs font-semibold uppercase">
          {palette.sourceLabel}
        </p>
        <p className="text-foreground mt-3 max-w-3xl text-base">{palette.summary}</p>
        <p className="text-muted-foreground mt-2 max-w-3xl text-sm">{palette.sourceDetail}</p>
      </header>

      <div className="space-y-10">
        {palette.groups.map((group) => (
          <ThemeColorGroup key={`${theme}-${group.id}`} theme={theme} group={group} />
        ))}
      </div>
    </section>
  );
}

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

function ThemeColorGroup({ theme, group }: { theme: ThemeDocId; group: ThemePaletteGroup }) {
  const headingId = `${theme}-${group.id}`;

  return (
    <section className="min-w-0">
      <h2 id={headingId} className="mdx-h2 scroll-mt-28">
        {group.title}
      </h2>
      {group.description ? (
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm">{group.description}</p>
      ) : null}

      {group.missingMessage ? (
        <div className="border-border bg-panel-muted text-muted-foreground mt-4 border border-dashed px-4 py-4 text-sm">
          {group.missingMessage}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          {group.colors.map((color) => (
            <ThemeColorCard key={color.id} color={color} />
          ))}
        </div>
      )}
    </section>
  );
}

function ThemeColorCard({ color }: { color: ThemePaletteColor }) {
  return (
    <article className="border-border bg-panel grid min-w-0 grid-cols-[4.75rem_minmax(0,1fr)] overflow-hidden border">
      <BrandColorCopySwatch
        color={color.color}
        hex={extractHex(color.displayValue)}
        label={color.label}
        copyValue={color.copyValue}
        displayValue={color.displayValue}
        size="lg"
        className="h-full min-h-24 border-0"
      />
      <div className="min-w-0 px-3 py-3">
        <h3 className="text-foreground truncate text-sm font-semibold">{color.label}</h3>
        {color.cssVar ? (
          <p className="text-muted-foreground mt-1 truncate font-mono text-xs">{color.cssVar}</p>
        ) : null}
        <dl className="mt-3 grid gap-2 text-xs">
          <ColorMeta label="Verdi" value={color.displayValue} mono />
          {color.sourceToken ? <ColorMeta label="Kilde" value={color.sourceToken} mono /> : null}
        </dl>
      </div>
    </article>
  );
}

function ColorMeta({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={["text-foreground mt-0.5 break-all", mono ? "font-mono" : ""].join(" ")}>
        {value}
      </dd>
    </div>
  );
}

function ThemeIndexSwatches({ colors }: { colors: ThemePaletteColor[] }) {
  return (
    <span className="border-border grid h-14 grid-cols-4 overflow-hidden border sm:h-16">
      {colors.slice(0, 8).map((color) => (
        <span
          key={color.id}
          style={{ backgroundColor: color.color }}
          title={`${color.label} ${color.displayValue}`}
        />
      ))}
    </span>
  );
}

function extractHex(value: string) {
  return value.match(/#[0-9a-fA-F]{3,8}\b/)?.[0] ?? null;
}
