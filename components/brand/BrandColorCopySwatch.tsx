"use client";

import { Check, Copy, Plus, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type BrandColorCopySwatchProps = {
  color: string;
  hex?: string | null;
  label: string;
  copyValue?: string | null;
  displayValue?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  onCompare?: () => void;
};

const sizeClassName = {
  sm: "size-8",
  md: "h-14 w-full",
  lg: "size-12",
};

export function BrandColorCopySwatch({
  color,
  hex,
  label,
  copyValue,
  displayValue,
  size = "md",
  className,
  onCompare,
}: BrandColorCopySwatchProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const Icon = status === "copied" ? Check : status === "failed" ? TriangleAlert : Copy;
  const valueToCopy = copyValue ?? hex ?? null;
  const visibleValue = displayValue ?? valueToCopy;

  async function copyColorValue() {
    if (!valueToCopy) return;

    try {
      await navigator.clipboard.writeText(valueToCopy);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1600);
    } catch {
      setStatus("failed");
      window.setTimeout(() => setStatus("idle"), 2200);
    }
  }

  const statusText =
    status === "copied"
      ? `${valueToCopy} kopiert`
      : status === "failed"
        ? `Kunne ikke kopiere ${valueToCopy}`
        : "";

  return (
    <span className="relative inline-block w-full">
      <button
        type="button"
        className={cn(
          "group border-border/80 focus-visible:ring-ring focus-visible:ring-offset-background relative block rounded-lg border transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          valueToCopy ? "hover:border-foreground/55 cursor-copy" : "cursor-not-allowed opacity-70",
          sizeClassName[size],
          className,
        )}
        style={{ backgroundColor: color }}
        aria-label={
          valueToCopy ? `Kopier ${visibleValue} for ${label}` : `${label} har ingen fargeverdi`
        }
        title={valueToCopy ? `Kopier ${visibleValue}` : label}
        disabled={!valueToCopy}
        onClick={copyColorValue}
      >
        {valueToCopy ? (
          <span className="bg-background/90 text-foreground absolute right-1 bottom-1 grid size-5 place-items-center opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </button>

      {valueToCopy && onCompare ? (
        <button
          type="button"
          className="border-border bg-panel/92 text-foreground hover:bg-background focus-visible:ring-ring absolute top-1 right-1 grid size-6 place-items-center border opacity-0 shadow-sm transition group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:outline-none"
          aria-label={`Legg ${visibleValue} til sammenligning`}
          title="Legg til sammenligning"
          onClick={(event) => {
            event.stopPropagation();
            onCompare();
          }}
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {statusText}
      </span>
    </span>
  );
}
