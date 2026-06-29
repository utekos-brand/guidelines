---
id: utekos-brand-agent-sitemap
title: Utekos Brand Agent Sitemap
description: Canonical docs-root map for Codex, Cursor agents, and humans working in the Utekos Brand repository.
doc_type: agent-sitemap
schema_version: 1
audience:
  - codex
  - cursor
  - human
status: active
created: 2026-06-29
last_updated: 2026-06-29
canonical_json: docs/sitemap.json
canonical_instructions: AGENTS.md
source_docs:
  - title: Cursor Rules
    url: https://cursor.com/docs/rules
  - title: Cursor Agent Overview
    url: https://cursor.com/docs/agent/overview
  - title: AGENTS.md
    url: https://agents.md/
ast_contract:
  format: markdown
  frontmatter: yaml
  stable_headings: true
  companion_json: docs/sitemap.json
  json_sections:
    - repo
    - agentReadOrder
    - sourceOfTruth
    - routes
    - docs
    - mcpSurfaces
    - themeTokens
    - doNotIndex
    - verification
---

# Utekos Brand Agent Sitemap

This file is the human and LLM entrypoint for repository orientation. The
strict machine-readable companion is [`docs/sitemap.json`](./sitemap.json).

Agents should read files in this order:

1. [`AGENTS.md`](../AGENTS.md)
2. [`docs/sitemap.md`](./sitemap.md)
3. [`docs/sitemap.json`](./sitemap.json)

## Agent Protocol

| Rule                 | Requirement                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Instruction source   | Read `AGENTS.md` first. It contains the highest-level project rules for brand guidelines, themes, and semantic tokens.                                 |
| Runtime surface      | Treat this sitemap as documentation infrastructure only. Do not change Next.js routing, app navigation, or MCP server behavior unless asked.           |
| Vendor snapshots     | Do not edit `docs/mcp/**`, `docs/eufemia-insight/**`, or `node_modules/**` unless the user explicitly asks. Use them as read-only evidence.            |
| Theme implementation | UI components should use semantic tokens such as `bg-card`, `text-card-foreground`, `bg-primary`, and `text-primary-foreground`, not raw brand colors. |
| DNB tokens           | Treat `docs/dnb-design-tokens.md` as a local snapshot. Verify implementation-critical values against Eufemia MCP before coding.                        |
| Empty pages          | Files listed as `stub` are intentionally mapped but currently empty or skeletal. Do not infer finished content from their existence.                   |

## Source Of Truth

| Area                 | Source                                                                                                                                       | Use when                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Project instructions | [`AGENTS.md`](../AGENTS.md)                                                                                                                  | Any task in the repository.                                               |
| App navigation       | [`src/config/brand-navigation.ts`](../src/config/brand-navigation.ts), [`src/config/brand-header-nav.ts`](../src/config/brand-header-nav.ts) | Sidebar or header route changes.                                          |
| App routes           | [`src/app`](../src/app)                                                                                                                      | Route ownership, MDX pages, layouts, and published brand guideline pages. |
| Theme registry       | [`config/brand-themes.ts`](../config/brand-themes.ts)                                                                                        | Theme IDs, labels, cookies, and color mode support.                       |
| Theme CSS            | [`styles/themes`](../styles/themes), [`styles/tokens`](../styles/tokens)                                                                     | Token mapping and visual theme implementation.                            |
| MCP runbook          | [`docs/README.md`](./README.md)                                                                                                              | ChatGPT/Eufemia insight connector setup and limitations.                  |
| DNB/Eufemia snapshot | [`docs/dnb-design-tokens.md`](./dnb-design-tokens.md)                                                                                        | Local token reference only, with external verification required.          |
| Deployment           | [`docs/deployment.md`](./deployment.md)                                                                                                      | Vercel, DNS, and GitHub deployment notes.                                 |

## Route Map

