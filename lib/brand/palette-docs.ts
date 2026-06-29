import type { Route } from "next";

export type PaletteDocId =
  | "maritime-monochromatic"
  | "maritime-monochromatic-secondary"
  | "all-year-palette"
  | "teal"
  | "primary-blue"
  | "hovedpalett";

export type PaletteDocColor = {
  id: string;
  label: string;
  token: string;
  value: string;
  color: string;
  description: string;
  psychology: string;
};

export type PaletteTokenMapping = {
  semanticToken: string;
  primitiveToken: string;
  role: string;
  usage: string;
};

export type PaletteDoc = {
  id: PaletteDocId;
  title: string;
  shortTitle: string;
  href: Route;
  summary: string;
  sourceLabel: string;
  sourceDetail: string;
  intent: string;
  colors: PaletteDocColor[];
  tokenMappings: PaletteTokenMapping[];
  usage: string[];
  avoid: string[];
};

export type PaletteDocIndexItem = {
  id: PaletteDocId;
  title: string;
  href: Route;
  summary: string;
  swatches: PaletteDocColor[];
};

type ScaleStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

type ScaleColorInput = { step: ScaleStep; value: string };

const maritimeScale: ScaleColorInput[] = [
  { step: 50, value: "oklch(0.97 0.008 279.42)" },
  { step: 100, value: "oklch(0.92 0.015 279.42)" },
  { step: 200, value: "oklch(0.84 0.025 279.42)" },
  { step: 300, value: "oklch(0.74 0.032 279.42)" },
  { step: 400, value: "oklch(0.64 0.036 279.42)" },
  { step: 500, value: "oklch(0.54 0.036 279.42)" },
  { step: 600, value: "oklch(0.44 0.036 279.42)" },
  { step: 700, value: "oklch(0.35 0.036 279.42)" },
  { step: 800, value: "oklch(0.2884 0.0366 279.42)" },
  { step: 900, value: "oklch(0.2 0.03 279.42)" },
  { step: 950, value: "oklch(0.12 0.02 279.42)" },
];

const maritimeSecondaryScale: ScaleColorInput[] = [
  { step: 50, value: "#edfafa" },
  { step: 100, value: "#d5f3f3" },
  { step: 200, value: "#aee6e6" },
  { step: 300, value: "#7bd1d1" },
  { step: 400, value: "#45b4b4" },
  { step: 500, value: "#1f9494" },
  { step: 600, value: "#0f7777" },
  { step: 700, value: "#055f5f" },
  { step: 800, value: "#064d4d" },
  { step: 900, value: "#073f3f" },
  { step: 950, value: "#042525" },
];

const amberScale: ScaleColorInput[] = [
  { step: 50, value: "oklch(98.7% 0.022 95.277)" },
  { step: 100, value: "oklch(96.2% 0.059 95.617)" },
  { step: 200, value: "oklch(92.4% 0.12 95.746)" },
  { step: 300, value: "oklch(87.9% 0.169 91.605)" },
  { step: 400, value: "oklch(82.8% 0.189 84.429)" },
  { step: 500, value: "oklch(76.9% 0.188 70.08)" },
  { step: 600, value: "oklch(66.6% 0.179 58.318)" },
  { step: 700, value: "oklch(55.5% 0.163 48.998)" },
  { step: 800, value: "oklch(47.3% 0.137 46.201)" },
  { step: 900, value: "oklch(41.4% 0.112 45.904)" },
  { step: 950, value: "oklch(27.9% 0.077 45.635)" },
];

const yellowScale: ScaleColorInput[] = [
  { step: 50, value: "oklch(98.7% 0.026 102.212)" },
  { step: 100, value: "oklch(97.3% 0.071 103.193)" },
  { step: 200, value: "oklch(94.5% 0.129 101.54)" },
  { step: 300, value: "oklch(90.5% 0.182 98.111)" },
  { step: 400, value: "oklch(85.2% 0.199 91.936)" },
  { step: 500, value: "oklch(79.5% 0.184 86.047)" },
  { step: 600, value: "oklch(68.1% 0.162 75.834)" },
  { step: 700, value: "oklch(55.4% 0.135 66.442)" },
  { step: 800, value: "oklch(47.6% 0.114 61.907)" },
  { step: 900, value: "oklch(42.1% 0.095 57.708)" },
  { step: 950, value: "oklch(28.6% 0.066 53.813)" },
];

