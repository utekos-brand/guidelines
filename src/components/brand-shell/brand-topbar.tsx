"use client";

import Image from "next/image";
import Link from "next/link";

import { BrandHeaderActions } from "@/components/brand-shell/brand-header-actions";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function BrandTopbar() {
  return (
    <header className="border-border bg-background/95 supports-backdrop-filter:bg-background/75 sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between gap-6 border-b px-6 backdrop-blur lg:px-8">
      <div className="flex min-w-0 items-center">
        <SidebarTrigger className="-ml-1" />
        <Link href="/" className="ml-3 block h-6 w-24 shrink-0 overflow-hidden lg:hidden">
          <Image
            src="/UtekosWordmarDark.svg"
            alt="Utekos Brand"
            width={1280}
            height={311}
            priority
            className="h-full w-auto object-contain dark:hidden"
          />
          <Image
            src="/WordmarkWhite.svg"
            alt="Utekos Brand"
            width={1280}
            height={311}
            priority
            className="hidden h-full w-auto object-contain dark:block"
          />
        </Link>
      </div>
      <BrandHeaderActions />
    </header>
  );
}
