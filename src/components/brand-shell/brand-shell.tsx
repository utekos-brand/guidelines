import { BrandSidebar } from "@/components/brand-shell/brand-sidebar";
import { BrandTableOfContents } from "@/components/brand-shell/brand-table-of-contents";
import { BrandTopbar } from "@/components/brand-shell/brand-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function BrandShell({ children, ...props }: React.ComponentProps<typeof SidebarInset>) {
  return (
    <SidebarProvider>
      <BrandSidebar />

      <SidebarInset {...props}>
        <BrandTopbar />
        <div className="brand-content">
          <div className="brand-main">{children}</div>
          <BrandTableOfContents />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
