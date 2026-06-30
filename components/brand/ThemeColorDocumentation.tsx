import Link from "next/link";

import { PaletteIndex } from "@/components/brand/PaletteDocumentation";
import {
  getThemePalette,
  getThemePaletteIndex,
  type ThemeDocId,
  type ThemePaletteColor,
  type ThemePaletteGroup,
} from "@/lib/brand/theme-palettes";

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
  const items = getThemePaletteIndex().filter((item) => item.theme !== "custom");

  return (
    <section className="brand-doc-wide space-y-14">
      <section className="space-y-4">
        <div className="grid gap-3">
          {items.map((item) => (
            <Link
              key={item.theme}
              href={item.href}
              className="border-border bg-panel text-foreground hover:border-primary grid gap-4 border px-4 py-4 no-underline transition sm:grid-cols-[minmax(0,1fr)_14rem] sm:items-center"
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
        </div>
      </section>

      <PaletteIndex />
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
        <div className="border-border bg-panel-muted text-muted-foreground border border-dashed px-4 py-4 text-sm">
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
      className="border-border bg-panel text-foreground hover:border-primary focus-visible:ring-ring group block min-w-0 overflow-hidden border no-underline transition focus-visible:ring-2 focus-visible:outline-none"
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

function ThemeIndexSwatches({ colors }: { colors: ThemePaletteColor[] }) {
  return (
    <span className="border-border grid h-16 grid-cols-4 overflow-hidden border">
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

function isThemeDocumentationGroup(group: ThemePaletteGroup) {
  return !group.id.startsWith("plan-") && !group.id.startsWith("brand-token-");
}

function extractHex(value: string) {
  return value.match(/#[0-9a-fA-F]{3,8}\b/)?.[0] ?? null;
}
