'use client'

import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { BrandColorDerivedPalette } from '@/components/brand/BrandColorDerivedPalette'
import { BrandColorScale } from '@/components/brand/BrandColorScale'
import { BrandColorTokenList } from '@/components/brand/BrandColorTokenList'
import { brandColorTokens, type BrandColorSection, type BrandColorToken } from '@/lib/brand/color-tokens'
import { groupSectionTokens } from '@/lib/brand/group-brand-tokens'
import { cn } from '@/lib/utils'

type FilterMode = 'all' | 'csv' | 'pantone' | 'contrast'

const filters: Array<{ id: FilterMode; label: string }> = [
  { id: 'all', label: 'Alle' },
  { id: 'csv', label: 'CSV-treff' },
  { id: 'pantone', label: 'Pantone' },
  { id: 'contrast', label: 'AA+' }
]

export function BrandGuidelinesApp() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterMode>('all')
  const [activeSectionId, setActiveSectionId] = useState(
    brandColorTokens.sections[0]?.id ?? ''
  )
  const [compare, setCompare] = useState<BrandColorToken[]>([])

  const visibleSections = useMemo(() => {
    return brandColorTokens.sections
      .map((section) => ({
        ...section,
        tokens: section.tokens.filter((token) => tokenMatches(token, query, filter))
      }))
      .filter((section) => section.tokens.length > 0)
  }, [query, filter])

  function addCompare(token: BrandColorToken) {
    setCompare((current) => {
      const next = [token, ...current.filter((item) => item.id !== token.id)]
      return next.slice(0, 6)
    })
  }

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:px-10">
      <aside className="space-y-5 lg:sticky lg:top-4 lg:self-start">
        <div className="border border-border bg-panel p-3">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Finn farge
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sok navn, HEX, Pantone"
              className="h-11 w-full border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>
        </div>

        <div className="border border-border bg-panel p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Filter
          </p>
          <div className="grid grid-cols-2 gap-2">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cn(
                  'h-9 border px-3 text-sm transition',
                  filter === item.id ?
                    'border-brand-action bg-brand-action text-white'
                  : 'border-border bg-background text-foreground hover:border-brand-action'
                )}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <nav className="border border-border bg-panel p-2">
          <p className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Seksjoner
          </p>
          <div className="max-h-[52vh] space-y-1 overflow-auto pr-1">
            {brandColorTokens.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  'block border-l-2 px-3 py-2 text-sm transition',
                  activeSectionId === section.id ?
                    'border-brand-action bg-panel-muted text-brand-blue'
                  : 'border-transparent text-muted hover:bg-panel-muted hover:text-foreground'
                )}
                onClick={() => setActiveSectionId(section.id)}
              >
                <span className="block truncate">{section.title}</span>
                <span className="mt-0.5 block text-xs">{section.tokens.length} tokens</span>
              </a>
            ))}
          </div>
        </nav>
      </aside>

      <div className="min-w-0 space-y-10">
        <ComparisonPanel compare={compare} onClear={() => setCompare([])} />

        {visibleSections.length === 0 ?
          <div className="border border-border bg-panel p-10 text-center">
            <p className="text-sm font-medium text-foreground">Ingen farger matcher soket.</p>
            <p className="mt-2 text-sm text-muted">Tøm sok eller bytt filter.</p>
          </div>
        : null}

        {visibleSections.map((section) => (
          <ColorSection
            key={section.id}
            section={section}
            onCompare={addCompare}
            onVisible={() => setActiveSectionId(section.id)}
          />
        ))}
      </div>
    </section>
  )
}

function tokenMatches(token: BrandColorToken, query: string, filter: FilterMode) {
  const normalizedQuery = query.trim().toLowerCase()
  const haystack = [
    token.label,
    token.name,
    token.cssVar,
    token.hex,
    token.pantone,
    token.cmyk.value,
    token.oklch
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery)
  const matchesFilter =
    filter === 'all' ||
    (filter === 'csv' && token.matchedCsv) ||
    (filter === 'pantone' && Boolean(token.pantone)) ||
    (filter === 'contrast' && (token.wcagContrastVsBackground ?? 0) >= 4.5)

  return matchesQuery && matchesFilter
}

function ColorSection({
  section,
  onCompare,
  onVisible
}: {
  section: BrandColorSection
  onCompare: (token: BrandColorToken) => void
  onVisible: () => void
}) {
  const groups = groupSectionTokens(section.tokens)

  return (
    <section
      id={section.id}
      className="scroll-mt-8 border-t border-border pt-8"
      onMouseEnter={onVisible}
      onFocus={onVisible}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-action">
            {section.sourceTitle}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-brand-blue">
            {section.title}
          </h2>
        </div>
        <span className="w-fit border border-border bg-panel px-3 py-1 text-sm text-muted">
          {section.tokens.length} tokens
        </span>
      </div>

      <div className="space-y-7">
        {groups.map((group) => (
          <div key={group.id}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
              <span className="shrink-0 text-xs text-muted">{group.tokens.length}</span>
            </div>
            {group.kind === 'scale' ?
              <BrandColorScale tokens={group.tokens} onCompare={onCompare} />
            : <BrandColorTokenList tokens={group.tokens} onCompare={onCompare} />}
          </div>
        ))}

        {section.derivedPalettes.length > 0 ?
          <div className="grid gap-3 xl:grid-cols-2">
            {section.derivedPalettes.map((palette) => (
              <BrandColorDerivedPalette key={palette.id} palette={palette} />
            ))}
          </div>
        : null}
      </div>
    </section>
  )
}

function ComparisonPanel({
  compare,
  onClear
}: {
  compare: BrandColorToken[]
  onClear: () => void
}) {
  return (
    <section className="border border-border bg-panel">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">
            Sammenligning
          </h2>
          <p className="mt-1 text-sm text-muted">
            {compare.length > 0 ?
              'Siste farger lagt til fra paletten.'
            : 'Legg til farger med plussknappen på en swatch.'}
          </p>
        </div>
        {compare.length > 0 ?
          <button
            type="button"
            className="grid size-9 place-items-center border border-border bg-background text-foreground transition hover:border-brand-action"
            aria-label="Tom sammenligning"
            onClick={onClear}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        : null}
      </div>

      {compare.length > 0 ?
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {compare.map((token) => (
            <div key={token.id} className="min-w-0 border-r border-border last:border-r-0">
              <div className="h-20" style={{ backgroundColor: token.hex ?? token.resolvedValue }} />
              <div className="min-w-0 px-3 py-2">
                <p className="truncate text-sm font-medium text-foreground">{token.label}</p>
                <p className="mt-1 truncate font-mono text-xs text-muted">{token.hex}</p>
              </div>
            </div>
          ))}
        </div>
      : null}
    </section>
  )
}
