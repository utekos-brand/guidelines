"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { Check, Copy, ExternalLink, Maximize2, Minimize2, X } from "lucide-react";
import { Theme } from "@dnb/eufemia/shared";

type EufemiaThemeName = "dnb" | "sbanken" | "eiendom" | "carnegie";

type EufemiaThemeOption = {
  name: EufemiaThemeName;
  label: string;
  wip?: boolean;
};

type ComponentDemoBoxProps = {
  id?: string;
  title?: string;
  children: ReactNode;
  code: string;
  minHeight?: string;
  defaultLightMode?: boolean;
  showThemeSelector?: boolean;
};

const eufemiaThemeOptions: EufemiaThemeOption[] = [
  { name: "dnb", label: "DNB" },
  { name: "sbanken", label: "Sbanken", wip: true },
  { name: "eiendom", label: "DNB Eiendom" },
  { name: "carnegie", label: "DNB Carnegie", wip: true },
];

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function normalizeFocusId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

export function ComponentDemoBox({
  id,
  title,
  children,
  code,
  minHeight = "12rem",
  defaultLightMode = false,
  showThemeSelector = true,
}: ComponentDemoBoxProps) {
  const reactId = useId();
  const focusId = normalizeFocusId(id ?? reactId);
  const [isLightMode, setIsLightMode] = useState(defaultLightMode);
  const [isFullscreen, setIsFullscreen] = useState(() => {
    if (typeof window === "undefined") return false;

    return new URLSearchParams(window.location.search).get("focusmode") === focusId;
  });
  const [activeTheme, setActiveTheme] = useState<EufemiaThemeName>("dnb");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const normalizedCode = useMemo(() => code.trim(), [code]);

  useEffect(() => {
    if (!isFullscreen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        const url = new URL(window.location.href);
        url.searchParams.delete("focusmode");
        window.history.replaceState(null, "", url.toString());
        setIsFullscreen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  function openFullscreen() {
    const url = new URL(window.location.href);
    url.searchParams.set("focusmode", focusId);
    window.history.replaceState(null, "", url.toString());
    setIsFullscreen(true);
  }

  function closeFullscreen() {
    const url = new URL(window.location.href);
    url.searchParams.delete("focusmode");
    window.history.replaceState(null, "", url.toString());
    setIsFullscreen(false);
  }

  function openInNewTab() {
    const url = new URL(window.location.href);
    url.searchParams.set("focusmode", focusId);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(normalizedCode);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("failed");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  }

  function renderDemoFrame(fullscreen: boolean) {
    return (
      <DemoFrame
        title={title}
        code={normalizedCode}
        minHeight={minHeight}
        isLightMode={isLightMode}
        setIsLightMode={setIsLightMode}
        isFullscreen={fullscreen}
        openFullscreen={openFullscreen}
        closeFullscreen={closeFullscreen}
        openInNewTab={openInNewTab}
        copyCode={copyCode}
        copyState={copyState}
        activeTheme={activeTheme}
        setActiveTheme={setActiveTheme}
        showThemeSelector={showThemeSelector}
      >
        {children}
      </DemoFrame>
    );
  }

  return (
    <>
      {renderDemoFrame(false)}
      {isFullscreen ? (
        <div className="fixed inset-0 z-[1000] bg-[#1b1b1d] text-white">
          <div className="grid h-dvh grid-rows-[auto_1fr] overflow-hidden">
            <div className="border-b border-white/10 bg-[#111214] px-4 py-2 text-sm font-semibold">
              {title ?? "Focused demo"}
            </div>
            <div className="overflow-auto">{renderDemoFrame(true)}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}

type DemoFrameProps = {
  title?: string;
  code: string;
  minHeight: string;
  isLightMode: boolean;
  setIsLightMode: (value: boolean) => void;
  isFullscreen: boolean;
  openFullscreen: () => void;
  closeFullscreen: () => void;
  openInNewTab: () => void;
  copyCode: () => void;
  copyState: "idle" | "copied" | "failed";
  activeTheme: EufemiaThemeName;
  setActiveTheme: (theme: EufemiaThemeName) => void;
  showThemeSelector: boolean;
  children: ReactNode;
};

function DemoFrame({
  title,
  code,
  minHeight,
  isLightMode,
  setIsLightMode,
  isFullscreen,
  openFullscreen,
  closeFullscreen,
  openInNewTab,
  copyCode,
  copyState,
  activeTheme,
  setActiveTheme,
  showThemeSelector,
  children,
}: DemoFrameProps) {
  return (
    <article
      className={cx(
        "border-border bg-[#1d1d1f] text-white shadow-sm",
        isFullscreen
          ? "min-h-[calc(100dvh-2.5rem)] rounded-none border-0"
          : "overflow-hidden rounded-xl border",
      )}
    >
      {title && !isFullscreen ? <h3 className="sr-only">{title}</h3> : null}

      <PreviewPanel
        isLightMode={isLightMode}
        activeTheme={activeTheme}
        minHeight={minHeight}
        isFullscreen={isFullscreen}
      >
        {children}
      </PreviewPanel>

      <Toolbar
        isLightMode={isLightMode}
        setIsLightMode={setIsLightMode}
        isFullscreen={isFullscreen}
        openFullscreen={openFullscreen}
        closeFullscreen={closeFullscreen}
        openInNewTab={openInNewTab}
        copyCode={copyCode}
        copyState={copyState}
        activeTheme={activeTheme}
        setActiveTheme={setActiveTheme}
        showThemeSelector={showThemeSelector}
      />

      <CodeBlock code={code} isFullscreen={isFullscreen} />
    </article>
  );
}

function PreviewPanel({
  isLightMode,
  activeTheme,
  minHeight,
  isFullscreen,
  children,
}: {
  isLightMode: boolean;
  activeTheme: EufemiaThemeName;
  minHeight: string;
  isFullscreen: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[16px_16px] p-6 transition-colors md:p-8",
        isLightMode ? "bg-white text-[#1f1f1f]" : "bg-[#0d0f10] text-white",
        isFullscreen && "rounded-none",
      )}
      style={{ minHeight }}
    >
      <Theme name={activeTheme as never} colorScheme={(isLightMode ? "light" : "dark") as never}>
        <div className="mx-auto max-w-none">{children}</div>
      </Theme>
    </div>
  );
}

function Toolbar({
  isLightMode,
  setIsLightMode,
  isFullscreen,
  openFullscreen,
  closeFullscreen,
  openInNewTab,
  copyCode,
  copyState,
  activeTheme,
  setActiveTheme,
  showThemeSelector,
}: {
  isLightMode: boolean;
  setIsLightMode: (value: boolean) => void;
  isFullscreen: boolean;
  openFullscreen: () => void;
  closeFullscreen: () => void;
  openInNewTab: () => void;
  copyCode: () => void;
  copyState: "idle" | "copied" | "failed";
  activeTheme: EufemiaThemeName;
  setActiveTheme: (theme: EufemiaThemeName) => void;
  showThemeSelector: boolean;
}) {
  return (
    <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-y border-white/10 bg-[#202123] px-3 py-2 text-sm text-white">
      <div className="flex flex-wrap items-center gap-2">
        {isFullscreen && showThemeSelector
          ? eufemiaThemeOptions.map((theme) => (
              <button
                key={theme.name}
                type="button"
                className={cx(
                  "min-w-24 cursor-pointer rounded-md border px-3 py-1.5 text-sm transition",
                  "focus-visible:ring-2 focus-visible:ring-[#a5f3e4] focus-visible:outline-none",
                  activeTheme === theme.name
                    ? "border-[#65d6c1] bg-[#0b5b4d] text-white"
                    : "border-white/18 bg-transparent text-white hover:border-[#65d6c1] hover:text-[#c4fff2]",
                )}
                onClick={() => setActiveTheme(theme.name)}
              >
                {theme.label}
                {theme.wip ? " (WIP)" : ""}
              </button>
            ))
          : null}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            checked={isLightMode}
            onChange={(event) => setIsLightMode(event.target.checked)}
            className="size-4 cursor-pointer accent-[#dce9d4]"
          />
          Light mode
        </label>

        <IconButton label={copyState === "copied" ? "Code copied" : "Copy code"} onClick={copyCode}>
          {copyState === "copied" ? <Check className="size-4" /> : <Copy className="size-4" />}
        </IconButton>

        <IconButton label="Open focused demo in a new tab" onClick={openInNewTab}>
          <ExternalLink className="size-4" />
        </IconButton>

        <IconButton
          label={isFullscreen ? "Close focus mode" : "Open focus mode"}
          onClick={isFullscreen ? closeFullscreen : openFullscreen}
          emphasized={isFullscreen}
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </IconButton>

        {isFullscreen ? (
          <button
            type="button"
            className="grid size-9 cursor-pointer place-items-center rounded-full border border-[#4285ff] bg-[#2b67d7] text-white transition hover:bg-[#1f55b8] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            aria-label="Close focus mode"
            onClick={closeFullscreen}
          >
            <X className="size-5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  emphasized = false,
  children,
}: {
  label: string;
  onClick: () => void;
  emphasized?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cx(
        "grid size-8 cursor-pointer place-items-center rounded-md text-[#a5f3e4] transition",
        "hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#a5f3e4] focus-visible:outline-none",
        emphasized && "bg-white/10 text-white",
      )}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function CodeBlock({ code, isFullscreen }: { code: string; isFullscreen: boolean }) {
  return (
    <pre
      className={cx(
        "m-0 overflow-auto bg-[#303033] p-4 text-[0.8125rem] leading-6 text-[#b7f5de]",
        isFullscreen ? "min-h-72" : "max-h-104",
      )}
    >
      <code>{code}</code>
    </pre>
  );
}
