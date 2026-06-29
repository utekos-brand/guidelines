import { BrandSidebar } from "@/components/brand-shell/brand-sidebar";
import { BrandTableOfContents } from "@/components/brand-shell/brand-table-of-contents";
import { BrandTopbar } from "@/components/brand-shell/brand-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function BrandShell({ children, ...props }: React.ComponentProps<typeof SidebarInset>) {
  return (
    <SidebarProvider className="brand-shell-wrapper">
      <BrandTopbar />

      <div className="brand-shell-layout">
        <BrandSidebar />

        <SidebarInset className="brand-shell-inset" {...props}>
          <div className="brand-content">
            <div className="brand-main">{children}</div>
            <BrandTableOfContents />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