const tealScale: ScaleColorInput[] = [
  { step: 50, value: "oklch(98.4% 0.014 180.72)" },
  { step: 100, value: "oklch(95.3% 0.051 180.801)" },
  { step: 200, value: "oklch(91% 0.096 180.426)" },
  { step: 300, value: "oklch(85.5% 0.138 181.071)" },
  { step: 400, value: "oklch(77.7% 0.152 181.912)" },
  { step: 500, value: "oklch(70.4% 0.14 182.503)" },
  { step: 600, value: "oklch(60% 0.118 184.704)" },
  { step: 700, value: "oklch(51.1% 0.096 186.391)" },
  { step: 800, value: "oklch(43.7% 0.078 188.216)" },
  { step: 900, value: "oklch(38.6% 0.063 188.416)" },
  { step: 950, value: "oklch(27.7% 0.046 192.524)" },
];

const primaryBlueScale: ScaleColorInput[] = [
  { step: 50, value: "#ecfbff" },
  { step: 100, value: "#d4f5ff" },
  { step: 200, value: "#a8eaff" },
  { step: 300, value: "#70ddff" },
  { step: 400, value: "#29c9ff" },
  { step: 500, value: "#009cde" },
  { step: 600, value: "#0085b5" },
  { step: 700, value: "#006b94" },
  { step: 800, value: "#075a7a" },
  { step: 900, value: "#0a4b66" },
  { step: 950, value: "#063047" },
];

