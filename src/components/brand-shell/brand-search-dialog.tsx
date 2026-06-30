"use client";

import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { BrandHeaderButton } from "@/components/brand-shell/brand-header-button";
import { brandNavItems } from "@/src/config/brand-navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function BrandSearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return brandNavItems;
    }

    return brandNavItems.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.description?.toLowerCase().includes(normalized),
    );
  }, [query]);

  function closeDialog() {
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <li>
        <BrandHeaderButton onClick={() => setOpen(true)}>
          <Search aria-hidden="true" />
          Søk
        </BrandHeaderButton>
      </li>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);

          if (!nextOpen) {
            setQuery("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Søk i retningslinjene</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              autoFocus
              placeholder="Søk etter side..."
              value={query}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
              className="pl-8"
            />
          </div>

          <ul className="max-h-64 space-y-1 overflow-y-auto">
            {results.length === 0 ? (
              <li className="text-muted-foreground py-4 text-center text-sm">Ingen treff</li>
            ) : (
              results.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeDialog}
                    className="hover:bg-muted block rounded-md px-2 py-2"
                  >
                    <span className="font-medium">{item.title}</span>
                    {item.description ? (
                      <span className="text-muted-foreground mt-0.5 block text-xs">
                        {item.description}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
