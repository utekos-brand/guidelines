import type { BrandColorDerivedPalette } from "@/lib/brand/color-tokens";
import { BrandColorCopySwatch } from "@/components/brand/BrandColorCopySwatch";

type BrandColorDerivedPaletteProps = {
  palette: BrandColorDerivedPalette;
};

export function BrandColorDerivedPalette({ palette }: BrandColorDerivedPaletteProps) {
  return (
    <article className="border-border bg-panel border">
      <div className="border-border border-b px-4 py-3">
        <h4 className="text-foreground text-sm font-semibold">{palette.title}</h4>
        <p className="text-muted-foreground mt-1 text-xs">{palette.method}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {palette.colors.map((color) => (
          <div key={`${palette.id}-${color.label}`} className="min-w-0">
            <BrandColorCopySwatch
              color={color.hex}
              hex={color.hex}
              label={color.label}
              size="md"
              className="border-border h-16 border-y-0 border-r border-l-0 last:border-r-0"
            />
            <div className="min-w-0 px-3 py-2">
              <p className="text-foreground truncate text-xs font-medium">{color.label}</p>
              <p className="text-muted-foreground mt-1 truncate font-mono text-[0.7rem]">
                {color.hex}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
