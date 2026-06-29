# PLAN

## Intro

### Status

Har allerede foregått oppsiktsvekkende mye slurv og direkte feil hva gjelder fargebruk og verifisering av variabler opp mot "dark" og "light" theme, av andre Agenter.

#### Eksempler på uakseptabel implementasjon:

- `sidebar-border` / `border` i header og sidebar er lik uavhengig av hvilken mode som kjøres.
- På src/app/(brand)/themes/page.tsx er kortene merkelig satt opp. En slags firkant inne i det firkantede kortet. Unødvendig - her er også f.eks fargen som Utekos sitt Card benytter på yttersiden uendret mellom theme `dark` og `light`.
  Har omtrent identisk med bakgrunnsfarrgen når man har light mode - beviser slurvet. Koble til `DnB` og `Vy` sin MCP-server :

Dette kan ikke utvikle seg ytterligere.
Det må strammes opp og presist gås gjennom hver eneste farge som benyttes som gjenbrukbar variabelfarge, og stille spørsmålet:

1. Er det implementert korrekt farge med hensyn til det de ulike MCP-serverne viser?
2. Er det implementert logikk for ulik farge mellom `dark`og `light` mode?
3. Hvis det er korrekt, er nok WCAG ikke et problem, fordi `DnB` og `Vy` har forsikret seg om at disse kravene etterfulges.

- Dermed er tilfeller med suboptimal kontrast et bevis på feil. For Havdyp og Utekos er saken en annen: Ikke ferdigutviklet.

---

## Steg 1

Endre nåværende "Utekos Brand" tekst i Header til Wordmark i public - veksle mellom svart og hvit avhengig av "Mode".

## Steg 2

Opprette en skuddsikker plan som rydder opp i nevt problemstillig en gang for alle og gjennomfør presist.

## Steg 3

I src/app/(brand)/themes/page skal ikke alle de ulike Theme sine kort vises samtidig med både dark og light verjon

- 1 liste med kort. Ett kort per theme. Dette kortet og dens detaljer endrer seg når Mode-knappen toggles.
- Kortene skal være trykkbar og

Følgende **WCAG-krav** skal alltid være med i vurderingen og sjekkes når man setter en farge:

- etterfølges

---

MCP som **SKAL** benyttes:

- a11y-color-contrast-m
- tailwindcss-mcp-server
- spor
- https://eufemia-mcp.eufemia.workers.dev/mcp
- mdn
- next-devtools
- evt apif for kontrast

design-system/dnb-design-tokens.md gir hjelp hvis - https://eufemia-mcp.eufemia.workers.dev/mcp er mindre optimal.

## Steg 4

- Undersøke med MDN og WCAG hva som er best praksis angående avstander til topp/bunn og sidene på dokumenter/nettsiden
- Opprette H1-komponent som er dedikert til sider med .mdx - legges til i mdx-components.tsx
- Opprette Global wrapper som sikrer at MDN og WCAG sine retningslinjer knytte til whitespace/padding/margin fra elementer og ut til siden/toppenvil bli benyttet

---

## Steg 5

Kopiere DnB sin proffe seksjon hvor de viser Demo knyttet til Theme Component - https://eufemia.dnb.no/uilib/usage/customisation/theming/theme/demos

- H1 er Theme component - etterfulgt av en slags Navigation Menu med 3 faner: Info, Demo og Properties. F.eks ifm med
  <Quoute> Surface dark" - Use surface="dark" to adjust component styles for dark backgrounds. </Quote>

Vises dette:

```tsx
<section
  style={{
    padding: '1rem',
    backgroundColor: 'var(--token-color-decorative-first-bold-static)',
  }}
>
  <Theme.Context surface="dark">
    <Button right>Primary button</Button>
    <Button variant="secondary" right>
      Secondary button
    </Button>
    <Anchor href="/">Anchor on dark surface</Anchor>
  </Theme.Context>
</section> du kan se på
```

Som man kan justere på programmerisk, trykke på knapp for å toggle mellom light/dark, velge fokus-mode - gjør området full-screen og åpner mulighet for å velge mellom "DnB, SBanken, DnB Eiendom og Carnegie. I tillegg til feltet over som viser de tre ulike knappevariantene.
Samme gjelder seksjonen over:

```tsx
const MyColors = styled.div`
  .eufemia-theme__dnb {
    --token-color-text-action: var(--color-sea-green);
  }
  .eufemia-theme__sbanken {
    --token-color-text-action: var(--sb-color-purple-alternative);
  }
`;
const MyComponent = () => {
  return (
    <P
      top
      style={{
        color: "var(--token-color-text-action)",
      }}
    >
      Text with different color based on theme. Change the theme to see the effect.
    </P>
  );
};
const Demo = () => {
  const [name, setName] = useState<ThemeNames>("dnb" as ThemeNames);
  return (
    <MyColors>
      <Dropdown
        data={{
          dnb: "DNB",
          sbanken: "Sbanken",
        }}
        value={name}
        onChange={({ data }) => setName(data.selectedKey as ThemeNames)}
      />
      <Theme name={name}>
        <MyComponent />
      </Theme>
    </MyColors>
  );
};
render(<Demo />);
```

