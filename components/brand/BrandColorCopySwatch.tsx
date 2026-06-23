'use client'

import { Check, Copy, Plus, TriangleAlert } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

type BrandColorCopySwatchProps = {
  color: string
  hex: string | null
  label: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onCompare?: () => void
}

const sizeClassName = {
  sm: 'size-8',
  md: 'h-14 w-full',
  lg: 'size-12'
}

export function BrandColorCopySwatch({
  color,
  hex,
  label,
  size = 'md',
  className,
  onCompare
}: BrandColorCopySwatchProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const Icon =
    status === 'copied' ? Check
    : status === 'failed' ? TriangleAlert
    : Copy

  async function copyHex() {
    if (!hex) return

    try {
      await navigator.clipboard.writeText(hex)
      setStatus('copied')
      window.setTimeout(() => setStatus('idle'), 1600)
    } catch {
      setStatus('failed')
      window.setTimeout(() => setStatus('idle'), 2200)
    }
  }

  const statusText =
    status === 'copied' ? `${hex} kopiert`
    : status === 'failed' ? `Kunne ikke kopiere ${hex}`
    : ''

  return (
    <span className="relative inline-block w-full">
      <button
        type="button"
        className={cn(
          'group relative block border border-border/80 outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          hex ? 'cursor-copy hover:border-foreground/55' : 'cursor-not-allowed opacity-70',
          sizeClassName[size],
          className
        )}
        style={{ backgroundColor: color }}
        aria-label={
          hex ?
            `Kopier HEX ${hex} for ${label}`
          : `${label} har ingen HEX-verdi`
        }
        title={hex ? `Kopier ${hex}` : label}
        disabled={!hex}
        onClick={copyHex}
      >
        {hex ?
          <span className="absolute right-1 bottom-1 grid size-5 place-items-center bg-background/90 text-foreground opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
        : null}
      </button>

      {hex && onCompare ?
        <button
          type="button"
          className="absolute top-1 right-1 grid size-6 place-items-center border border-border bg-panel/92 text-foreground opacity-0 shadow-sm transition hover:bg-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
          aria-label={`Legg ${hex} til sammenligning`}
          title="Legg til sammenligning"
          onClick={(event) => {
            event.stopPropagation()
            onCompare()
          }}
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
      : null}

      <span className="sr-only" aria-live="polite">
        {statusText}
      </span>
    </span>
  )
}
