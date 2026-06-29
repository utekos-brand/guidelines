"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  applyBrandTheme,
  DEFAULT_COLOR_MODE,
  DEFAULT_THEME,
  isBrandTheme,
  isColorMode,
  persistBrandTheme,
  type BrandTheme,
  type ColorMode,
} from "@/config/brand-themes";

const BRAND_THEME_CHANGE_EVENT = "brand-theme-change";

function readThemeFromDom(): BrandTheme {
  const theme = document.documentElement.dataset.theme;

  return theme && isBrandTheme(theme) ? theme : DEFAULT_THEME;
}

function readColorModeFromDom(): ColorMode {
  const colorMode = document.documentElement.dataset.colorMode;

  return colorMode && isColorMode(colorMode) ? colorMode : DEFAULT_COLOR_MODE;
}

function readSnapshot() {
  if (typeof document === "undefined") {
    return `${DEFAULT_THEME}:${DEFAULT_COLOR_MODE}`;
  }

  return `${readThemeFromDom()}:${readColorModeFromDom()}`;
}

function getServerSnapshot() {
  return `${DEFAULT_THEME}:${DEFAULT_COLOR_MODE}`;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(BRAND_THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);

  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "data-color-mode", "class"],
  });

  return () => {
    window.removeEventListener(BRAND_THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
    observer.disconnect();
  };
}

function subscribeMounted(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const timeout = window.setTimeout(onStoreChange, 0);

  return () => window.clearTimeout(timeout);
}

function parseSnapshot(snapshot: string) {
  const [theme = DEFAULT_THEME, colorMode = DEFAULT_COLOR_MODE] = snapshot.split(":");

  return {
    theme: isBrandTheme(theme) ? theme : DEFAULT_THEME,
    colorMode: isColorMode(colorMode) ? colorMode : DEFAULT_COLOR_MODE,
  };
}

function emitThemeChange() {
  window.dispatchEvent(new Event(BRAND_THEME_CHANGE_EVENT));
}

export function useBrandTheme() {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(
    subscribeMounted,
    () => true,
    () => false,
  );
  const { theme, colorMode } = parseSnapshot(snapshot);

  const setTheme = useCallback(
    (nextTheme: BrandTheme) => {
      applyBrandTheme(nextTheme, colorMode);
      persistBrandTheme(nextTheme, colorMode);
      emitThemeChange();
    },
    [colorMode],
  );

  const setColorMode = useCallback(
    (nextColorMode: ColorMode) => {
      applyBrandTheme(theme, nextColorMode);
      persistBrandTheme(theme, nextColorMode);
      emitThemeChange();
    },
    [theme],
  );

  return {
    theme,
    colorMode,
    setTheme,
    setColorMode,
    mounted,
  };
}
