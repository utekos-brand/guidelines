"use client";

import { Moon, Sun } from "lucide-react";

import { BRAND_THEME_LABELS, BRAND_THEMES, COLOR_MODES } from "@/config/brand-themes";
import { useBrandTheme } from "@/hooks/use-brand-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, colorMode, setTheme, setColorMode } = useBrandTheme();

  return (
    <div className="border-border bg-card text-card-foreground flex flex-col gap-3 rounded-lg border p-2 shadow-sm sm:items-end">
      <div className="flex flex-wrap gap-1" aria-label="Velg brand theme">
        {BRAND_THEMES.map((brandTheme) => (
          <button
            key={brandTheme}
            type="button"
            className={cn(
              "cursor-pointer rounded-md border border-transparent px-3 py-1.5 text-sm font-medium transition",
              "hover:border-border hover:bg-accent hover:text-accent-foreground",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              "data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
            )}
            data-active={theme === brandTheme}
            onClick={() => setTheme(brandTheme)}
          >
            {BRAND_THEME_LABELS[brandTheme]}
          </button>
        ))}
      </div>

      <div
        className="bg-muted grid w-full grid-cols-2 gap-1 rounded-md p-1 sm:w-auto"
        aria-label="Velg fargemodus"
      >
        {COLOR_MODES.map((mode) => (
          <button
            key={mode}
            type="button"
            className={cn(
              "inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium capitalize transition",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              "data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-sm",
            )}
            data-active={colorMode === mode}
            onClick={() => setColorMode(mode)}
          >
            {mode === "light" ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
