import { BrandShell } from "@/components/brand-shell/brand-shell";

export default function IdentitetLayout({ children }: { children: React.ReactNode }) {
  return <BrandShell>{children}</BrandShell>;
}
