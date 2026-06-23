import { BrandColorCopySwatch } from '@/components/brand/BrandColorCopySwatch'
import type { BrandColorToken } from '@/lib/brand/color-tokens'
import { contrastGrade } from '@/lib/brand/color-tokens'

type BrandColorScaleProps = {
  tokens: BrandColorToken[]
  onCompare: (token: BrandColorToken) => void
}

export function BrandColorScale({ tokens, onCompare }: BrandColorScaleProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {tokens.map((token) => (
        <article
          key={token.id}
          className="grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] overflow-hidden border border-border bg-panel"
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
            <h4 className="truncate text-sm font-semibold text-foreground">
              {token.label}
            </h4>
            <p className="mt-1 font-mono text-xs text-muted">{token.hex ?? token.value}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[0.72rem] text-muted">
              <dt>WCAG</dt>
              <dd className="text-right text-foreground">
                {contrastGrade(token.wcagContrastVsBackground)}
              </dd>
              <dt>Pantone</dt>
              <dd className="truncate text-right text-foreground">
                {token.pantone ?? '-'}
              </dd>
            </dl>
          </div>
        </article>
      ))}
    </div>
  )
}
