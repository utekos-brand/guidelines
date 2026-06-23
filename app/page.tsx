import Image from 'next/image'

import { BrandGuidelinesApp } from '@/components/brand/BrandGuidelinesApp'
import { brandColorTokens, formatGeneratedAt } from '@/lib/brand/color-tokens'

export default function Home() {
  const { stats, generatedAt } = brandColorTokens
  const sourceLabel = formatSourceLabel(brandColorTokens.source)
  const csvSourceLabel = formatSourceLabel(brandColorTokens.csvSource)

  return (
    <main className="min-h-screen">
      <section className="border-b border-border bg-panel/78">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Image
                src="/brand/utekos-horizontal-logo.svg"
                alt="Utekos"
                width={188}
                height={50}
                priority
                className="mb-8 h-auto w-40"
              />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-brand-action">
                Interne brand guidelines
              </p>
              <h1 className="text-4xl font-semibold tracking-normal text-brand-blue sm:text-5xl">
                Fargeutvalg for Utekos
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                Et praktisk verktøy for ansatte som skal velge, sammenligne og
                kopiere godkjente farger fra Utekos-paletten.
              </p>
            </div>

            <dl className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4 lg:mb-1">
              <Metric label="Seksjoner" value={stats.sectionCount} />
              <Metric label="Tokens" value={stats.tokenCount} />
              <Metric label="Unike HEX" value={stats.uniqueHexCount} />
              <Metric label="Pantone" value={stats.pantoneCount} />
            </dl>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-xs text-muted">
            <span>Kilde: {sourceLabel}</span>
            <span>CSV: {csvSourceLabel}</span>
            <span>Synket: {formatGeneratedAt(generatedAt)}</span>
          </div>
        </div>
      </section>

      <BrandGuidelinesApp />
    </main>
  )
}

function formatSourceLabel(value: string) {
  return value.split('/').filter(Boolean).at(-1) ?? value
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-background px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-brand-blue">{value}</dd>
    </div>
  )
}
