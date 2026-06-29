import { BrandColorCopySwatch } from "@/components/brand/BrandColorCopySwatch";
import type { BrandColorToken } from "@/lib/brand/color-tokens";
import { contrastGrade } from "@/lib/brand/color-tokens";

type BrandColorScaleProps = {
  tokens: BrandColorToken[];
  onCompare: (token: BrandColorToken) => void;
};

export function BrandColorScale({ tokens, onCompare }: BrandColorScaleProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {tokens.map((token) => (
        <article
          key={token.id}
          className="border-border bg-panel grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] overflow-hidden border"
        >
          <BrandColorCopySwatch
            color={token.hex ?? token.resolvedValue}
            hex={token.hex}
            label={token.label}
            size="lg"
            className="h-full min-h-24 border-0"
            onCompare={() => onCompare(token)}
          />
          <div className="min-w-0 px-3 py-2">
            <h4 className="text-foreground truncate text-sm font-semibold">{token.label}</h4>
            <p className="text-muted-foreground mt-1 font-mono text-xs">
              {token.hex ?? token.value}
            </p>
            <dl className="text-muted-foreground mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[0.72rem]">
              <dt>WCAG</dt>
              <dd className="text-foreground text-right">
                {contrastGrade(token.wcagContrastVsBackground)}
              </dd>
              <dt>Pantone</dt>
              <dd className="text-foreground truncate text-right">{token.pantone ?? "-"}</dd>
            </dl>
          </div>
        </article>
      ))}
    </div>
  );
}
