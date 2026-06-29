import type { Route } from "next";

export type BrandNavItem = {
  title: string;
  href: Route;
  description?: string;
  badge?: string;
  exact?: boolean;
};

export type BrandNavAccordion = {
  title: string;
  items: BrandNavItem[];
  defaultOpen?: boolean;
};

export type BrandNavSection = {
  title: string;
  accordions?: BrandNavAccordion[];
  items?: BrandNavItem[];
};

export type BrandNavGroup = {
  title: string;
  items: BrandNavItem[];
};

export const brandNavSections: BrandNavSection[] = [
  {
    title: "Retningslinjer",
    accordions: [
      {
        title: "Merkevare",
        defaultOpen: true,
        items: [
          {
            title: "Merkevaren Utekos",
            href: "/",
            exact: true,
            description: "Kjerne, prinsipper og overordnet retning",
          },
          {
            title: "Identiteten i bruk",
            href: "/identiteten-i-bruk",
            description: "Eksempler, regler og praktisk anvendelse",
          },
          {
            title: "Merkevarebygging",
            href: "/identiteten-i-bruk/merkevarebygging",
            description: "Mental tilgjengelighet og langsiktig merkevekst",
          },
          {
            title: "Tone of voice",
            href: "/tone-of-voice" as Route,
            description: "Språk, tonalitet og prinsipper for tekst",
          },
        ],
      },
      {
        title: "Visuell identitet",
        defaultOpen: true,
        items: [
          {
            title: "Logo",
            href: "/logo",
            description: "Logo, varianter, friområde og feilbruk",
          },
          {
            title: "Farger",
            href: "/farger",
            description: "Palett, kontrast, semantikk og bruk",
          },
          {
            title: "Typografi",
            href: "/typografi",
            description: "Skrift, hierarki, lesbarhet og rytme",
          },
          {
            title: "Fotografi",
            href: "/fotografi",
            description: "Bildestil, motiv, lys og komposisjon",
          },
          {
            title: "Illustrasjoner",
            href: "/illustrasjoner",
            description: "Illustrasjonsstil og bruksprinsipper",
          },
          {
            title: "Ikoner",
            href: "/ikoner",
            description: "Ikonstil, størrelse og konsistens",
          },
          {
            title: "Grafisk element",
            href: "/grafisk-element",
            description: "Former, mønstre og identitetselementer",
          },
        ],
      },
      {
        title: "Arbeidsflate",
        items: [
          {
            title: "Identitet",
            href: "/identitet",
            description: "Alternativ identitetsflate og overordnet struktur",
          },
          {
            title: "Designsystem",
            href: "/identitet/design/system",
            description: "Systemregler for tokens og komponentbruk",
          },
          {
            title: "Tokens",
            href: "/identitet/design/tokens",
            description: "Design tokens og semantiske koblinger",
          },
          {
            title: "Ressurser",
            href: "/ressurser",
            description: "Filer, støtteinnhold og arbeidsressurser",
          },
        ],
      },
    ],
  },
  {
    title: "Fargepaletter",
    items: [
      {
        title: "Oversikt",
        href: "/theme",
        exact: true,
        description: "Samlet inngang til fargepaletter",
      },
      {
        title: "Utekos",
        href: "/theme/utekos",
        description: "Primær Utekos-fargepallet",
      },
      {
        title: "Vy",
        href: "/theme/vy",
        badge: "Spor",
        description: "Vy/Spor-inspirert fargepallet for sammenligning",
      },
      {
        title: "DNB",
        href: "/theme/dnb",
        description: "DNB/Eufemia-inspirert theme for sammenligning",
      },
      {
        title: "Havdyp",
        href: "/theme/havdyp",
        description: "Mørkere hav- og dybdevariant",
      },
      {
        title: "Custom",
        href: "/theme/custom",
        badge: "Lab",
        description: "Eksperimentell theme-konfigurasjon",
      },
    ],
  },
  {
    title: "Paletter",
    items: [
      {
        title: "Hovedpalett",
        href: "/theme/palettes/hovedpalett",
        description: "Kjernepalett og semantisk mapping",
      },
      {
        title: "All-year palette",
        href: "/theme/palettes/all-year-palette",
        description: "Helårsvariant for bred bruk",
      },
      {
        title: "Primary blue",
        href: "/theme/palettes/primary-blue",
        description: "Blå primærvariant",
      },
      {
        title: "Teal",
        href: "/theme/palettes/teal",
        description: "Teal-basert theme-retning",
      },
      {
        title: "Maritime monochromatic",
        href: "/theme/palettes/maritime-monochromatic",
        description: "Monokromatisk maritim variant",
      },
      {
        title: "Maritime secondary",
        href: "/theme/palettes/maritime-monochromatic-secondary",
        description: "Sekundær maritim variant",
      },
    ],
  },
];

export const brandNavGroups: BrandNavGroup[] = brandNavSections.flatMap((section) => [
  ...(section.accordions ?? []).map((accordion) => ({
    title: accordion.title,
    items: accordion.items,
  })),
  ...(section.items
    ? [
        {
          title: section.title,
          items: section.items,
        },
      ]
    : []),
]);

export const brandNavItems = brandNavGroups.flatMap((group) => group.items);

function normalizePath(path: string) {
  if (path === "/") {
    return "/";
  }

  return path.replace(/\/$/, "");
}

export function isBrandNavItemActive(pathname: string, item: BrandNavItem) {
  const currentPath = normalizePath(pathname);
  const itemPath = normalizePath(item.href);

  if (item.exact || itemPath === "/") {
    return currentPath === itemPath;
  }

  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

export function getActiveBrandNavItem(pathname: string) {
  return brandNavItems.find((item) => isBrandNavItemActive(pathname, item));
}
