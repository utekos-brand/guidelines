import type { ThemePaletteColor } from "@/lib/brand/theme-palettes";

export function ThemeIndexSwatches({ colors }: { colors: ThemePaletteColor[] }) {
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