- Mulig dette hentes enkelt via MCP, men konkret kodeinnsikt for nevnt seksjon kan ses her:

eufemia-insight/ComponentBoxProps.ts
eufemia-insight/BasicButtonsExample.tsx
eufemia-insight/demos.mdx
eufemia-insight/InfoCard.tsx
eufemia-insight/withComponentMarkers.ts
eufemia-insight/BasicButtonsExample.tsx
eufemia-insight/ButtonDocs.ts
eufemia-insight/Button.tsx

Med **BILDER** her:

1. eufemia-insight/fullscreen.png
2. eufemia-insight/section-context.png

Opprett så identisk som mulig. Legg gjerne et hint av egen merkevarelogikk i den, men dette finjusteres enkelt senere
Ubestemt hvor den skal plasseres i skrivende stund - men det finner jeg ut av.
Importere og teste gjerne på en eller annen side. Det er plass stort sett overalt.

---

## Steg 6

Disse 5 "ThemeToggles" i `ThemeToggle` i src/app/(brand)/themes/page.tsxi theme/page.mdx er så lite strukturet at det ser ut som man har kastet de inn på siden.
De har heller ingen hover-states eller cursor-pointer som indikerer at de fungerer og medfører action ved trykk.

- Kan evt plasseres på de to kappene på de ulikene Themene sitt Card, eller i dens nærhet.

## Canva

Color Pallets:

- Maritime Monochromatic
- Maritime Monochromatic Secondary
- All Year Pallet
- Teal
- PrimaryBlue

Custom:

- Orange
-

```css
--color-amber-50: oklch(98.7% 0.022 95.277);
--color-amber-100: oklch(96.2% 0.059 95.617);
--color-amber-200: oklch(92.4% 0.12 95.746);
--color-amber-300: oklch(87.9% 0.169 91.605);
--color-amber-400: oklch(82.8% 0.189 84.429);
--color-amber-500: oklch(76.9% 0.188 70.08);
--color-amber-600: oklch(66.6% 0.179 58.318);
--color-amber-700: oklch(55.5% 0.163 48.998);
--color-amber-800: oklch(47.3% 0.137 46.201);
--color-amber-900: oklch(41.4% 0.112 45.904);
--color-amber-950: oklch(27.9% 0.077 45.635);

--color-yellow-50: oklch(98.7% 0.026 102.212);
--color-yellow-100: oklch(97.3% 0.071 103.193);
--color-yellow-200: oklch(94.5% 0.129 101.54);
--color-yellow-300: oklch(90.5% 0.182 98.111);
--color-yellow-400: oklch(85.2% 0.199 91.936);
--color-yellow-500: oklch(79.5% 0.184 86.047);
--color-yellow-600: oklch(68.1% 0.162 75.834);
--color-yellow-700: oklch(55.4% 0.135 66.442);
--color-yellow-800: oklch(47.6% 0.114 61.907);
--color-yellow-900: oklch(42.1% 0.095 57.708);
--color-yellow-950: oklch(28.6% 0.066 53.813);

--color-maritime-50: oklch(0.97 0.008 279.42);
--color-maritime-100: oklch(0.92 0.015 279.42);
--color-maritime-200: oklch(0.84 0.025 279.42);
--color-maritime-300: oklch(0.74 0.032 279.42);
--color-maritime-400: oklch(0.64 0.036 279.42);
--color-maritime-500: oklch(0.54 0.036 279.42);
--color-maritime-600: oklch(0.44 0.036 279.42);
--color-maritime-700: oklch(0.35 0.036 279.42);
--color-maritime-800: oklch(0.2884 0.0366 279.42);
--color-maritime-900: oklch(0.2 0.03 279.42);
--color-maritime-950: oklch(0.12 0.02 279.42);

--color-teal-50: oklch(98.4% 0.014 180.72);
--color-teal-100: oklch(95.3% 0.051 180.801);
--color-teal-200: oklch(91% 0.096 180.426);
--color-teal-300: oklch(85.5% 0.138 181.071);
--color-teal-400: oklch(77.7% 0.152 181.912);
--color-teal-500: oklch(70.4% 0.14 182.503);
--color-teal-600: oklch(60% 0.118 184.704);
--color-teal-700: oklch(51.1% 0.096 186.391);
--color-teal-800: oklch(43.7% 0.078 188.216);
--color-teal-900: oklch(38.6% 0.063 188.416);
--color-teal-950: oklch(27.7% 0.046 192.524);
--color-primary-blue-900: #00a0d6;
--color-primary-blue: #009cde;
--color-primary-800: #7499f7;
```
