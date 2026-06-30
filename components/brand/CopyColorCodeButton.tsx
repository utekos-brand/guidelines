"use client";

import { useEffect, useRef, useState } from "react";

type CopyColorCodeButtonProps = {
  value: string;
  label: string;
  compact?: boolean;
  displayValue?: string;
};

export function CopyColorCodeButton({
  value,
  label,
  compact = false,
  displayValue,
}: CopyColorCodeButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const visibleValue = displayValue ?? formatVisibleColorValue(value);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    await writeClipboardText(value);

    setIsCopied(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 1600);
  }

  return (
    <button
      type="button"
      className={[
        "border-border bg-background text-foreground hover:border-primary hover:bg-panel-muted focus-visible:ring-ring grid max-w-full cursor-copy grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border font-mono text-xs transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        compact ? "px-2.5 py-1.5" : "px-3 py-2",
      ].join(" ")}
      aria-label={`Kopier ${label}: ${value}`}
      title={`Kopier ${value}`}
      onClick={handleCopy}
    >
      <span className="min-w-0 truncate whitespace-nowrap">{visibleValue}</span>
      <span
        aria-live="polite"
        className="text-muted-foreground shrink-0 font-sans text-[0.6875rem] font-semibold tracking-wide uppercase"
      >
        {isCopied ? "Kopiert" : "Kopier"}
      </span>
    </button>
  );
}

function formatVisibleColorValue(value: string) {
  const normalized = value.trim();

  if (normalized.startsWith("#")) {
    return normalized;
  }

  if (normalized.length <= 24) {
    return normalized;
  }

  return `${normalized.slice(0, 18)}…`;
}

async function writeClipboardText(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {}
  }

  if (typeof document === "undefined") {
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.inset = "0";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}
