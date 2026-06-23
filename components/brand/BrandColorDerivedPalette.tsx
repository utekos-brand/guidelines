import type { BrandColorDerivedPalette } from '@/lib/brand/color-tokens'

type BrandColorDerivedPaletteProps = {
  palette: BrandColorDerivedPalette
}

export function BrandColorDerivedPalette({
  palette
}: BrandColorDerivedPaletteProps) {
  return (
    <article className="border border-border bg-panel">
      <div className="border-b border-border px-4 py-3">
        <h4 className="text-sm font-semibold text-foreground">{palette.title}</h4>
        <p className="mt-1 text-xs text-muted">{palette.method}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {palette.colors.map((color) => (
          <div key={`${palette.id}-${color.label}`} className="min-w-0">
            <div
              className="h-16 border-r border-border last:border-r-0"
              style={{ backgroundColor: color.hex }}
            />
            <div className="min-w-0 px-3 py-2">
              <p className="truncate text-xs font-medium text-foreground">
                {color.label}
              </p>
              <p className="mt-1 truncate font-mono text-[0.7rem] text-muted">
                {color.hex}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
