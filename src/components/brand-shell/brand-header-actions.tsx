"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandAppearanceMenu } from "@/components/brand-shell/brand-appearance-menu";
import { brandHeaderButtonVariants } from "@/components/brand-shell/brand-header-button";
import { BrandSearchDialog } from "@/components/brand-shell/brand-search-dialog";
import { brandHeaderNavItems, isBrandHeaderNavItemActive } from "@/src/config/brand-header-nav";
import { cn } from "@/lib/utils";

export function BrandHeaderActions() {
  const pathname = usePathname();

  return (
    <nav aria-label="Hovednavigasjon">
      <ul className="flex items-center gap-2 sm:gap-3 md:gap-5">
        {brandHeaderNavItems.map((item) => {
          const isActive = isBrandHeaderNavItemActive(pathname, item);

          return (
            <li key={item.href} className="hidden xl:list-item">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                data-slot="brand-header-button"
                data-active={isActive ? "" : undefined}
                className={cn(
                  brandHeaderButtonVariants({ active: isActive }),
                  item.variant === "identity" && "brand-header-button-identity",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        <BrandSearchDialog />
        <li>
          <BrandAppearanceMenu />
        </li>
      </ul>
    </nav>
  );
}
