import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Camera,
  Eye,
  Image as ImageIcon,
  Layers,
  Palette,
  PenTool,
  Shapes,
  Sparkles,
  Type,
} from "lucide-react";

export type BrandNavItem = {
  title: string;
  href: Route;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  exact?: boolean;
};

export type BrandNavGroup = {
  title: string;
  items: BrandNavItem[];
};

export const brandNavGroups: BrandNavGroup[] = [
  {
    title: "Grunnlag",
    items: [
      {
        title: "Merkevaren Utekos",
        href: "/",
        icon: BookOpen,
        exact: true,
        description: "Kjerne, prinsipper og overordnet retning",
      },
      {
        title: "Logo",
        href: "/logo",
        icon: ImageIcon,
        description: "Logo, varianter, friområde og feilbruk",
      },
    ],
  },
  {
    title: "Visuell identitet",
    items: [
      {
        title: "Farger",
        href: "/farger",
        icon: Palette,
        description: "Palett, kontrast, semantikk og bruk",
      },
      {
        title: "Themes",
        href: "/themes",
        icon: Layers,
        badge: "Lab",
        description: "Dedikert prosess for theme-testing",
      },
      {
        title: "Typografi",
        href: "/typografi",
        icon: Type,
        description: "Skrift, hierarki, lesbarhet og rytme",
      },
      {
        title: "Fotografi",
        href: "/fotografi",
        icon: Camera,
        description: "Bildestil, motiv, lys og komposisjon",
      },
      {
        title: "Illustrasjoner",
        href: "/illustrasjoner",
        icon: PenTool,
        description: "Illustrasjonsstil og bruksprinsipper",
      },
      {
        title: "Ikoner",
        href: "/ikoner",
        icon: Shapes,
        description: "Ikonstil, størrelse og konsistens",
      },
      {
        title: "Grafisk element",
        href: "/grafisk-element",
        icon: Sparkles,
        description: "Former, mønstre og identitetselementer",
      },
    ],
  },
  {
    title: "Anvendelse",
    items: [
      {
        title: "Identiteten i bruk",
        href: "/identiteten-i-bruk",
        icon: Eye,
        description: "Eksempler, regler og praktisk anvendelse",
      },
    ],
  },
];

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
