export const BRAND_THEMES = ["utekos", "havdyp", "dnb", "vy"] as const;

export type BrandTheme = (typeof BRAND_THEMES)[number];

export const COLOR_MODES = ["light", "dark"] as const;

export type ColorMode = (typeof COLOR_MODES)[number];

export const DEFAULT_THEME: BrandTheme = "utekos";

export const DEFAULT_COLOR_MODE: ColorMode = "light";

export const BRAND_THEME_LABELS: Record<BrandTheme, string> = {
  utekos: "Utekos",
  havdyp: "Havdyp",
  dnb: "DnB",
  vy: "Vy",
};

export const THEME_COOKIE_NAME = "brand-theme";

export const COLOR_MODE_COOKIE_NAME = "brand-color-mode";

export function isBrandTheme(value: string): value is BrandTheme {
  return (BRAND_THEMES as readonly string[]).includes(value);
}

export function isColorMode(value: string): value is ColorMode {
  return (COLOR_MODES as readonly string[]).includes(value);
}

export function applyBrandTheme(theme: BrandTheme, colorMode: ColorMode) {
  const root = document.documentElement;

  root.dataset.theme = theme;
  root.dataset.colorMode = colorMode;
  root.classList.toggle("dark", colorMode === "dark");
}

export function persistBrandTheme(theme: BrandTheme, colorMode: ColorMode) {
  const maxAge = "31536000";
  const sameSite = "SameSite=Lax";

  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${maxAge}; ${sameSite}`;
  document.cookie = `${COLOR_MODE_COOKIE_NAME}=${colorMode}; path=/; max-age=${maxAge}; ${sameSite}`;
}