const hovedpalettColors: PaletteDocColor[] = [
  color({
    id: "maritime-blue",
    label: "Maritime Blue",
    token: "--color-maritime-blue",
    value: "oklch(0.2948 0.0419 195.12)",
    description: "Primær, dyp brandfarge for navigasjon, identitet og tydelige handlingsflater.",
    psychology:
      "Dyp blågrønn signaliserer ro, presisjon og faglig trygghet. Den bør bære struktur og autoritet, ikke dekorere alt samtidig.",
  }),
  color({
    id: "cloud-dancer",
    label: "Cloud Dancer",
    token: "--color-cloud-dancer",
    value: "oklch(0.9493 0.007 88.64)",
    description: "Lys, varm nøytral for flater, cards og rolig whitespace.",
    psychology:
      "Varm off-white oppleves mer menneskelig enn ren hvit. Den gir luft, ro og mindre digital hardhet i lange dokumentsider.",
  }),
  color({
    id: "iced-apricot",
    label: "Iced Apricot",
    token: "--color-iced-apricot",
    value: "oklch(0.86 0.09 63)",
    description: "Varm aksent for highlights, statusflater og små emosjonelle løft.",
    psychology:
      "Aprikos tilfører varme, omsorg og tilgjengelighet. Bruk den som menneskelig kontrapunkt til maritime og tekniske toner.",
  }),
  color({
    id: "fjellbla",
    label: "Fjellblå",
    token: "--color-fjellbla",
    value: "oklch(0.45 0.055 225)",
    description: "Sekundær blå for lenker, sekundære handlinger og informasjonsflater.",
    psychology:
      "Kjølig blå forbindes med oversikt, distanse og pålitelighet. Den fungerer best når den får støtte av varmere nøytraler.",
  }),
  color({
    id: "havdyp-950",
    label: "Havdyp 950",
    token: "--color-havdyp-950",
    value: "oklch(0.1142 0.0511 290.62)",
    description: "Mørkeste tekst-, bakgrunns- og dark-surface-verdi.",
    psychology:
      "Nesten nattlig havdyp gir tyngde og konsentrasjon. Den passer for premium, kontroll og tydelige kontrastflater.",
  }),
  color({
    id: "havdyp-900",
    label: "Havdyp 900",
    token: "--color-havdyp-900",
    value: "oklch(0.16 0.048 285)",
    description: "Mørk brandflate for hero, footer og fremhevede moduler.",
    psychology:
      "Mørke blåfiolette toner gir dybde og seriøsitet. Bruk dem i store flater kun når innholdet trenger tydelig ramme.",
  }),
  color({
    id: "havdyp-800",
    label: "Havdyp 800",
    token: "--color-havdyp-800",
    value: "oklch(0.22 0.044 280)",
    description: "Mørk, men noe mykere, flateverdi for paneler og sekundære mørke soner.",
    psychology:
      "Mykere mørk blå gir mindre dramatikk enn 950, men beholder en teknisk og maritim karakter.",
  }),
  color({
    id: "parchment-50",
    label: "Parchment 50",
    token: "--color-parchment-50",
    value: "oklch(0.9649 0.005 78.3)",
    description: "Primær page background i lyse theme-varianter.",
    psychology:
      "Parchment gir en papirlignende ro som passer til dokumentasjon, lesing og lange beslutningsflater.",
  }),
  color({
    id: "parchment-100",
    label: "Parchment 100",
    token: "--color-parchment-100",
    value: "oklch(0.9306 0.01 93.57)",
    description: "Subtilt mørkere nøytral for paneler, skilleflater og rolige seksjoner.",
    psychology: "En svak varmetone skaper hierarki uten at grensesnittet føles grått eller flatt.",
  }),
  color({
    id: "vargnatt",
    label: "Vargnatt",
    token: "--color-vargnatt",
    value: "oklch(0.16 0.048 285)",
    description: "Alternativ mørk identitetsverdi for nattlige flater og illustrativ kontrast.",
    psychology:
      "Navnet og fargen gir en mer nordisk, mørk og særpreget tone. Brukes sparsomt for å unngå tung opplevelse.",
  }),
  color({
    id: "teal-600",
    label: "Teal 600",
    token: "--color-teal-600",
    value: "oklch(60% 0.118 184.704)",
    description: "Frisk støttefarge for aktive elementer, grafer og små navigasjonssignaler.",
    psychology:
      "Teal kombinerer blå trygghet med grønn vitalitet. Den fungerer godt når produktet skal føles både presist og levende.",
  }),
  color({
    id: "amber-400",
    label: "Amber 400",
    token: "--color-amber-400",
    value: "oklch(82.8% 0.189 84.429)",
    description: "Synlig varm aksent for varsling, highlights og sesongmarkører.",
    psychology:
      "Amber gir energi og oppmerksomhet. Den bør brukes som signal, ikke som dominerende struktur.",
  }),
];

