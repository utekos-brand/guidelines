import { ThemePaletteColor } from "@/lib/brand/theme-palettes";

export function PaletteUsageExamples({ colors }: { colors: ThemePaletteColor[] }) {
  const [primary, secondary, accent] = colors;

  return (
    <section className="space-y-6">
      <header>
        <h2 className="mdx-h2">Eksempler i bruk</h2>
        <p className="text-muted-foreground mt-3 max-w-3xl text-sm">
          Klassiske UI-mønstre som viser hvordan paletten oppfører seg i reelle komponentflater.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="border-border bg-card text-card-foreground border p-5 shadow-sm">
          <span
            className="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
            style={{
              backgroundColor: accent?.color,
              color: primary?.color,
            }}
          >
            Badge
          </span>

          <h3 className="mt-4 text-lg font-semibold">Produktkort</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Eksempel på card, border, badge og handlingsflate.
          </p>

          <button
            type="button"
            className="mt-5 inline-flex cursor-pointer items-center border px-4 py-2 text-sm font-semibold"
            style={{
              backgroundColor: primary?.color,
              color: secondary?.color,
              borderColor: primary?.color,
            }}
          >
            Primær handling
          </button>
        </article>

        <article className="border-border bg-panel border p-5">
          <h3 className="text-base font-semibold">Border og surface</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Kontroll av lesbarhet, kantlinjer og flatehierarki.
          </p>
        </article>

        <article
          className="p-5"
          style={{
            backgroundColor: primary?.color,
            color: secondary?.color,
          }}
        >
          <h3 className="text-base font-semibold">Mørk/brand surface</h3>
          <p className="mt-2 text-sm opacity-85">
            Test av tekst, lenker og knapper på brandfarget bakgrunn.
          </p>
        </article>
      </div>
    </section>
  );
}
