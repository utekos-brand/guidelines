/**
 * React/TSX conversion of MCP generate_component_template (navbar, modern).
 * MCP returns HTML only — this is the Utekos pattern: semantic tokens, not raw palette.
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BrandNavbar() {
  return (
    <nav className="border-b border-border bg-background/75 backdrop-blur">
      <div className="flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="mr-4 flex">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2 text-foreground"
          >
            <span className="text-xl font-bold">Utekos</span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground/80"
            >
              Hjem
            </Link>
            <Link
              href="/farger"
              className="text-muted-foreground transition-colors hover:text-foreground/80"
            >
              Farger
            </Link>
            <Link
              href="/themes"
              className="text-muted-foreground transition-colors hover:text-foreground/80"
            >
              Themes
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <Button size="sm">Kom i gang</Button>
        </div>
      </div>
    </nav>
  );
}
