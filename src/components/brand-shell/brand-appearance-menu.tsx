"use client";

import { Settings2 } from "lucide-react";

import { BRAND_THEME_LABELS, BRAND_THEMES, type BrandTheme } from "@/config/brand-themes";
import { useBrandTheme } from "@/hooks/use-brand-theme";
import { BrandHeaderButton } from "@/components/brand-shell/brand-header-button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function BrandAppearanceMenu() {
  const { theme, colorMode, setTheme, setColorMode, mounted } = useBrandTheme();

  return (
    <Popover>
      <PopoverTrigger
        render={<BrandHeaderButton title="Sideinnstillinger" aria-haspopup="dialog" />}
      >
        <Settings2 aria-hidden="true" />
        Utseende
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="ring-border w-52 gap-0 rounded-xl p-0 shadow-lg ring-1"
      >
        <PopoverTitle className="sr-only">Utseende</PopoverTitle>

        <div className="flex flex-col gap-4 p-4">
          <p className="text-foreground text-sm leading-snug">Endre utseendet på siden</p>

          <div className="flex items-center gap-3">
            <Switch
              id="dark-mode-switch"
              className="h-6 w-[54px] data-[size=default]:h-6 data-[size=default]:w-[54px] **:data-[slot=switch-thumb]:size-[18px] **:data-[slot=switch-thumb]:data-checked:translate-x-[calc(100%-2px)]"
              checked={mounted ? colorMode === "dark" : false}
              onCheckedChange={(checked) => setColorMode(checked ? "dark" : "light")}
            />
            <Label
              htmlFor="dark-mode-switch"
              className="text-foreground text-base leading-none font-normal"
            >
              Mørk modus
            </Label>
          </div>

          <Select
            value={mounted ? theme : undefined}
            onValueChange={(value) => setTheme(value as BrandTheme)}
          >
            <SelectTrigger
              id="theme-select"
              className="border-border dark:bg-input/20 h-[54px] w-full items-center rounded-xl bg-transparent px-3 py-2"
            >
              <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
                <span className="text-muted-foreground text-xs leading-none">Theme</span>
                <SelectValue
                  placeholder="Velg theme"
                  className="text-foreground text-base leading-tight font-normal"
                />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {BRAND_THEMES.map((brandTheme) => (
                <SelectItem key={brandTheme} value={brandTheme} className="rounded-lg py-2.5">
                  {BRAND_THEME_LABELS[brandTheme]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
