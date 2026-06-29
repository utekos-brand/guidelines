# TailwindCSS MCP — utforskning (Cursor + Inspector)

## Tilkobling

**Ja — MCP-en er aktiv i Cursor** via `.cursor/mcp.json`:

```json
"tailwindcss-server": {
  "command": "npx",
  "args": ["-y", "tailwindcss-mcp-server"]
}
```

Cursor eksponerer den som `user-tailwindcss-server` med 8 verktøy:

| Verktøy                       | Formål                                  |
| ----------------------------- | --------------------------------------- |
| `generate_component_template` | HTML-maler (button, card, navbar, …)    |
| `generate_color_palette`      | Skala + CSS-variabler + tailwind.config |
| `convert_css_to_tailwind`     | CSS → klasser / inline / `@apply`       |
| `install_tailwind`            | Install-kommandoer per rammeverk        |
| `search_tailwind_docs`        | Docs-søk (begrenset)                    |
| `get_tailwind_utilities`      | Utility-katalog                         |
| `get_tailwind_colors`         | Fargepalett                             |
| `get_tailwind_config_guide`   | Oppsett per rammeverk                   |

## React vs JSON — hva MCP faktisk returnerer

**MCP-protokollen returnerer alltid strukturert innhold** (typisk JSON/text i `content`-blokker). Det finnes **ingen innebygd «React-modus»** i `tailwindcss-mcp-server`.

Det nærmeste du kommer:

1. **`generate_component_template`** → `{ html, utilities, customizations }` — ren HTML-streng
2. **`convert_css_to_tailwind`** med `mode`:
   - `classes` — mellomrom-separerte utilities
   - `inline` — `class="..."`-streng
   - `component` — `@apply`-blokk
3. **Agent-lag** (Cursor/Codex) — konverter HTML → TSX manuelt (se `modern_navbar.tsx`)

### Anbefalt workflow for Utekos

```
MCP html → erstatt råfarger med semantiske tokens → Next.js-komponent
```

Eksempel: `bg-white/75` → `bg-background/75`, `text-foreground/60` → `text-muted-foreground`.

## Tool-specific Metadata (MCP Inspector)

Feltet **«Tool-specific Metadata»** i `@modelcontextprotocol/inspector` mapper til MCP-feltet **`_meta`** på tool-kall (JSON-RPC `tools/call`).

```json
{
  "name": "generate_component_template",
  "arguments": { "componentType": "button", "style": "modern" },
  "_meta": {
    "progressToken": "abc-123",
    "client": "inspector"
  }
}
```

**Hva det er til:** Protokoll-/klient-spesifikke hint som serveren _kan_ lese — f.eks. progress-rapportering, sporings-ID, locale, foretrukket output-format.

**For tailwindcss-mcp-server i dag:** Verktøyene leser **ikke** `_meta` (ingen støtte i schema/kilde). Metadata sendes, men **ignoreres**. Nyttig først hvis du:

- forker serveren og legger til f.eks. `_meta.outputFormat: "tsx"`
- eller bygger egen wrapper-MCP som tolker metadata og post-prosesserer svaret

## Svakheter oppdaget (viktig for Utekos)

1. **`install_tailwind`** — genererer Tailwind **v3**-oppsett (`@tailwind base`, `tailwind.config.js`). Prosjektet bruker **v4 + `@import "tailwindcss"`** — ikke blindt kopier.
2. **`generate_color_palette`** — shade 50 ble _mørkere_ enn 500 for `#1e3a5f`. Verifiser alltid visuelt.
3. **`convert_css_to_tailwind`** — mange vanlige properties havner i `unsupportedStyles` (border, shadow, radius).
4. **`get_tailwind_utilities` med `search: "border"`** — returnerte `block`, `inline`, `hidden` (display), ikke border-utilities.
5. **`search_tailwind_docs`** — tynn indeks; lav relevans-score.

## Optimalisering — hva som faktisk hjelper

### I Cursor (uten å endre MCP-pakken)

1. **Kombiner med shadcn MCP** (allerede i `mcp.json`) — maler → shadcn-komponenter med tokens.
2. **Lagre MCP-svar i `.codex-plugin/tailwindcss-mcp-server/`** som referansebibliotek (som du gjør).
3. **Instruer agenten i AGENTS.md** — «etter MCP-kall: map til semantiske tokens».
4. **Bruk `convert_css_to_tailwind` mode `inline`** for raske én-liners, ikke `component` for komplekse kort.

### Hvis du vil forbedre MCP-en selv

Mulige PR-er til [CarbonoDev/tailwindcss-mcp-server](https://github.com/CarbonoDev/tailwindcss-mcp-server):

- `outputFormat: "html" | "tsx" | "jsx"` på `generate_component_template`
- Tailwind v4 `@theme` i stedet for `tailwind.config.js`-snutter
- Fikse farge-skala-algoritme (50 = lys, 950 = mørk)
- `_meta.locale: "nb"` for norske customization-tips
- Bedre docs-indeks (eller peke til Context7/MDN MCP for docs)

### Inspector-tips

```bash
npx @modelcontextprotocol/inspector npx -y tailwindcss-mcp-server
```

- Test alle 8 tools med varierende parametre
- Sammenlign `minimal` / `modern` / `playful` visuelt i en HTML-preview
- Eksporter svar til `.codex-plugin/` for gjenbruk i prompts

## Lagrede svar (denne sesjonen)

```
.codex-plugin/tailwindcss-mcp-server/
├── generate_component_template/
│   ├── modern_navbar.json
│   ├── modern_navbar.tsx      ← React-konvertering
│   ├── minimal_alert.json
│   └── playful_badge.json
├── convert_css_to_tailwind/
│   └── product_card_component_mode.json
├── generate_color_palette/
│   └── maritime_blue.json
└── search_tailwind_docs/
    └── theme_variables.json
```
