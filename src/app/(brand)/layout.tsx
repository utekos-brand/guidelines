import { BrandShell } from "@/components/brand-shell/brand-shell";

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return <BrandShell>{children}</BrandShell>;
}
