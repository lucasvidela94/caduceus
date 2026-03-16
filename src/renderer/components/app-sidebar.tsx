import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  Settings,
  ChevronDown,
  Plus,
  List,
  CalendarDays,
} from "lucide-react";
import logo from "@/assets/images/logo.png";
import { ROUTES } from "@/shared/lib/routes";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MenuSection {
  title: string;
  icon: React.ElementType;
  path?: string;
  items?: {
    label: string;
    path: string;
    icon: React.ElementType;
  }[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: ROUTES.HOME,
  },
  {
    title: "Pacientes",
    icon: Users,
    items: [
      { label: "Ver Pacientes", path: ROUTES.PATIENTS.LIST, icon: List },
      { label: "Nuevo Paciente", path: ROUTES.PATIENTS.NEW, icon: Plus },
    ],
  },
  {
    title: "Turnos",
    icon: Calendar,
    items: [
      { label: "Ver Turnos", path: ROUTES.APPOINTMENTS.LIST, icon: List },
      { label: "Nuevo Turno", path: ROUTES.APPOINTMENTS.NEW, icon: Plus },
      { label: "Calendario", path: ROUTES.APPOINTMENTS.CALENDAR, icon: CalendarDays },
    ],
  },
  {
    title: "Consultas",
    icon: Stethoscope,
    items: [
      { label: "Ver Consultas", path: ROUTES.CONSULTATIONS.LIST, icon: List },
      { label: "Nueva Consulta", path: ROUTES.CONSULTATIONS.NEW, icon: Plus },
    ],
  },
  {
    title: "Configuración",
    icon: Settings,
    path: ROUTES.SETTINGS,
  },
];

export function AppSidebar(): React.ReactElement {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isSectionActive = (section: MenuSection) => {
    if (section.path) return isActive(section.path);
    return section.items?.some((item) => isActive(item.path)) ?? false;
  };

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
              {MENU_SECTIONS.map((section) => {
                if (section.items) {
                  // Sección con dropdown
                  return (
                    <Collapsible
                      key={section.title}
                      defaultOpen={isSectionActive(section)}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={isSectionActive(section)}
                            tooltip={section.title}
                          >
                            <section.icon className="h-4 w-4" />
                            <span>{section.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {section.items.map((item) => (
                              <SidebarMenuSubItem key={item.path}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(item.path)}
                                >
                                  <NavLink to={item.path}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Sección simple (sin dropdown)
                return (
                  <SidebarMenuItem key={section.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(section.path!)}
                      tooltip={section.title}
                    >
                      <NavLink to={section.path!}>
                        <section.icon className="h-4 w-4" />
                        <span>{section.title}</span>
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