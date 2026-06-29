"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

function getHeadingText(heading: HTMLElement) {
  return (heading.textContent ?? "").replace(/#$/, "").trim();
}

function getActiveMdxContent() {
  const contents = document.querySelectorAll<HTMLElement>(".brand-main .mdx-content");

  for (const content of contents) {
    if (isVisibleElement(content)) {
      return content;
    }
  }

  return contents[contents.length - 1] ?? null;
}

function isVisibleElement(element: Element) {
  if (element.closest("[hidden]")) {
    return false;
  }

  const htmlElement = element as HTMLElement;

  return htmlElement.offsetParent !== null || htmlElement.getClientRects().length > 0;
}

export function BrandTableOfContents() {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const contentRoot = getActiveMdxContent();

      if (!contentRoot) {
        setItems([]);
        setActiveId("");
        return;
      }

      const seenIds = new Set<string>();
      const headings = Array.from(contentRoot.querySelectorAll<HTMLElement>(":is(h2[id], h3[id])"))
        .map((heading) => {
          const depth: TocItem["depth"] = heading.tagName === "H3" ? 3 : 2;

          return {
            id: heading.id,
            text: getHeadingText(heading),
            depth,
          };
        })
        .filter((item) => {
          if (!item.id || !item.text || seenIds.has(item.id)) {
            return false;
          }

          seenIds.add(item.id);
          return true;
        });

      setItems(headings);
      setActiveId(headings[0]?.id ?? "");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (items.length === 0 || !("IntersectionObserver" in window)) {
      return;
    }

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    const visibleHeadings = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleHeadings.add(entry.target.id);
          } else {
            visibleHeadings.delete(entry.target.id);
          }
        }

        const nextActiveId =
          headings.find((heading) => visibleHeadings.has(heading.id))?.id ??
          activeHeadingBeforeViewport(headings) ??
          items[0]?.id ??
          "";

        setActiveId(nextActiveId);
      },
      {
        rootMargin: "-22% 0px -64% 0px",
        threshold: [0, 1],
      },
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [items]);

  const visibleItems = useMemo(
    () => items.filter((item) => item.depth === 2 || item.depth === 3),
    [items],
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <aside className="brand-toc" aria-label="Innhold på siden">
      <nav className="brand-toc-nav">
        <p className="brand-toc-title">Innhold</p>
        <ol className="brand-toc-list">
          {visibleItems.map((item, index) => (
            <li key={`${item.id}-${index}`}>
              <a
                className={cn(
                  "brand-toc-link",
                  item.depth === 3 && "brand-toc-link-depth-3",
                  activeId === item.id && "brand-toc-link-active",
                )}
                href={`#${item.id}`}
                aria-current={activeId === item.id ? "location" : undefined}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

function activeHeadingBeforeViewport(headings: HTMLElement[]) {
  let current = "";

  for (const heading of headings) {
    if (heading.getBoundingClientRect().top < window.innerHeight * 0.28) {
      current = heading.id;
    }
  }

  return current;
}
