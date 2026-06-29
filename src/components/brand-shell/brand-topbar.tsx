"use client";

import Image from "next/image";
import Link from "next/link";

import { BrandHeaderActions } from "@/components/brand-shell/brand-header-actions";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function BrandTopbar() {
  return (
    <header className="brand-topbar">
      <div className="flex min-w-0 items-center">
        <SidebarTrigger className="brand-topbar-menu -ml-1" />
        <Link href="/" className="brand-topbar-logo" aria-label="Utekos Brand">
          <Image
            src="/wordmark/UtekosWordmarDark.svg"
            alt="Utekos Brand"
            width={1280}
            height={311}
            priority
            className="h-full w-auto object-contain dark:hidden"
          />
          <Image
            src="/wordmark/WordmarkWhite.svg"
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
