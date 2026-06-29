import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { brandNavGroups } from "@/src/config/brand-navigation";

export function BrandSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              className="h-12 justify-start px-2"
              tooltip="Utekos Brand"
            >
              <span className="relative block h-6 w-28 overflow-hidden group-data-[collapsible=icon]:hidden">
                <Image
                  src="/UtekosWordmarDark.svg"
                  alt="Utekos Brand"
                  width={1280}
                  height={311}
                  priority
                  className="h-full w-auto object-contain dark:hidden"
                />
                <Image
                  src="/WordmarkWhite.svg"
                  alt="Utekos Brand"
                  width={1280}
                  height={311}
                  priority
                  className="hidden h-full w-auto object-contain dark:block"
                />
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="pt-3">
        {brandNavGroups.map((group) => (
          <Fragment key={group.title}>
            {group.title === "Anvendelse" ? (
              <Separator className="bg-sidebar-border mx-auto my-1.5 data-horizontal:w-[95%]" />
            ) : null}

            <SidebarGroup>
              <SidebarGroupLabel className="text-sm">{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        tooltip={item.title}
                        className="text-base"
                      >
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </Fragment>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