const paletteDocs: Record<PaletteDocId, PaletteDoc> = {
  hovedpalett: {
    id: "hovedpalett",
    title: "Hovedpalett",
    shortTitle: "Hovedpalett",
    href: "/theme/palettes/hovedpalett" as Route,
    summary:
      "Hovedpaletten samler de bærende Utekos-fargene for flater, tekst, handlinger, varme aksenter og mørke maritime uttrykk.",
    sourceLabel: "styles/tokens/palette.css + aktiv Utekos-retning",
    sourceDetail:
      "Denne siden er ment som primær brand-palett. UI-komponenter skal ikke velge disse fargene direkte etter smak, men via semantiske design tokens.",
    intent:
      "Skal gi et ryddig grunnlag for light/dark theme, produktflater, dokumentasjon og realistiske komponenteksempler.",
    colors: hovedpalettColors,
    tokenMappings: [
      token(
        "--token-color-background-page-background",
        "--color-parchment-50",
        "Sidebakgrunn",
        "Standard bakgrunn på lyse dokumentasjonssider.",
      ),
      token(
        "--token-color-background-neutral",
        "--color-cloud-dancer",
        "Nøytral flate",
        "Cards, paneler og rolige innholdsflater.",
      ),
      token(
        "--token-color-background-neutral-subtle",
        "--color-parchment-100",
        "Subtil nøytral flate",
        "Sekundære paneler og svake seksjonsdelere.",
      ),
      token(
        "--token-color-text-neutral",
        "--color-havdyp-950",
        "Primær tekst",
        "Brødtekst, overskrifter og høy kontrast på lyse flater.",
      ),
      token(
        "--token-color-background-action",
        "--color-maritime-blue",
        "Primær handling",
        "Primærknapper, aktive states og tydelige handlingsflater.",
      ),
      token(
        "--token-color-background-info-subtle",
        "--color-fjellbla",
        "Informasjon",
        "Informasjonsflater, lenker og sekundære handlinger.",
      ),
      token(
        "--token-color-background-warning-subtle",
        "--color-iced-apricot",
        "Varm aksent",
        "Milde varsler, highlights og emosjonelle løft.",
      ),
      token(
        "--token-color-decorative-first-base",
        "--color-teal-600",
        "Dekorativ støtte",
        "Grafer, illustrasjoner og mindre brandmarkører.",
      ),
      token(
        "--token-color-decorative-second-base",
        "--color-amber-400",
        "Dekorativ aksent",
        "Små sesong- og oppmerksomhetssignaler.",
      ),
    ],
    usage: [
      "Bruk Maritime Blue som primær identitets- og handlingsfarge.",
      "Bruk Parchment og Cloud Dancer til å skape dokumentasjonsro og lesbarhet.",
      "Bruk Havdyp-tonene for mørke flater, footer, hero og premium/teknisk tyngde.",
      "Bruk Iced Apricot, Amber og Teal som kontrollerte aksenter, ikke som parallelle hovedfarger.",
    ],
    avoid: [
      "Ikke bruk alle aksentene samtidig i samme komponentområde.",
      "Ikke legg lang brødtekst direkte på sterke aksenter uten kontrastsjekk.",
      "Ikke bruk rå primitive tokens i komponentkode når semantisk token finnes.",
    ],
  },
  "maritime-monochromatic": {
    id: "maritime-monochromatic",
    title: "Maritime Monochromatic",
    shortTitle: "Maritime",
    href: "/theme/palettes/maritime-monochromatic" as Route,
    summary:
      "En rolig monokrom skala for maritime, seriøse og dokumentasjonsorienterte flater. Skalaen egner seg spesielt godt til dybde, hierarki og struktur.",
    sourceLabel: "PLAN.md — --color-maritime-50 til --color-maritime-950",
    sourceDetail:
      "Verdiene er hentet fra den eksisterende PLAN.md-skalaen og gjøres eksplisitte som primitive palette tokens.",
    intent:
      "Skal fungere som kontrollert brand-skala for mørk/lys balanse, panelsystemer, navigasjon og avledede nyanser",
    colors: makeScale({
      idPrefix: "maritime",
      labelPrefix: "Maritime",
      tokenPrefix: "--color-maritime",
      colors: maritimeScale,
      psychology:
        "Maritime toner gir ro, pålitelighet og faglig tyngde. Lysere trinn gir luft og distanse; mørkere trinn gir autoritet og konsentrasjon.",
    }),
    tokenMappings: [
      token(
        "--token-color-background-page-background",
        "--color-maritime-50",
        "Lys sidebakgrunn",
        "Alternativ kjølig dokumentasjonsbakgrunn.",
      ),
      token(
        "--token-color-background-neutral-subtle",
        "--color-maritime-100",
        "Subtil flate",
        "Svake paneler og seksjoner.",
      ),
      token(
        "--token-color-stroke-neutral",
        "--color-maritime-300",
        "Border",
        "Lavmælt kantlinje på lyse flater.",
      ),
      token(
        "--token-color-background-action",
        "--color-maritime-700",
        "Handling",
        "Primær handling med tydelig maritim karakter.",
      ),
      token(
        "--token-color-text-neutral",
        "--color-maritime-950",
        "Tekst",
        "Mørk tekst på lyse maritime flater.",
      ),
      token(
        "--token-color-background-inverse",
        "--color-maritime-950",
        "Mørk flate",
        "Hero, footer og mørk seksjon.",
      ),
    ],
    usage: [
      "Bruk 50–200 til bakgrunner og subtile flater.",
      "Bruk 300–500 til borders, sekundærgrafikk og deaktivert visuell tyngde.",
      "Bruk 600–800 til handling, navigasjon og aktiv tilstand.",
      "Bruk 900–950 til mørk surface og tekst på lyse flater.",
    ],
    avoid: [
      "Ikke bruk midttoner som brødtekst uten kontrastsjekk.",
      "Ikke bruk 950 som stor bakgrunn uten tilstrekkelig lys tekst og spacing.",
      "Ikke bruk hele skalaen i én komponent; velg 2–3 trinn per mønster.",
    ],
  },
  "maritime-monochromatic-secondary": {
    id: "maritime-monochromatic-secondary",
    title: "Maritime Monochromatic Secondary",
    shortTitle: "Maritime Secondary",
    href: "/theme/palettes/maritime-monochromatic-secondary" as Route,
    summary:
      "Sekundær maritim teal-retning basert på #055F5F. Paletten gir mer friskhet og digital energi enn den dypere Maritime Monochromatic-skalaen.",
    sourceLabel: "Arbeidsforslag — #055F5F-basert sekundærskala",
    sourceDetail:
      "PLAN.md inneholdt ikke en ferdig secondary-skala. Denne siden gjør derfor et eksplisitt arbeidsforslag synlig i stedet for å blande sekundærverdiene inn i hovedsiden.",
    intent:
      "Skal brukes som støttepalett for interaktive markører, datavisualisering, badges og produktflater som trenger mer friskhet.",
    colors: makeScale({
      idPrefix: "maritime-secondary",
      labelPrefix: "Maritime Secondary",
      tokenPrefix: "--color-maritime-secondary",
      colors: maritimeSecondaryScale,
      psychology:
        "Teal ligger mellom blå trygghet og grønn vitalitet. Den oppleves mer aktiv og moderne enn ren mørk maritime, men bør fortsatt brukes kontrollert.",
    }),
    tokenMappings: [
      token(
        "--token-color-background-info-subtle",
        "--color-maritime-secondary-100",
        "Subtil infoflate",
        "Lette informasjonskort og bakgrunner.",
      ),
      token(
        "--token-color-stroke-info",
        "--color-maritime-secondary-500",
        "Infoborder",
        "Kantlinjer, markører og aktive filtervalg.",
      ),
      token(
        "--token-color-background-action-hover",
        "--color-maritime-secondary-600",
        "Hover",
        "Hover-state når Maritime Secondary brukes i interaktive mønstre.",
      ),
      token(
        "--token-color-background-action",
        "--color-maritime-secondary-700",
        "Handling",
        "Sterk sekundær handling eller aktiv markør.",
      ),
      token(
        "--token-color-text-neutral",
        "--color-maritime-secondary-950",
        "Mørk tekst",
        "Tekst på lyse teal-flater.",
      ),
    ],
    usage: [
      "Bruk den som sekundær palett, ikke som erstatning for hovedpaletten.",
      "Bruk 500–700 for aktiv markering, badge og datavisualisering.",
      "Bruk 50–200 som rolige infoflater.",
    ],
    avoid: [
      "Ikke kombiner for mange teal-trinn med amber/yellow i samme seksjon.",
      "Ikke bruk 300–500 som brødtekst på hvit uten kontrastsjekk.",
      "Ikke la secondary-paletten overstyre primær navigasjon dersom Maritime Blue er aktiv theme-bærer.",
    ],
  },
  "all-year-palette": {
    id: "all-year-palette",
    title: "All Year Palette",
    shortTitle: "All Year",
    href: "/theme/palettes/all-year-palette" as Route,
    summary:
      "En varm, sesongrobust støttepalett basert på amber og yellow. Den bør brukes til signaler, highlights og visuell varme — ikke som hovedstruktur.",
    sourceLabel: "PLAN.md — amber og yellow scales",
    sourceDetail:
      "All Year Palette samler de definerte amber- og yellow-verdiene i én dedikert side, slik at de ikke forstyrrer theme-sidene.",
    intent:
      "Skal gi kontrollerte varme aksenter for kampanjer, varsler, highlights og produktkort uten å svekke den maritime grunnidentiteten.",
    colors: [
      ...makeScale({
        idPrefix: "amber",
        labelPrefix: "Amber",
        tokenPrefix: "--color-amber",
        colors: amberScale,
        psychology:
          "Amber gir oppmerksomhet, optimisme og varme. Den fungerer best når den brukes som kontrollert signal mot rolige nøytraler.",
      }),
      ...makeScale({
        idPrefix: "yellow",
        labelPrefix: "Yellow",
        tokenPrefix: "--color-yellow",
        colors: yellowScale,
        psychology:
          "Yellow oppleves mer direkte og energisk enn amber. Den bør brukes smått og målrettet for å unngå støy.",
      }),
    ],
    tokenMappings: [
      token(
        "--token-color-background-warning-subtle",
        "--color-amber-100",
        "Subtil warning",
        "Milde varslingsflater og forklarende bokser.",
      ),
      token(
        "--token-color-background-warning",
        "--color-amber-400",
        "Warning",
        "Tydelig varsel, badge eller statusmarkør.",
      ),
      token(
        "--token-color-icon-warning",
        "--color-amber-700",
        "Warning icon",
        "Ikoner som skal signalisere oppmerksomhet uten feiltilstand.",
      ),
      token(
        "--token-color-decorative-second-base",
        "--color-yellow-400",
        "Dekorativ energi",
        "Små grafiske markører og kampanjedetaljer.",
      ),
      token(
        "--token-color-text-warning",
        "--color-amber-900",
        "Warning text",
        "Tekst på lyse warning-flater.",
      ),
    ],
    usage: [
      "Bruk amber til varmere og mer beherskede signaler.",
      "Bruk yellow når elementet faktisk må fange oppmerksomhet raskt.",
      "Kombiner med Parchment/Cloud Dancer for å holde uttrykket premium og rolig.",
    ],
    avoid: [
      "Ikke bruk yellow som stor bakgrunn bak mye tekst.",
      "Ikke bland amber og yellow med rød/oransje uten tydelig statuslogikk.",
      "Ikke bruk varm palett til primær navigasjon med mindre siden er en kampanjevariant.",
    ],
  },
  teal: {
    id: "teal",
    title: "Teal",
    shortTitle: "Teal",
    href: "/theme/palettes/teal" as Route,
    summary:
      "En tydelig teal-skala for støttehandlinger, datavisualisering, positive signaler og moderne digitale markører.",
    sourceLabel: "PLAN.md — --color-teal-50 til --color-teal-950",
    sourceDetail:
      "Teal-skalaen holdes på egen side slik at den kan vurderes separat fra hovedpaletten og maritime secondary.",
    intent:
      "Skal tilføre friskhet og fremdrift der hovedpaletten blir for tung, særlig i produktkort, badges, grafer og interaktive markører.",
    colors: makeScale({
      idPrefix: "teal",
      labelPrefix: "Teal",
      tokenPrefix: "--color-teal",
      colors: tealScale,
      psychology:
        "Teal balanserer tillit og vitalitet. Den er teknisk nok til B2B/dokumentasjon og frisk nok til produkt- og marketingflater.",
    }),
    tokenMappings: [
      token(
        "--token-color-background-positive-subtle",
        "--color-teal-100",
        "Subtil positiv flate",
        "Suksessmeldinger, onboarding og bekreftelser.",
      ),
      token(
        "--token-color-background-positive",
        "--color-teal-500",
        "Positiv status",
        "Badges, check-states og positive statusflater.",
      ),
      token(
        "--token-color-icon-positive",
        "--color-teal-700",
        "Positivt ikon",
        "Ikoner og små indikatorer.",
      ),
      token(
        "--token-color-decorative-first-base",
        "--color-teal-600",
        "Dekorativ støtte",
        "Grafer og produktillustrasjoner.",
      ),
      token(
        "--token-color-text-positive",
        "--color-teal-900",
        "Positiv tekst",
        "Tekst på lyse positive flater.",
      ),
    ],
    usage: [
      "Bruk 500–700 til aktive digitale markører.",
      "Bruk 50–200 for myke positive flater.",
      "Bruk 800–950 for tekst, ikoner og mørke teal-paneler.",
    ],
    avoid: [
      "Ikke bruk teal som universell primærfarge dersom Maritime Blue allerede eier den rollen.",
      "Ikke bland teal og Maritime Secondary uten tydelig forskjell i rolle.",
      "Ikke bruk lave kontrastkombinasjoner som teal 300 på hvit tekst.",
    ],
  },
  "primary-blue": {
    id: "primary-blue",
    title: "PrimaryBlue",
    shortTitle: "PrimaryBlue",
    href: "/theme/palettes/primary-blue" as Route,
    summary:
      "En utvidet PrimaryBlue-side som viser både eksisterende definerte verdier og en komplett arbeidsrampe fra 50 til 950.",
    sourceLabel: "PLAN.md + utvidet arbeidsrampe",
    sourceDetail:
      "PLAN.md definerer --color-primary-blue-900, --color-primary-blue og --color-primary-800. Siden kompletterer dette med en eksplisitt 50–950-rampe for dokumentasjon og videre vurdering.",
    intent:
      "Skal brukes til vurdering av blå interaksjonsfarge, lenker, datavisualisering og eventuell alternativ action-retning.",
    colors: [
      ...makeScale({
        idPrefix: "primary-blue",
        labelPrefix: "PrimaryBlue",
        tokenPrefix: "--color-primary-blue-scale",
        colors: primaryBlueScale,
        psychology:
          "Klar blå gir handlingskraft, presisjon og digital gjenkjennelse. Den er mer direkte enn maritime toner og kan derfor oppleves mer SaaS-/produktorientert.",
      }),
      color({
        id: "primary-blue-plan-900",
        label: "Primary Blue 900 / PLAN",
        token: "--color-primary-blue-900",
        value: "#00a0d6",
        description: "Eksisterende PLAN.md-verdi som beholdes synlig for sporbarhet.",
        psychology:
          "Lys cyan-blå føles energisk og teknologisk. Den egner seg bedre til digitale markører enn til lange tekstflater.",
      }),
      color({
        id: "primary-blue-plan-base",
        label: "Primary Blue / PLAN",
        token: "--color-primary-blue",
        value: "#009cde",
        description: "Eksisterende basisverdi fra PLAN.md.",
        psychology:
          "Basisblåen gir tydelig klikkbarhet og produktpreg. Den bør holdes semantisk knyttet til handling eller lenke.",
      }),
      color({
        id: "primary-800-plan",
        label: "Primary 800 / PLAN",
        token: "--color-primary-800",
        value: "#7499f7",
        description: "Eksisterende alternativ blå/lilla verdi fra PLAN.md.",
        psychology:
          "Den mer fiolette blåtonen føles mykere og mer illustrativ. Den egner seg til highlights og grafiske detaljer.",
      }),
    ],
    tokenMappings: [
      token(
        "--token-color-text-action",
        "--color-primary-blue-scale-700",
        "Action text",
        "Lenker og tekstlige handlinger.",
      ),
      token(
        "--token-color-background-action",
        "--color-primary-blue-scale-600",
        "Action background",
        "Alternativ primærknapp eller produkt-CTA.",
      ),
      token(
        "--token-color-background-action-hover",
        "--color-primary-blue-scale-700",
        "Action hover",
        "Hover-state for blå action.",
      ),
      token(
        "--token-color-stroke-action-focus",
        "--color-primary-blue-scale-500",
        "Focus ring",
        "Fokusmarkering for tastaturnavigasjon.",
      ),
      token(
        "--token-color-background-info-subtle",
        "--color-primary-blue-scale-100",
        "Infoflate",
        "Subtile blå informasjonsflater.",
      ),
    ],
    usage: [
      "Bruk som produkt- og interaksjonsfarge når maritime hovedfarge blir for tung.",
      "Bruk 600–800 til lenker, handlinger og fokus.",
      "Bruk 50–100 til subtile infoflater.",
    ],
    avoid: [
      "Ikke bruk PrimaryBlue samtidig som Maritime Blue i samme primær-CTA-hierarki.",
      "Ikke bruk de klare cyan-blå verdiene til store, rolige brandflater.",
      "Ikke la PrimaryBlue overstyre etablerte warning/positive/error-semantikker.",
    ],
  },
};

