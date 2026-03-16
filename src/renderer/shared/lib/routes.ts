export const ROUTES = {
  HOME: "/",
  PATIENTS: {
    LIST: "/patients",
    NEW: "/patients/new",
    DETAIL: (id: string) => `/patients/${id}`,
    EDIT: (id: string) => `/patients/${id}/edit`
  },
  APPOINTMENTS: {
    LIST: "/appointments",
    NEW: "/appointments/new",
    DETAIL: (id: string) => `/appointments/${id}`,
    EDIT: (id: string) => `/appointments/${id}/edit`,
    CALENDAR: "/appointments/calendar"
  },
  CONSULTATIONS: {
    LIST: "/consultations",
    NEW: "/consultations/new",
    DETAIL: (id: string) => `/consultations/${id}`,
    EDIT: (id: string) => `/consultations/${id}/edit`
  },
  SETTINGS: "/settings"
} as const;

export const ROUTE_LABELS: Record<string, string> = {
  [ROUTES.HOME]: "Dashboard",
  [ROUTES.PATIENTS.LIST]: "Pacientes",
  [ROUTES.PATIENTS.NEW]: "Nuevo Paciente",
  [ROUTES.APPOINTMENTS.LIST]: "Turnos",
  [ROUTES.APPOINTMENTS.NEW]: "Nuevo Turno",
  [ROUTES.APPOINTMENTS.CALENDAR]: "Calendario",
  [ROUTES.CONSULTATIONS.LIST]: "Consultas",
  [ROUTES.CONSULTATIONS.NEW]: "Nueva Consulta",
  [ROUTES.SETTINGS]: "Configuración"
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
  ],
  [ROUTES.APPOINTMENTS.LIST]: [
    { label: "Turnos", href: `#${ROUTES.APPOINTMENTS.LIST}` }
  ],
  [ROUTES.APPOINTMENTS.NEW]: [
    { label: "Turnos", href: `#${ROUTES.APPOINTMENTS.LIST}` },
    { label: "Nuevo" }
  ],
  [ROUTES.APPOINTMENTS.CALENDAR]: [
    { label: "Turnos", href: `#${ROUTES.APPOINTMENTS.LIST}` },
    { label: "Calendario" }
  ],
  [ROUTES.CONSULTATIONS.LIST]: [
    { label: "Consultas", href: `#${ROUTES.CONSULTATIONS.LIST}` }
  ],
  [ROUTES.CONSULTATIONS.NEW]: [
    { label: "Consultas", href: `#${ROUTES.CONSULTATIONS.LIST}` },
    { label: "Nueva" }
  ],
  [ROUTES.SETTINGS]: [{ label: "Configuración" }]
};
