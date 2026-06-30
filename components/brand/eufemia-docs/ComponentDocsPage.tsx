"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

type DocsTab = {
  id: string;
  label: string;
  content: ReactNode;
};

type ComponentDocsPageProps = {
  title: string;
  description: string;
  packageName?: string;
  tabs: DocsTab[];
};

function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function ComponentDocsPage({
  title,
  description,
  packageName = "@dnb/eufemia",
  tabs,
}: ComponentDocsPageProps) {
  const firstTab = tabs[0]?.id ?? "info";
  const [activeTab, setActiveTab] = useState(firstTab);

  const activeContent = useMemo(() => {
    return tabs.find((tab) => tab.id === activeTab)?.content ?? tabs[0]?.content ?? null;
  }, [activeTab, tabs]);

  return (
    <section className="brand-doc-wide space-y-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
            Component documentation
          </p>
          <h1 className="text-foreground text-4xl font-semibold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-3xl text-base leading-7">{description}</p>
        </div>

        <div className="border-border bg-panel flex flex-wrap items-center justify-between gap-3 border px-4 py-3">
          <code className="text-foreground bg-background rounded-sm px-2 py-1 font-mono text-sm">
            {`import { ${title} } from "${packageName}"`}
          </code>
          <span className="text-muted-foreground text-xs">
            Eufemia-style docs shell for Utekos Brand Guidelines
          </span>
        </div>

        <nav
          className="border-border flex flex-wrap gap-2 border-b"
          aria-label={`${title} documentation tabs`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cx(
                "-mb-px cursor-pointer border-b-2 px-4 py-3 text-sm font-semibold transition",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "text-muted-foreground hover:border-border hover:text-foreground border-transparent",
              )}
              aria-pressed={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="min-w-0">{activeContent}</div>
    </section>
  );
}