export function getPaletteDoc(id: PaletteDocId): PaletteDoc {
  return paletteDocs[id];
}

export function getPaletteDocIndex(): PaletteDocIndexItem[] {
  return paletteOrder.map((id) => {
    const doc = getPaletteDoc(id);

    return {
      id: doc.id,
      title: doc.title,
      href: doc.href,
      summary: doc.summary,
      swatches: doc.colors.slice(0, 8),
    };
  });
}

export const paletteOrder: PaletteDocId[] = [
  "hovedpalett",
  "maritime-monochromatic",
  "maritime-monochromatic-secondary",
  "all-year-palette",
  "teal",
  "primary-blue",
];

function makeScale({
  idPrefix,
  labelPrefix,
  tokenPrefix,
  colors,
  psychology,
}: {
  idPrefix: string;
  labelPrefix: string;
  tokenPrefix: string;
  colors: ScaleColorInput[];
  psychology: string;
}): PaletteDocColor[] {
  return colors.map(({ step, value }) =>
    color({
      id: `${idPrefix}-${step}`,
      label: `${labelPrefix} ${step}`,
      token: `${tokenPrefix}-${step}`,
      value,
      description: describeStep(step),
      psychology: `${psychology} ${describePsychologicalWeight(step)}`,
    }),
  );
}

