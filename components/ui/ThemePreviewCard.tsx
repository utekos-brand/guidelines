"use client";

import { BRAND_THEME_LABELS, type BrandTheme } from "@/config/brand-themes";
import { useBrandTheme } from "@/hooks/use-brand-theme";
import { cn } from "@/lib/utils";

export function ThemePreviewCard({ theme }: { theme: BrandTheme }) {
  const { theme: activeTheme, colorMode, setTheme } = useBrandTheme();
  const selected = activeTheme === theme;

  return (
    <button
      type="button"
      data-theme={theme}
      data-color-mode={colorMode}
      data-selected={selected}
      aria-pressed={selected}
      onClick={() => setTheme(theme)}
      className={cn(
        "group border-border bg-card text-card-foreground max-w-3xl min-w-3xl cursor-pointer rounded-lg border p-5 text-left shadow-sm transition",
        "hover:border-primary/55 hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 hover:shadow-md",
        "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        "data-[selected=true]:border-primary data-[selected=true]:bg-card data-[selected=true]:shadow-md",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold">{BRAND_THEME_LABELS[theme]}</h2>
        <span className="border-border bg-secondary text-secondary-foreground rounded-full border px-2.5 py-1 text-xs font-medium capitalize">
          {colorMode}
        </span>
      </div>
      <p className="text-muted-foreground mt-2 text-sm leading-6">
        Semantiske tokens gjengitt med aktiv fargemodus.
      </p>

      <div className="mt-5 grid gap-3">
        <div className="border-border bg-background text-foreground rounded-md border p-3">
          <div className="text-sm font-medium">Background</div>
          <div className="text-muted-foreground mt-1 text-xs">bg-background / text-foreground</div>
        </div>
        <div className="border-border bg-muted text-muted-foreground rounded-md border p-3">
          <div className="text-foreground text-sm font-medium">Muted</div>
          <div className="mt-1 text-xs">bg-muted / text-muted-foreground</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-sm font-medium">
            Primary
          </span>
          <span className="border-border bg-secondary text-secondary-foreground rounded-md border px-3 py-2 text-sm font-medium">
            Secondary
          </span>
        </div>
      </div>

      <div className="border-border mt-5 flex items-center justify-between border-t pt-4 text-sm">
        <span className="text-muted-foreground">Theme</span>
        <span className="text-primary font-medium">{selected ? "Aktiv" : "Velg"}</span>
      </div>
    </button>
  );
}
