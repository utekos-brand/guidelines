import { BrandColorCopySwatch } from "@/components/brand/BrandColorCopySwatch";
import type { BrandColorToken } from "@/lib/brand/color-tokens";
import { contrastGrade } from "@/lib/brand/color-tokens";

type BrandColorTokenListProps = {
  tokens: BrandColorToken[];
  onCompare: (token: BrandColorToken) => void;
};

export function BrandColorTokenList({ tokens, onCompare }: BrandColorTokenListProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {tokens.map((token) => (
        <article key={token.id} className="border-border bg-panel min-w-0 border p-3">
          <BrandColorCopySwatch
            color={token.hex ?? token.resolvedValue}
            hex={token.hex}
            label={token.label}
            onCompare={() => onCompare(token)}
          />
          <div className="mt-3 min-w-0">
            <h4 className="text-foreground truncate text-sm font-semibold">{token.label}</h4>
            <p className="text-muted-foreground mt-1 truncate font-mono text-xs">{token.cssVar}</p>
            <dl className="text-muted-foreground mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
              <dt>HEX</dt>
              <dd className="text-foreground truncate text-right font-mono">{token.hex ?? "-"}</dd>
              <dt>Pantone</dt>
              <dd className="text-foreground truncate text-right">{token.pantone ?? "-"}</dd>
              <dt>Kontrast</dt>
              <dd className="text-foreground truncate text-right">
                {contrastGrade(token.wcagContrastVsBackground)}
              </dd>
            </dl>
          </div>
        </article>
      ))}
    </div>
  );
}
