export const ROUTES = {
  HOME: "/",
  PATIENTS: {
    LIST: "/patients",
    NEW: "/patients/new"
  }
} as const;

export const ROUTE_LABELS: Record<string, string> = {
  [ROUTES.HOME]: "Dashboard",
  [ROUTES.PATIENTS.LIST]: "Pacientes",
  [ROUTES.PATIENTS.NEW]: "Nuevo Paciente"
};

export const BREADCRUMB_MAP: Record<
  string,
  Array<{ label: string; href?: string }>
> = {
  [ROUTES.HOME]: [{ label: "Dashboard" }],
  [ROUTES.PATIENTS.LIST]: [
    { label: "Pacientes", href: `#${ROUTES.PATIENTS.LIST}` }
  ],
  [ROUTES.PATIENTS.NEW]: [
    { label: "Pacientes", href: `#${ROUTES.PATIENTS.LIST}` },
    { label: "Nuevo" }
  ]
};