| Route                                  | File                                                                                                                                | Status | Owner        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------ |
| `/`                                    | [`src/app/(brand)/page.mdx`](<../src/app/(brand)/page.mdx>)                                                                         | draft  | Brand shell  |
| `/logo`                                | [`src/app/(brand)/logo/page.mdx`](<../src/app/(brand)/logo/page.mdx>)                                                               | draft  | Brand shell  |
| `/farger`                              | [`src/app/(brand)/farger/page.mdx`](<../src/app/(brand)/farger/page.mdx>)                                                           | draft  | Brand shell  |
| `/themes`                              | [`src/app/(brand)/themes/page.mdx`](<../src/app/(brand)/themes/page.mdx>)                                                           | lab    | Brand shell  |
| `/themes/dnb`                          | [`src/app/(brand)/themes/dnb/page.mdx`](<../src/app/(brand)/themes/dnb/page.mdx>)                                                   | lab    | Brand shell  |
| `/themes/utekos`                       | [`src/app/(brand)/themes/utekos/page.mdx`](<../src/app/(brand)/themes/utekos/page.mdx>)                                             | stub   | Brand shell  |
| `/themes/havdyp`                       | [`src/app/(brand)/themes/havdyp/page.mdx`](<../src/app/(brand)/themes/havdyp/page.mdx>)                                             | stub   | Brand shell  |
| `/themes/vy`                           | [`src/app/(brand)/themes/vy/page.mdx`](<../src/app/(brand)/themes/vy/page.mdx>)                                                     | stub   | Brand shell  |
| `/themes/custom`                       | [`src/app/(brand)/themes/custom/page.mdx`](<../src/app/(brand)/themes/custom/page.mdx>)                                             | stub   | Brand shell  |
| `/typografi`                           | [`src/app/(brand)/typografi/page.mdx`](<../src/app/(brand)/typografi/page.mdx>)                                                     | draft  | Brand shell  |
| `/fotografi`                           | [`src/app/(brand)/fotografi/page.mdx`](<../src/app/(brand)/fotografi/page.mdx>)                                                     | stub   | Brand shell  |
| `/illustrasjoner`                      | [`src/app/(brand)/illustrasjoner/page.mdx`](<../src/app/(brand)/illustrasjoner/page.mdx>)                                           | stub   | Brand shell  |
| `/ikoner`                              | [`src/app/(brand)/ikoner/page.mdx`](<../src/app/(brand)/ikoner/page.mdx>)                                                           | stub   | Brand shell  |
| `/grafisk-element`                     | [`src/app/(brand)/grafisk-element/page.mdx`](<../src/app/(brand)/grafisk-element/page.mdx>)                                         | stub   | Brand shell  |
| `/identiteten-i-bruk`                  | [`src/app/(brand)/identiteten-i-bruk/page.mdx`](<../src/app/(brand)/identiteten-i-bruk/page.mdx>)                                   | draft  | Brand shell  |
| `/identiteten-i-bruk/merkevarebygging` | [`src/app/(brand)/identiteten-i-bruk/merkevarebygging/page.mdx`](<../src/app/(brand)/identiteten-i-bruk/merkevarebygging/page.mdx>) | stub   | Brand shell  |
| `/identitet`                           | [`src/app/identitet/page.mdx`](../src/app/identitet/page.mdx)                                                                       | draft  | Header nav   |
| `/identitet/design/system`             | [`src/app/identitet/design/system/page.mdx`](../src/app/identitet/design/system/page.mdx)                                           | draft  | Header nav   |
| `/identitet/design/tokens`             | [`src/app/identitet/design/tokens/page.mdx`](../src/app/identitet/design/tokens/page.mdx)                                           | draft  | Header nav   |
| `/ressurser`                           | [`src/app/ressurser/page.mdx`](../src/app/ressurser/page.mdx)                                                                       | stub   | Header nav   |
| `/merkevarebygging`                    | [`src/app/merkevarebygging/page.mdx`](../src/app/merkevarebygging/page.mdx)                                                         | stub   | Direct route |

## Documentation Map

| Document                                                                                | Role                                | Authority                         |
| --------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------- |
| [`docs/README.md`](./README.md)                                                         | MCP and architecture context        | Repo-local runbook                |
| [`docs/deployment.md`](./deployment.md)                                                 | Deployment notes                    | Repo-local runbook                |
| [`docs/dnb-design-tokens.md`](./dnb-design-tokens.md)                                   | DNB/Eufemia token snapshot          | Local snapshot, verify externally |
| [`docs/mcp/spor-mcp/vyDigital-dark-tokens.md`](./mcp/spor-mcp/vyDigital-dark-tokens.md) | Vy/Spor token snapshot              | MCP snapshot                      |
| [`docs/ebm`](./ebm)                                                                     | Evidence-based marketing references | Research source library           |
| [`docs/eufemia-insight`](./eufemia-insight)                                             | Local Eufemia component snapshots   | Read-only source evidence         |
| [`docs/mcp/dnb`](./mcp/dnb)                                                             | Large DNB vendor mirror             | Read-only vendor mirror           |

## MCP And Tooling

| Surface                   | Path                                                                                                          | Use when                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Cursor MCP config         | [`.cursor/mcp.json`](../.cursor/mcp.json)                                                                     | Cursor-local MCP server wiring.                             |
| ChatGPT connector profile | [`config/mcp/chatgpt-profiles.json`](../config/mcp/chatgpt-profiles.json)                                     | Secure MCP Tunnel metadata and expected tool inventory.     |
| Eufemia insight server    | [`scripts/mcp/utekos-brand-eufemia-server.mjs`](../scripts/mcp/utekos-brand-eufemia-server.mjs)               | Read-only component, token, source, and version lookup.     |
| Eufemia doctor            | [`scripts/mcp/doctor-utekos-brand-eufemia-server.mjs`](../scripts/mcp/doctor-utekos-brand-eufemia-server.mjs) | Validate local server shape and read-only tool annotations. |
| Tunnel helper             | [`scripts/mcp/openai-tunnel.mjs`](../scripts/mcp/openai-tunnel.mjs)                                           | Start, stop, doctor, and bootstrap the secure tunnel.       |

## AST Contract

Tools that parse this file may rely on:

- valid YAML frontmatter at the start of the file
- stable second-level headings
- repo-relative Markdown links
- tables with fixed column headings
- a complete JSON companion at `docs/sitemap.json`

Tools should not infer route completeness from path existence alone. Prefer
the `status` field in `docs/sitemap.json`.

## Verification

```bash
node -e 'JSON.parse(require("fs").readFileSync("docs/sitemap.json","utf8"))'
pnpm exec prettier --check docs/sitemap.md docs/sitemap.json docs/dnb-design-tokens.md
rg -n '"path": "src/app|docs/|styles/|config/|scripts/|\\.cursor/' docs/sitemap.json
```
