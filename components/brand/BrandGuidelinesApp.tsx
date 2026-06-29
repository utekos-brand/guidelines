"use client";

import { Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { BrandColorCopySwatch } from "@/components/brand/BrandColorCopySwatch";
import { BrandColorDerivedPalette } from "@/components/brand/BrandColorDerivedPalette";
import {
  brandColorTokens,
  contrastGrade,
  type BrandColorSection,
  type BrandColorToken,
} from "@/lib/brand/color-tokens";
import { groupSectionTokens } from "@/lib/brand/group-brand-tokens";
import { cn } from "@/lib/utils";

type FilterMode = "all" | "csv" | "pantone" | "contrast";
type FilteredSection = BrandColorSection & { totalTokenCount: number };

const filters: Array<{ id: FilterMode; label: string }> = [
  { id: "all", label: "Alle" },
  { id: "csv", label: "CSV" },
  { id: "pantone", label: "Pantone" },
  { id: "contrast", label: "AA+" },
];

export function BrandGuidelinesApp() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [activeSectionId, setActiveSectionId] = useState(brandColorTokens.sections[0]?.id ?? "");
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [compare, setCompare] = useState<BrandColorToken[]>([]);

  const visibleSections = useMemo(() => {
    return brandColorTokens.sections
      .map((section) => ({
        ...section,
        totalTokenCount: section.tokens.length,
        tokens: section.tokens.filter((token) => tokenMatches(token, query, filter)),
      }))
      .filter((section) => section.tokens.length > 0);
  }, [query, filter]);

  const activeSection =
    visibleSections.find((section) => section.id === activeSectionId) ?? visibleSections[0] ?? null;

  const selectedToken =
    activeSection?.tokens.find((token) => token.id === selectedTokenId) ??
    (selectedTokenId ? compare.find((token) => token.id === selectedTokenId) : null) ??
    activeSection?.tokens[0] ??
    null;

  const activeGroups = useMemo(
    () => (activeSection ? groupSectionTokens(activeSection.tokens) : []),
    [activeSection],
  );

  function selectSection(sectionId: string) {
    setActiveSectionId(sectionId);
    setSelectedTokenId(null);
  }

  function addCompare(token: BrandColorToken) {
    setCompare((current) => {
      const next = [token, ...current.filter((item) => item.id !== token.id)];
      return next.slice(0, 6);
    });
    setSelectedTokenId(token.id);
  }

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-7 sm:px-8 lg:grid-cols-[17rem_minmax(0,1fr)_18rem] lg:px-10">
      <aside className="min-w-0 space-y-4 lg:sticky lg:top-4 lg:self-start">
        <SearchPanel
          query={query}
          filter={filter}
          onQueryChange={setQuery}
          onFilterChange={setFilter}
        />

        <PaletteNav
          sections={visibleSections}
          activeSectionId={activeSection?.id ?? ""}
          onSelect={selectSection}
        />
      </aside>

      <main className="min-w-0">
        {activeSection ? (
          <PaletteWorkspace
            section={activeSection}
            groups={activeGroups}
            selectedTokenId={selectedToken?.id ?? null}
            onSelectToken={setSelectedTokenId}
            onCompare={addCompare}
          />
        ) : (
          <EmptyState onClear={() => setQuery("")} />
        )}
      </main>

      <aside className="min-w-0 lg:sticky lg:top-4 lg:self-start">
        <PaletteInspector
          compare={compare}
          selectedToken={selectedToken}
          onClear={() => setCompare([])}
          onSelectToken={setSelectedTokenId}
        />
      </aside>
    </section>
  );
}

function SearchPanel({
  query,
  filter,
  onQueryChange,
  onFilterChange,
}: {
  query: string;
  filter: FilterMode;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: FilterMode) => void;
}) {
  return (
    <div className="border-border bg-panel border p-3">
      <label className="text-muted-foreground mb-2 block text-xs font-semibold uppercase">
        Finn farge
      </label>
      <div className="relative">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Søk navn, HEX, Pantone"
          className="border-border bg-background focus:border-ring focus:ring-ring/20 h-11 w-full border pr-3 pl-9 text-sm transition outline-none focus:ring-2"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              "h-9 border px-2 text-xs transition",
              filter === item.id
                ? "border-brand-action bg-brand-action text-white"
                : "border-border bg-background text-foreground hover:border-brand-action",
            )}
            onClick={() => onFilterChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PaletteNav({
  sections,
  activeSectionId,
  onSelect,
}: {
  sections: FilteredSection[];
  activeSectionId: string;
  onSelect: (sectionId: string) => void;
}) {
  return (
    <nav className="border-border bg-panel border" aria-label="Paletter">
      <div className="border-border border-b px-3 py-3">
        <p className="text-muted-foreground text-xs font-semibold uppercase">Paletter</p>
        <p className="text-foreground mt-1 text-sm">{sections.length} treff</p>
      </div>
      <div className="max-h-[58vh] overflow-auto p-1">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={cn(
              "grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 border-l-2 px-3 py-2.5 text-left text-sm transition",
              activeSectionId === section.id
                ? "border-brand-action bg-panel-muted text-brand-blue"
                : "text-muted-foreground hover:bg-panel-muted hover:text-foreground border-transparent",
            )}
            onClick={() => onSelect(section.id)}
          >
            <span className="min-w-0">
              <span className="block truncate font-medium">{section.title}</span>
              <span className="mt-0.5 block text-xs">
                {section.tokens.length} / {section.totalTokenCount} tokens
              </span>
            </span>
            <PaletteMiniStrip tokens={section.tokens.slice(0, 6)} />
          </button>
        ))}
      </div>
    </nav>
  );
}

