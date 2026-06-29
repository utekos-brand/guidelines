import type { Route } from "next";

export type BrandHeaderNavItem = {
  label: string;
  href: Route;
  matchPrefix: string;
};

export const brandHeaderNavItems: BrandHeaderNavItem[] = [
  {
    label: "Identitet",
    href: "/identitet",
    matchPrefix: "/identitet",
  },
  {
    label: "Ressurser",
    href: "/ressurser",
    matchPrefix: "/ressurser",
  },
];

function normalizePath(path: string) {
  if (path === "/") {
    return "/";
  }

  return path.replace(/\/$/, "");
}

export function isBrandHeaderNavItemActive(pathname: string, item: BrandHeaderNavItem) {
  const currentPath = normalizePath(pathname);
  const prefix = normalizePath(item.matchPrefix);

  return currentPath === prefix || currentPath.startsWith(`${prefix}/`);
}
