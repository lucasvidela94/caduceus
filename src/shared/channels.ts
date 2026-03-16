export const IPC_CHANNELS = {
  GET_PATIENTS: "get-patients",
  ADD_PATIENT: "add-patient"
} as const;

export const APPOINTMENT_CHANNELS = {
  GET_ALL: "get-appointments",
  GET_BY_ID: "get-appointment-by-id",
  GET_BY_PATIENT: "get-appointments-by-patient",
  GET_BY_DATE: "get-appointments-by-date",
  GET_BY_DATE_RANGE: "get-appointments-by-date-range",
  CREATE: "create-appointment",
  UPDATE: "update-appointment",
  DELETE: "delete-appointment",
  GET_AVAILABLE_SLOTS: "get-available-slots",
} as const;

export const CONSULTATION_CHANNELS = {
  GET_ALL: "get-consultations",
  GET_BY_ID: "get-consultation-by-id",
  GET_BY_PATIENT: "get-consultations-by-patient",
  GET_BY_DATE_RANGE: "get-consultations-by-date-range",
  CREATE: "create-consultation",
  UPDATE: "update-consultation",
  DELETE: "delete-consultation",
} as const;

export const SETTING_CHANNELS = {
  GET_ALL: "get-settings",
  GET_BY_KEY: "get-setting-by-key",
  SET_VALUE: "set-setting-value",
  UPDATE_MULTIPLE: "update-multiple-settings",
  GET_PRESCRIPTION_CONFIG: "get-prescription-config",
  GET_WORKING_HOURS: "get-working-hours",
} as const;

export const REMINDER_CHANNELS = {
  CREATE_REMINDERS_FOR_APPOINTMENT: "create-reminders-for-appointment",
  GET_REMINDERS_BY_APPOINTMENT: "get-reminders-by-appointment",
  CANCEL_REMINDERS: "cancel-reminders",
  GET_REMINDER_STATS: "get-reminder-stats",
  PROCESS_PENDING_REMINDERS: "process-pending-reminders",
} as const;

type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
type AppointmentChannel = (typeof APPOINTMENT_CHANNELS)[keyof typeof APPOINTMENT_CHANNELS];
type ConsultationChannel = (typeof CONSULTATION_CHANNELS)[keyof typeof CONSULTATION_CHANNELS];
type SettingChannel = (typeof SETTING_CHANNELS)[keyof typeof SETTING_CHANNELS];
type ReminderChannel = (typeof REMINDER_CHANNELS)[keyof typeof REMINDER_CHANNELS];

export type { IpcChannel, AppointmentChannel, ConsultationChannel, SettingChannel, ReminderChannel };