function color({
  id,
  label,
  token,
  value,
  description,
  psychology,
}: {
  id: string;
  label: string;
  token: string;
  value: string;
  description: string;
  psychology: string;
}): PaletteDocColor {
  return { id, label, token, value, color: value, description, psychology };
}

function token(
  semanticToken: string,
  primitiveToken: string,
  role: string,
  usage: string,
): PaletteTokenMapping {
  return { semanticToken, primitiveToken, role, usage };
}

function describeStep(step: ScaleStep) {
  if (step <= 100) {
    return "Brukes primært til bakgrunn, wash og svært subtile flater.";
  }

  if (step <= 300) {
    return "Passer til lavmælt surface, border og sekundær dekor.";
  }

  if (step <= 500) {
    return "Fungerer som mellomtone for grafikk, markører og balansert fargeflate.";
  }

  if (step <= 700) {
    return "Egner seg til aktiv tilstand, handling, ikon og tydelige UI-signaler.";
  }

  return "Bør reserveres for tekst, mørk surface, høy kontrast og sterk identitetsmarkering.";
}

function describePsychologicalWeight(step: ScaleStep) {
  if (step <= 100) {
    return "I lys form oppleves fargen som stille, romslig og støttende.";
  }

  if (step <= 300) {
    return "I myk form gir den stemning uten å dominere innholdet.";
  }

  if (step <= 500) {
    return "Som midttone blir den mer synlig og bør få en tydelig rolle.";
  }

  if (step <= 700) {
    return "Som sterk verdi signaliserer den valg, retning og interaksjon.";
  }

  return "I mørk form gir den tyngde, autoritet og tydelig hierarki.";
}
