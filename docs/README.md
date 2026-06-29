## Manglende innsikt i kildekode og arkitektur

Selv om dokumentasjonsinnsikten er meget god, gir dagens løsning et ufullstendig bilde av den underliggende arkitekturen. Systemet mangler direkte tilgang til selve kildekoden, noe som skaper blindsoner på to hovedområder:

**1. Portalens infrastruktur (`dnb-design-system-portal`)**
AI-en får lese det ferdige innholdet portalen publiserer, men mangler innsikt i maskineriet som driver den. Det er ingen tilgang til:

- Vite/static-site-pipelinen og bygge-skript.
- Interne komponenter som utgjør selve portalens grensesnitt.
- Logikken bak routing, meny-generering og Algolia-søkeimplementasjonen.
- React- og MDX-kjøretidsmiljøet (runtime), samt den fulle filstrukturen i workspace-et.

**2. Komponentbibliotekets internlogikk (`@dnb/eufemia`)**
For forbruk av API-et er informasjonen dekkende, men for dypere forståelse mangler fundamentale kildedata:

- Faktiske kildekodefiler (som `.tsx` for React-komponenter og `.scss` for BEM-implementasjon).
- Interne _hooks_, verktøyfunksjoner (utilities) og testfiler (inkludert visuelle regresjonstester).
- Kompilert output, eksporterte manifests (inkludert detaljer for _tree-shaking_) og rå filer som `properties.js` eller `tokens.css`.
- Nøyaktig diff (endringslogg) mellom den spesifikke versjonen som er installert og den hostede dokumentasjonen.

---

## Optimaliseringsmuligheter for verktøykassen (MCP)

For at integrasjonen skal bli sømløs og komplett – spesielt for avansert utvikling, feilsøking og arkitekturvalg – bør verktøykassen utvides med følgende funksjonalitet:

### **Verktøy for eksakte oppslag (`search_exact_identifier`):**

Dagens fritekstsøk er ofte for upresist ("mykt"). Det er behov for et verktøy som kan gjøre eksakte søk på CSS-variabler, spesifikke _props_ og eksporterte moduler (for eksempel oppslag direkte på `--token-color-text-neutral-ondark`).

### **Direkte kildekode-innsyn (`component_source` & `source_read`):**

I stedet for å kun lese dokumentasjon, bør et oppslag på en komponent (f.eks. "Button") ideelt sett returnere selve React-komponenten, den tilhørende styling-filen og testfilene. Dette er avgjørende for å forstå faktisk runtime-atferd.

### **Strukturerte designtokens (`token_inventory` & `token_resolve`):**

Dagens dokumentasjon presenterer tokens primært i tabellform. For å bygge robuste systemer bør farge-, typografi- og avstands-tokens kunne hentes ut som ren, strukturert data (JSON). Verktøyet bør også kunne oppløse tokens basert på spesifikke temaer og fargemoduser (light/dark).

### **Kontekst og versjonskontroll (`version_context`):**

Et verktøy som synkroniserer hostet dokumentasjonsversjon, installert NPM-pakke, commit-hash og byggetidspunkt for å fullstendig eliminere versjonsusikkerhet.

### **Navigasjon i repoet (`repo_tree` & `package_manifest`):**

Mulighet til å kartlegge filstrukturen og lese package.json-definisjoner for å forstå avhengigheter og eksport-strukturer.

---

### Hva som mangler for “perfekt” sømløshet

For at dette skulle vært optimalt for meg, burde MCP-en hatt flere presise tools:

```ts
repo_tree()
source_search(query, path?)
source_read(path)
package_manifest(workspace)
exports_map(package)
component_source(componentName)
component_style(componentName)
component_tests(componentName)
token_inventory(theme)
token_resolve(tokenName, theme, colorScheme)
css_variable_inventory(theme)
changelog_diff(fromVersion, toVersion)
version_resolve(installedVersion)
figma_token_export_read()
```

---

### Spesielt verdifulle ville vært:

1. component_source("Button")

Returnerer:

```jsonc
packages/dnb-eufemia/src/components/button/Button.tsx
packages/dnb-eufemia/src/components/button/style/_button.scss
packages/dnb-eufemia/src/components/button/__tests__/Button.test.tsx
```

Da kunne jeg forstå faktisk runtime-atferd, ikke bare docs.

---

2. token_inventory("ui")

Returnerer komplett tokenstruktur som data:

```json
{
  "--token-color-background-action": {
    "dnbLight": "#007272",
    "dnbDark": "#A5E1D2",
    "sbankenLight": "#4E08BC"
  }
}
```

---

Dagens dokumentasjon viser mye av dette, men det er fortsatt “docs-table”-form, ikke ideelt som robust datakilde.

3. version_context()

Returnerer:

hostedDocsVersion
packageRelease
commit
installedPackageVersion
portalBuildTime

---

Dette ville eliminert versjonsusikkerhet.

4. `search_exact_identifier()`

For søk etter tokens, exports, propnavn og CSS-variabler er vanlig fritekstsøk ofte for mykt. Jeg trenger eksakt symbol-/identifier-søk.

**Eksempel:**

```css
--token-color-text-neutral-on-dark
ButtonProps
surface="dark"
ui-theme-components.min.css
```

---

## Konsekvens for prosjekter på høyt nivå

Med dagens begrensninger er verktøyene utmerkede for å bruke Eufemia i tråd med dokumentasjonen. De er imidlertid _ikke_ tilstrekkelige for å kreve komplett forståelse av kildekoden.

For profesjonelt arbeid med strenge krav til kodekvalitet og universell utforming (tilsvarende ambisjonsnivået for Utekos), vil dagens verktøy fungere som den primære dokumentasjonsautoriteten. Før det tas presise arkitekturvalg, utføres token-audits, implementeres overstyringer i styling, eller skrives bidrag tilbake til kildekoden, vil det likevel kreves manuelt, direkte innsyn i det faktiske repoet eller installerte `node_modules`.

