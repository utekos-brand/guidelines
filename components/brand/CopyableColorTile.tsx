"use client";

import { useEffect, useRef, useState } from "react";

type CopyableColorTileProps = {
  color: string;
  value: string;
  label: string;
  className?: string;
};

export function CopyableColorTile({ color, value, label, className }: CopyableColorTileProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

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
    }, 1400);
  }

  return (
    <button
      type="button"
      className={[
        "border-border focus-visible:ring-ring group relative block cursor-copy overflow-hidden rounded-xl border transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className ?? "aspect-4/3 w-full",
      ].join(" ")}
      style={{ backgroundColor: color }}
      aria-label={`Kopier ${label}: ${value}`}
      title={value}
      onClick={handleCopy}
    >
      <span className="sr-only">{`Kopier ${value}`}</span>

      {isCopied ? (
        <span
          aria-live="polite"
          className="bg-background/90 text-foreground inset-inline-3 pointer-events-none absolute bottom-3 rounded-full px-3 py-1.5 text-center text-xs font-semibold shadow-sm backdrop-blur"
        >
          Kopiert
        </span>
      ) : null}
    </button>
  );
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
