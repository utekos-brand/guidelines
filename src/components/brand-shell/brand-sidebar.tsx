"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Grid2X2, X } from "lucide-react";

import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import {
  brandNavSections,
  isBrandNavItemActive,
  type BrandNavAccordion,
  type BrandNavItem,
} from "@/src/config/brand-navigation";
import { cn } from "@/lib/utils";

function getAccordionId(sectionTitle: string, accordionTitle: string) {
  return `${sectionTitle}:${accordionTitle}`;
}

function isAccordionActive(pathname: string, accordion: BrandNavAccordion) {
  return accordion.items.some((item) => isBrandNavItemActive(pathname, item));
}

function BrandSidebarLink({
  item,
  pathname,
  onNavigate,
}: {
  item: BrandNavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const isActive = isBrandNavItemActive(pathname, item);
  const showOverviewIcon = item.title === "Oversikt";

  return (
    <li>
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        data-active={isActive ? "" : undefined}
        className={cn("brand-sidebar-link", isActive && "brand-sidebar-link-active")}
        onClick={onNavigate}
      >
        <span className="brand-sidebar-link-label">{item.title}</span>
        {showOverviewIcon ? (
          <Grid2X2 className="brand-sidebar-link-icon" aria-hidden="true" />
        ) : null}
        {item.badge ? <span className="brand-sidebar-badge">{item.badge}</span> : null}
      </Link>
    </li>
  );
}

export function BrandSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const activeAccordionIds = useMemo(() => {
    const ids = new Set<string>();

    for (const section of brandNavSections) {
      for (const accordion of section.accordions ?? []) {
        if (isAccordionActive(pathname, accordion)) {
          ids.add(getAccordionId(section.title, accordion.title));
        }
      }
    }

    return ids;
  }, [pathname]);

  function closeMobileSidebar() {
    setOpenMobile(false);
  }

  function toggleAccordion(id: string, fallbackOpen: boolean) {
    setOpenAccordions((current) => ({
      ...current,
      [id]: !(current[id] ?? fallbackOpen),
    }));
  }

  return (
    <Sidebar collapsible="offcanvas" className="brand-sidebar-container">
      <SidebarContent className="brand-sidebar-content">
        <button
          type="button"
          className="brand-sidebar-close"
          aria-label="Lukk meny"
          onClick={closeMobileSidebar}
        >
          <X aria-hidden="true" />
        </button>

        <nav className="brand-sidebar-nav" aria-label="Sidenavigasjon">
          {brandNavSections.map((section, sectionIndex) => (
            <Fragment key={section.title}>
              {sectionIndex > 0 ? (
                <div className="brand-sidebar-separator" role="separator" />
              ) : null}

              <section
                className="brand-sidebar-section"
                aria-labelledby={`sidebar-${sectionIndex}`}
              >
                <p id={`sidebar-${sectionIndex}`} className="brand-sidebar-section-title">
                  {section.title}
                </p>

                {section.accordions?.map((accordion) => {
                  const id = getAccordionId(section.title, accordion.title);
                  const isActive = activeAccordionIds.has(id);
                  const fallbackOpen = accordion.defaultOpen ?? false;
                  const isOpen = isActive || (openAccordions[id] ?? fallbackOpen);
                  const panelId = `sidebar-panel-${sectionIndex}-${accordion.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}`;

                  return (
                    <div key={id} className="brand-sidebar-accordion">
                      <button
                        type="button"
                        className="brand-sidebar-trigger"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleAccordion(id, isOpen)}
                      >
                        <span>{accordion.title}</span>
                        <ChevronDown
                          className="brand-sidebar-chevron"
                          data-open={isOpen ? "" : undefined}
                          aria-hidden="true"
                        />
                      </button>

                      <div id={panelId} hidden={!isOpen}>
                        <ul className="brand-sidebar-list">
                          {accordion.items.map((item) => (
                            <BrandSidebarLink
                              key={item.href}
                              item={item}
                              pathname={pathname}
                              onNavigate={closeMobileSidebar}
                            />
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}

                {section.items ? (
                  <ul className="brand-sidebar-list brand-sidebar-list-flat">
                    {section.items.map((item) => (
                      <BrandSidebarLink
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        onNavigate={closeMobileSidebar}
                      />
                    ))}
                  </ul>
                ) : null}
              </section>
            </Fragment>
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
}