---

## Dedikert Secure MCP Tunnel til ChatGPT

Dette repoet har nå en egen read-only MCP-server for ChatGPT:

```txt
Utekos Brand Eufemia Insight
```

Formålet er å dekke hullene over uten å blande inn en generisk filsystem- eller Docker-profil. Serveren eksponerer presise tools for:

- eksakt identifier-søk
- direkte kilde-/snapshot-lesing
- komponentkilde, stilfiler og testfunn
- token inventory og token resolution
- CSS-variable inventory
- package manifest og exports map
- Eufemia/version context
- changelog-vindu
- lokal Figma token snapshot

Serveren er read-only og returnerer `structuredContent`, `outputSchema` og read-only tool annotations på alle tools.

### Lokale filer

```txt
scripts/mcp/utekos-brand-eufemia-server.mjs
scripts/mcp/doctor-utekos-brand-eufemia-server.mjs
scripts/mcp/openai-tunnel.mjs
config/mcp/chatgpt-profiles.json
.env.tunnel.example
```

### Verifiser MCP-serveren

Kjør fra repo-roten:

```bash
pnpm mcp:brand-eufemia:doctor
```

Forventet resultat:

```txt
RESULT accepted
```

Doctoren starter serveren over stdio, gjennomfører MCP initialize, lister tools, sjekker at alle tools har `outputSchema`, bekrefter read-only annotations og kaller representative tools.

### Sett opp tunnel lokalt

Opprett lokal tunnel-env:

```bash
pnpm mcp:tunnel:bootstrap-env
```

Fyll deretter inn i `.env.tunnel.local`:

```bash
CONTROL_PLANE_TUNNEL_ID=
CONTROL_PLANE_API_KEY=
```

Hvis lokal tunnel-auth fra `utekos-headless` skal gjenbrukes, kjør:

```bash
pnpm mcp:tunnel:reuse-headless-auth
```

Da kopieres kun `CONTROL_PLANE_API_KEY` fra `../utekos-headless/.env.tunnel.local`. `CONTROL_PLANE_TUNNEL_ID` kopieres ikke, fordi denne profilen skal ha en dedikert tunnel. Etter dette trenger du normalt bare å legge inn den nye tunnel-ID-en i `.env.tunnel.local`.

Auth-kravet i ChatGPT skal holdes enkelt: velg **No Authentication** i ChatGPT app-/connector-oppsettet. `CONTROL_PLANE_API_KEY` brukes lokalt av `tunnel-client` mot OpenAI Secure MCP Tunnel, ikke som app-auth i ChatGPT.

Initialiser tunnelprofilen:

```bash
pnpm mcp:tunnel:init:eufemia
```

Start tunnel:

```bash
pnpm mcp:tunnel:start:eufemia
```

Sjekk status:

```bash
pnpm mcp:tunnel:status:eufemia
```

Forvent:

```txt
profile=utekos-brand-eufemia
target=eufemia
healthz=ok
readyz=ok
```

For foreground-kjøring:

```bash
pnpm mcp:tunnel:run:eufemia
```

Stopp bakgrunnstunnel:

```bash
pnpm mcp:tunnel:stop:eufemia
```

### ChatGPT metadata

Bruk metadata fra `config/mcp/chatgpt-profiles.json`:

```txt
Connector/App name: Utekos Brand Eufemia Insight
Authentication: No Authentication
Tunnel profile: utekos-brand-eufemia
Health UI: http://127.0.0.1:8086/ui
```

Beskrivelse:

```txt
Use when Utekos brand work needs precise DNB/Eufemia component, style, token, package, changelog, or local source-snapshot evidence. Prefer exact identifier lookup before reading files. The server is read-only and returns structured outputs with output schemas.
```

### Acceptance prompt i ChatGPT

Etter at appen er opprettet eller refreshet:

```txt
Use the Utekos Brand Eufemia Insight app. First call brand_eufemia_bootstrap, then version_context, then search_exact_identifier for Button or --token-color-text-neutral-on-dark. Do not use built-in browsing or a generic Eufemia docs connector.
```

Hvis ChatGPT viser `mcp-find`, `mcp-activate-profile`, generiske Docker-verktøy, eller mangler `brand_eufemia_bootstrap`, er connector-metadata stale eller peker feil. Start/hold tunnelen oppe og refresh eller opprett appen på nytt.

### Canonical tools

```txt
brand_eufemia_bootstrap
connector_surface_audit
tool_inventory
search_exact_identifier
source_search
source_read
repo_tree
package_manifest
exports_map
component_source
component_style
component_tests
token_inventory
token_resolve
css_variable_inventory
version_context
changelog_diff
figma_token_export_read
```

### Kildegrenser

Denne MCP-en skiller mellom tre kildetyper:

- installert `@dnb/eufemia` i `node_modules/@dnb/eufemia`
- repo-local snapshots under `docs/mcp/dnb` og `docs/eufemia-insight`
- Utekos Brand sine egne theme/source-filer under `styles`, `src`, `components`, `lib` og `config`

Hvis installert pakke eller lokale snapshots ikke inneholder ønsket kildefil, skal ChatGPT rapportere kildemangelen i stedet for å gjette.

### Offisiell dokumentasjonsbaseline

Oppsettet følger OpenAI Secure MCP Tunnel og ChatGPT Developer Mode/MCP-app dokumentasjonen:

- https://developers.openai.com/api/docs/guides/secure-mcp-tunnels
- https://developers.openai.com/apps-sdk/deploy/connect-chatgpt
- https://developers.openai.com/api/docs/guides/developer-mode
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
