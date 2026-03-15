import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
} from "lucide-react";
import logo from "@/assets/images/logo.png";
import { ROUTES, ROUTE_LABELS } from "@/shared/lib/routes";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { path: ROUTES.HOME, label: ROUTE_LABELS[ROUTES.HOME], icon: LayoutDashboard },
  { path: ROUTES.PATIENTS.LIST, label: ROUTE_LABELS[ROUTES.PATIENTS.LIST], icon: Users },
  { path: ROUTES.PATIENTS.NEW, label: ROUTE_LABELS[ROUTES.PATIENTS.NEW], icon: UserPlus },
];

export function AppSidebar(): React.ReactElement {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <img
            src={logo}
            alt="Caduceus"
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span className="font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Caduceus
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <NavLink to={item.path}>
                        <item.icon />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