function PaletteMiniStrip({ tokens }: { tokens: BrandColorToken[] }) {
  return (
    <span className="border-border grid h-8 w-10 shrink-0 grid-cols-2 overflow-hidden border">
      {tokens.slice(0, 4).map((token) => (
        <span key={token.id} style={{ backgroundColor: token.hex ?? token.resolvedValue }} />
      ))}
    </span>
  );
}

function PaletteWorkspace({
  section,
  groups,
  selectedTokenId,
  onSelectToken,
  onCompare,
}: {
  section: FilteredSection;
  groups: ReturnType<typeof groupSectionTokens>;
  selectedTokenId: string | null;
  onSelectToken: (tokenId: string) => void;
  onCompare: (token: BrandColorToken) => void;
}) {
  return (
    <div className="min-w-0 space-y-6">
      <header className="border-border bg-panel border">
        <div className="border-border border-b px-4 py-4">
          <p className="text-brand-action text-xs font-semibold uppercase">{section.sourceTitle}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-brand-blue text-3xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Viser {section.tokens.length} av {section.totalTokenCount} tokens.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-5 gap-y-1 text-sm sm:text-right">
              <dt className="text-muted-foreground">Grupper</dt>
              <dd className="text-foreground font-medium">{groups.length}</dd>
              <dt className="text-muted-foreground">Derived</dt>
              <dd className="text-foreground font-medium">{section.derivedPalettes.length}</dd>
            </dl>
          </div>
        </div>
        <PaletteStrip tokens={section.tokens} onSelectToken={onSelectToken} />
      </header>

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.id} className="min-w-0">
            <div className="border-border mb-2 flex items-center justify-between gap-4 border-b pb-2">
              <h3 className="text-foreground text-base font-semibold">{group.title}</h3>
              <span className="text-muted-foreground text-sm">{group.tokens.length}</span>
            </div>
            <div className="divide-border border-border bg-panel divide-y border">
              {group.tokens.map((token) => (
                <ColorTokenRow
                  key={token.id}
                  token={token}
                  selected={token.id === selectedTokenId}
                  onSelect={() => onSelectToken(token.id)}
                  onCompare={() => onCompare(token)}
                />
              ))}
            </div>
          </section>
        ))}

        {section.derivedPalettes.length > 0 ? (
          <section className="space-y-3">
            <div className="border-border border-b pb-2">
              <h3 className="text-foreground text-base font-semibold">Avledede forslag</h3>
            </div>
            <div className="space-y-3">
              {section.derivedPalettes.map((palette) => (
                <BrandColorDerivedPalette key={palette.id} palette={palette} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function PaletteStrip({
  tokens,
  onSelectToken,
}: {
  tokens: BrandColorToken[];
  onSelectToken: (tokenId: string) => void;
}) {
  return (
    <div className="flex h-14 overflow-hidden">
      {tokens.map((token) => (
        <button
          key={token.id}
          type="button"
          className="focus-visible:ring-ring min-w-5 flex-1 transition outline-none hover:brightness-95 focus-visible:z-10 focus-visible:ring-2"
          style={{ backgroundColor: token.hex ?? token.resolvedValue }}
          title={`${token.label} ${token.hex ?? token.value}`}
          onClick={() => onSelectToken(token.id)}
        />
      ))}
    </div>
  );
}

function ColorTokenRow({
  token,
  selected,
  onSelect,
  onCompare,
}: {
  token: BrandColorToken;
  selected: boolean;
  onSelect: () => void;
  onCompare: () => void;
}) {
  return (
    <article
      className={cn(
        "grid min-w-0 grid-cols-[4.5rem_minmax(0,1fr)] gap-3 p-3 transition sm:grid-cols-[5.5rem_minmax(0,1fr)_auto]",
        selected ? "bg-panel-muted" : "bg-panel hover:bg-background",
      )}
    >
      <BrandColorCopySwatch
        color={token.hex ?? token.resolvedValue}
        hex={token.hex}
        label={token.label}
        size="lg"
        className="border-border h-16 w-full sm:h-20"
      />

      <div className="min-w-0">
        <button
          type="button"
          className="text-foreground hover:text-brand-action focus-visible:ring-ring block max-w-full truncate text-left text-sm font-semibold outline-none focus-visible:ring-2"
          onClick={onSelect}
        >
          {token.label}
        </button>
        <p className="text-muted-foreground mt-1 truncate font-mono text-xs">{token.cssVar}</p>
        <dl className="text-muted-foreground mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:grid-cols-4">
          <ColorMeta label="HEX" value={token.hex ?? "-"} mono />
          <ColorMeta label="Pantone" value={token.pantone ?? "-"} />
          <ColorMeta label="WCAG" value={contrastGrade(token.wcagContrastVsBackground)} />
          <ColorMeta label="CSV" value={token.matchedCsv ? "Ja" : "Nei"} />
        </dl>
      </div>

      <div className="col-span-2 flex items-center gap-2 sm:col-span-1 sm:flex-col sm:items-end sm:justify-center">
        <button
          type="button"
          className={cn(
            "focus-visible:ring-ring h-9 border px-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none",
            selected
              ? "border-brand-action bg-brand-action text-white"
              : "border-border bg-background text-foreground hover:border-brand-action",
          )}
          onClick={onSelect}
        >
          Velg
        </button>
        <button
          type="button"
          className="border-border bg-background text-foreground hover:border-brand-action focus-visible:ring-ring grid size-9 place-items-center border transition focus-visible:ring-2 focus-visible:outline-none"
          aria-label={`Legg ${token.label} til sammenligning`}
          title="Legg til sammenligning"
          onClick={onCompare}
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

function ColorMeta({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt>{label}</dt>
      <dd className={cn("text-foreground mt-0.5 truncate", mono && "font-mono")}>{value}</dd>
    </div>
  );
}

function PaletteInspector({
  selectedToken,
  compare,
  onClear,
  onSelectToken,
}: {
  selectedToken: BrandColorToken | null;
  compare: BrandColorToken[];
  onClear: () => void;
  onSelectToken: (tokenId: string) => void;
}) {
  return (
    <section className="border-border bg-panel border">
      <div className="border-border border-b px-4 py-3">
        <h2 className="text-muted-foreground text-sm font-semibold uppercase">Inspektør</h2>
      </div>

      {selectedToken ? (
        <div>
          <div
            className="border-border h-28 border-b"
            style={{
              backgroundColor: selectedToken.hex ?? selectedToken.resolvedValue,
            }}
          />
          <div className="space-y-4 px-4 py-4">
            <div className="min-w-0">
              <h3 className="text-foreground truncate text-lg font-semibold">
                {selectedToken.label}
              </h3>
              <p className="text-muted-foreground mt-1 truncate font-mono text-xs">
                {selectedToken.cssVar}
              </p>
            </div>
            <dl className="grid gap-2 text-sm">
              <InspectorMeta label="HEX" value={selectedToken.hex ?? "-"} mono />
              <InspectorMeta label="Pantone" value={selectedToken.pantone ?? "-"} />
              <InspectorMeta
                label="WCAG"
                value={contrastGrade(selectedToken.wcagContrastVsBackground)}
              />
              <InspectorMeta label="CMYK" value={selectedToken.cmyk.value ?? "-"} />
            </dl>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground px-4 py-6 text-sm">Ingen farge valgt.</p>
      )}

      <div className="border-border border-t px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-foreground text-sm font-semibold">Sammenligning</h3>
          {compare.length > 0 ? (
            <button
              type="button"
              className="border-border bg-background text-foreground hover:border-brand-action grid size-8 place-items-center border transition"
              aria-label="Tøm sammenligning"
              onClick={onClear}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {compare.length > 0 ? (
          <div className="mt-3 space-y-2">
            {compare.map((token) => (
              <button
                key={token.id}
                type="button"
                className="grid w-full grid-cols-[2.25rem_minmax(0,1fr)] gap-3 text-left"
                onClick={() => onSelectToken(token.id)}
              >
                <span
                  className="border-border h-9 border"
                  style={{ backgroundColor: token.hex ?? token.resolvedValue }}
                />
                <span className="min-w-0">
                  <span className="text-foreground block truncate text-sm font-medium">
                    {token.label}
                  </span>
                  <span className="text-muted-foreground block truncate font-mono text-xs">
                    {token.hex}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mt-2 text-sm">Legg til farger med plussknappen.</p>
        )}
      </div>
    </section>
  );
}

function InspectorMeta({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("text-foreground truncate text-right", mono && "font-mono")}>{value}</dd>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="border-border bg-panel border px-6 py-14 text-center">
      <p className="text-foreground text-sm font-medium">Ingen farger matcher søket.</p>
      <button
        type="button"
        className="border-border bg-background text-foreground hover:border-brand-action mt-4 h-9 border px-3 text-sm transition"
        onClick={onClear}
      >
        Tøm søk
      </button>
    </div>
  );
}

function tokenMatches(token: BrandColorToken, query: string, filter: FilterMode) {
  const normalizedQuery = query.trim().toLowerCase();
  const haystack = [
    token.label,
    token.name,
    token.cssVar,
    token.hex,
    token.pantone,
    token.cmyk.value,
    token.oklch,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
  const matchesFilter =
    filter === "all" ||
    (filter === "csv" && token.matchedCsv) ||
    (filter === "pantone" && Boolean(token.pantone)) ||
    (filter === "contrast" && (token.wcagContrastVsBackground ?? 0) >= 4.5);

  return matchesQuery && matchesFilter;
}
