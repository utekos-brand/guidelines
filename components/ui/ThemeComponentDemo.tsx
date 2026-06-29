"use client";

import { useMemo, useState } from "react";
import { Check, Code2, Copy, ExternalLink, Maximize2, Minimize2 } from "lucide-react";

import {
  BRAND_THEME_LABELS,
  BRAND_THEMES,
  COLOR_MODES,
  type BrandTheme,
  type ColorMode,
} from "@/config/brand-themes";
import { cn } from "@/lib/utils";

type DemoTab = "info" | "demo" | "properties";

const tabs: Array<{
  id: DemoTab;
  label: string;
}> = [
  { id: "info", label: "Info" },
  { id: "demo", label: "Demo" },
  { id: "properties", label: "Properties" },
];

const codeSample = `<section className="bg-primary p-4">
  <ThemeContext surface="dark">
    <Button>Primary button</Button>
    <Button variant="secondary">Secondary button</Button>
    <Anchor href="/">Anchor on dark surface</Anchor>
  </ThemeContext>
</section>`;

export function ThemeComponentDemo() {
  const [tab, setTab] = useState<DemoTab>("demo");
  const [theme, setTheme] = useState<BrandTheme>("dnb");
  const [mode, setMode] = useState<ColorMode>("dark");
  const [showCode, setShowCode] = useState(true);
  const [focused, setFocused] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeThemeLabel = BRAND_THEME_LABELS[theme];
  const panelTitle = useMemo(() => `${activeThemeLabel} · ${mode}`, [activeThemeLabel, mode]);

  function copySample() {
    if (!navigator.clipboard) {
      return;
    }

    void navigator.clipboard
      .writeText(codeSample)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      })
      .catch(() => undefined);
  }

  return (
    <section
      className={cn(
        "border-border bg-card text-card-foreground rounded-lg border shadow-sm",
        focused && "bg-card fixed inset-4 z-50 overflow-auto shadow-2xl md:inset-8",
      )}
      aria-labelledby="theme-component-demo-title"
    >
      <div className="border-border flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">Theme component</p>
          <h2
            id="theme-component-demo-title"
            className="text-foreground mt-1 text-2xl font-semibold tracking-normal"
          >
            Surface context
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="border-border bg-background inline-flex rounded-md border p-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                data-active={tab === item.id}
                onClick={() => setTab(item.id)}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring data-[active=true]:bg-primary data-[active=true]:text-primary-foreground cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none"
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-pressed={focused}
            onClick={() => setFocused((value) => !value)}
            className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex size-9 cursor-pointer items-center justify-center rounded-md border transition focus-visible:ring-2 focus-visible:outline-none"
            title={focused ? "Lukk fokusvisning" : "Fokusvisning"}
          >
            {focused ? (
              <Minimize2 className="size-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[18rem_1fr]">
        <aside className="border-border bg-muted/40 border-b p-4 lg:border-r lg:border-b-0">
          <div className="grid gap-4">
            <label className="text-foreground grid gap-2 text-sm font-medium">
              Theme
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value as BrandTheme)}
                className="border-input bg-background text-foreground focus-visible:ring-ring h-10 rounded-md border px-3 text-sm shadow-sm transition outline-none focus-visible:ring-2"
              >
                {BRAND_THEMES.map((item) => (
                  <option key={item} value={item}>
                    {BRAND_THEME_LABELS[item]}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-2">
              <div className="text-foreground text-sm font-medium">Mode</div>
              <div className="bg-background grid grid-cols-2 gap-1 rounded-md p-1">
                {COLOR_MODES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    data-active={mode === item}
                    onClick={() => setMode(item)}
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring data-[active=true]:bg-primary data-[active=true]:text-primary-foreground cursor-pointer rounded-sm px-3 py-1.5 text-sm font-medium capitalize transition focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div>
          {tab === "info" ? (
            <div className="p-5">
              <p className="text-muted-foreground max-w-2xl text-base leading-7">
                Surface context lar komponenter reagere på bakgrunnen uten at hver komponent
                hardkoder brand-farger.
              </p>
            </div>
          ) : null}

          {tab === "demo" ? (
            <>
              <div
                data-theme={theme}
                data-color-mode={mode}
                className="border-border bg-background text-foreground border-b p-5"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{panelTitle}</h3>
                    <p className="text-muted-foreground text-sm">
                      surface=&quot;dark&quot; justert med semantiske tokens.
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={showCode}
                    onClick={() => setShowCode((value) => !value)}
                    className="border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <Code2 className="size-4" aria-hidden="true" />
                    Code
                  </button>
                </div>

                <div className="border-border rounded-lg border bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] p-5">
                  <div className="bg-primary text-primary-foreground rounded-md p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-primary-foreground text-primary rounded-full px-4 py-2 text-sm font-medium">
                        Primary button
                      </span>
                      <span className="border-primary-foreground/70 text-primary-foreground rounded-full border px-4 py-2 text-sm font-medium">
                        Secondary button
                      </span>
                      <a
                        href="/"
                        className="text-primary-foreground inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
                      >
                        Anchor on dark surface
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {showCode ? (
                <div className="border-border bg-muted/40 grid border-b">
                  <div className="border-border flex items-center justify-end gap-2 border-b px-4 py-2">
                    <button
                      type="button"
                      onClick={copySample}
                      className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex size-8 cursor-pointer items-center justify-center rounded-md transition focus-visible:ring-2 focus-visible:outline-none"
                      title={copied ? "Kopiert" : "Kopier"}
                    >
                      {copied ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : (
                        <Copy className="size-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <pre className="text-foreground overflow-x-auto p-5 text-sm leading-6 break-words whitespace-pre-wrap md:whitespace-pre">
                    <code>{codeSample}</code>
                  </pre>
                </div>
              ) : null}
            </>
          ) : null}

          {tab === "properties" ? (
            <div className="overflow-x-auto p-5">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-border border-b">
                    <th className="py-3 pr-4 font-semibold">Property</th>
                    <th className="py-3 pr-4 font-semibold">Value</th>
                    <th className="py-3 pr-4 font-semibold">Use</th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  <tr>
                    <td className="py-3 pr-4 font-medium">theme</td>
                    <td className="py-3 pr-4">{activeThemeLabel}</td>
                    <td className="text-muted-foreground py-3 pr-4">
                      Setter token-sett for preview.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">colorMode</td>
                    <td className="py-3 pr-4">{mode}</td>
                    <td className="text-muted-foreground py-3 pr-4">
                      Velger light eller dark token-verdier.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium">surface</td>
                    <td className="py-3 pr-4">dark</td>
                    <td className="text-muted-foreground py-3 pr-4">
                      Tvinger kontrastbevisst komponentvisning.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
