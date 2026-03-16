import { contextBridge, ipcRenderer } from "electron";

const IPC_CHANNELS = {
  GET_PATIENTS: "get-patients",
  ADD_PATIENT: "add-patient",
  GET_PATIENT: "get-patient",
  UPDATE_PATIENT: "update-patient",
  DELETE_PATIENT: "delete-patient",
  SEARCH_PATIENTS: "search-patients",
  CREATE_BACKUP: "create-backup",
  LIST_BACKUPS: "list-backups",
  RESTORE_BACKUP: "restore-backup",
  EXPORT_JSON: "export-json",
  IMPORT_JSON: "import-json",
  EXPORT_CSV: "export-csv",
  CHECK_INTEGRITY: "check-integrity",
  GET_APPOINTMENTS: "get-appointments",
  GET_APPOINTMENT_BY_ID: "get-appointment-by-id",
  GET_APPOINTMENTS_BY_PATIENT: "get-appointments-by-patient",
  GET_APPOINTMENTS_BY_DATE: "get-appointments-by-date",
  GET_APPOINTMENTS_BY_DATE_RANGE: "get-appointments-by-date-range",
  CREATE_APPOINTMENT: "create-appointment",
  UPDATE_APPOINTMENT: "update-appointment",
  DELETE_APPOINTMENT: "delete-appointment",
  GET_AVAILABLE_SLOTS: "get-available-slots",
  GET_CONSULTATIONS: "get-consultations",
  GET_CONSULTATION_BY_ID: "get-consultation-by-id",
  GET_CONSULTATIONS_BY_PATIENT: "get-consultations-by-patient",
  GET_CONSULTATIONS_BY_DATE_RANGE: "get-consultations-by-date-range",
  CREATE_CONSULTATION: "create-consultation",
  UPDATE_CONSULTATION: "update-consultation",
  DELETE_CONSULTATION: "delete-consultation",
  GET_SETTINGS: "get-settings",
  GET_SETTING_BY_KEY: "get-setting-by-key",
  SET_SETTING_VALUE: "set-setting-value",
  UPDATE_MULTIPLE_SETTINGS: "update-multiple-settings",
  GET_PRESCRIPTION_CONFIG: "get-prescription-config",
  GET_WORKING_HOURS: "get-working-hours",
  CREATE_REMINDERS_FOR_APPOINTMENT: "create-reminders-for-appointment",
  GET_REMINDERS_BY_APPOINTMENT: "get-reminders-by-appointment",
  CANCEL_REMINDERS: "cancel-reminders",
  GET_REMINDER_STATS: "get-reminder-stats",
  PROCESS_PENDING_REMINDERS: "process-pending-reminders"
} as const;

export interface Patient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  reminderPreference: string | null;
  created_at: number;
  updated_at: number;
}

export interface PatientInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface BackupInfo {
  name: string;
  path: string;
  size: number;
  created: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: string;
  time: string;
  duration: number;
  reason: string;
  status: "pending" | "completed" | "cancelled" | "no-show";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
}

export interface AppointmentInput {
  patientId: string;
  date: string;
  time: string;
  duration?: number;
  reason: string;
  notes?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  date: string;
  reason: string;
  symptoms?: string;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: string;
  weight?: string;
  height?: string;
  physicalExam?: string;
  diagnosis: string;
  treatment?: string;
  prescription?: string;
  labRequested: boolean;
  rxRequested: boolean;
  ecgRequested: boolean;
  ultrasoundRequested: boolean;
  otherStudies?: string;
  nextAppointment?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
}

export interface ConsultationInput {
  patientId: string;
  date: string;
  reason: string;
  symptoms?: string;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: string;
  weight?: string;
  height?: string;
  physicalExam?: string;
  diagnosis: string;
  treatment?: string;
  prescription?: string;
  labRequested?: boolean;
  rxRequested?: boolean;
  ecgRequested?: boolean;
  ultrasoundRequested?: boolean;
  otherStudies?: string;
  nextAppointment?: string;
  notes?: string;
}

export interface ElectronAPI {
  getPatients: () => Promise<Patient[]>;
  addPatient: (input: PatientInput) => Promise<Patient>;
  getPatient: (id: string) => Promise<Patient>;
  updatePatient: (id: string, input: Partial<PatientInput>) => Promise<Patient>;
  deletePatient: (id: string) => Promise<{ success: boolean }>;
  searchPatients: (query: string) => Promise<Patient[]>;
  createBackup: () => Promise<{ success: boolean; path: string }>;
  listBackups: () => Promise<BackupInfo[]>;
  restoreBackup: (backupPath: string) => Promise<{ success: boolean }>;
  exportJSON: () => Promise<{ success: boolean; canceled?: boolean; path?: string }>;
  importJSON: () => Promise<{ success: boolean; canceled?: boolean; imported: number; errors: string[] }>;
  exportCSV: () => Promise<{ success: boolean; canceled?: boolean; path?: string }>;
  checkIntegrity: () => Promise<{ ok: boolean; errors: string[] }>;
  getAppointments: () => Promise<Array<{ appointment: Appointment; patient: { id: string; name: string } | null }>>;
  getAppointmentById: (id: string) => Promise<{ appointment: Appointment; patient: { id: string; name: string; email: string | null; phone: string | null } | null } | null>;
  getAppointmentsByPatient: (patientId: string) => Promise<Appointment[]>;
  getAppointmentsByDate: (date: string) => Promise<Array<{ appointment: Appointment; patient: { id: string; name: string } | null }>>;
  getAppointmentsByDateRange: (startDate: string, endDate: string) => Promise<Array<{ appointment: Appointment; patient: { id: string; name: string } | null }>>;
  createAppointment: (input: AppointmentInput) => Promise<Appointment>;
  updateAppointment: (id: string, input: Partial<AppointmentInput>) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  getAvailableSlots: (date: string, duration?: number) => Promise<string[]>;
  getConsultations: () => Promise<Array<{ consultation: Consultation; patient: { id: string; name: string } | null }>>;
  getConsultationById: (id: string) => Promise<{ consultation: Consultation; patient: { id: string; name: string } | null } | null>;
  getConsultationsByPatient: (patientId: string) => Promise<Consultation[]>;
  getConsultationsByDateRange: (startDate: string, endDate: string) => Promise<Consultation[]>;
  createConsultation: (input: ConsultationInput) => Promise<Consultation>;
  updateConsultation: (id: string, input: Partial<ConsultationInput>) => Promise<Consultation>;
  deleteConsultation: (id: string) => Promise<void>;
  getSettings: () => Promise<Record<string, string>>;
  getSettingByKey: (key: string) => Promise<string | null>;
  setSettingValue: (key: string, value: string) => Promise<unknown>;
  updateMultipleSettings: (values: Record<string, string>) => Promise<unknown[]>;
  getPrescriptionConfig: () => Promise<{
    clinicName: string;
    doctorName: string;
    doctorLicense: string;
    doctorSpecialty: string;
    clinicAddress: string;
    clinicPhone: string;
    clinicEmail: string;
    clinicLogo: string;
  }>;
  getWorkingHours: () => Promise<{
    start: string;
    end: string;
    appointmentDuration: number;
  }>;
  createRemindersForAppointment: (appointmentId: string) => Promise<unknown[]>;
  getRemindersByAppointment: (appointmentId: string) => Promise<unknown[]>;
  cancelReminders: (appointmentId: string) => Promise<void>;
  getReminderStats: () => Promise<{
    total: number;
    pending: number;
    sent: number;
    failed: number;
  }>;
  processPendingReminders: () => Promise<unknown[]>;
}

const api: ElectronAPI = {
  getPatients: (): Promise<Patient[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_PATIENTS),
  addPatient: (input: PatientInput): Promise<Patient> =>
    ipcRenderer.invoke(IPC_CHANNELS.ADD_PATIENT, input),
  getPatient: (id: string): Promise<Patient> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_PATIENT, id),
  updatePatient: (id: string, input: Partial<PatientInput>): Promise<Patient> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_PATIENT, id, input),
  deletePatient: (id: string): Promise<{ success: boolean }> =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_PATIENT, id),
  searchPatients: (query: string): Promise<Patient[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.SEARCH_PATIENTS, query),
  createBackup: (): Promise<{ success: boolean; path: string }> =>
    ipcRenderer.invoke(IPC_CHANNELS.CREATE_BACKUP),
  listBackups: (): Promise<BackupInfo[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.LIST_BACKUPS),
  restoreBackup: (backupPath: string): Promise<{ success: boolean }> =>
    ipcRenderer.invoke(IPC_CHANNELS.RESTORE_BACKUP, backupPath),
  exportJSON: (): Promise<{ success: boolean; canceled?: boolean; path?: string }> =>
    ipcRenderer.invoke(IPC_CHANNELS.EXPORT_JSON),
  importJSON: (): Promise<{ success: boolean; canceled?: boolean; imported: number; errors: string[] }> =>
    ipcRenderer.invoke(IPC_CHANNELS.IMPORT_JSON),
  exportCSV: (): Promise<{ success: boolean; canceled?: boolean; path?: string }> =>
    ipcRenderer.invoke(IPC_CHANNELS.EXPORT_CSV),
  checkIntegrity: (): Promise<{ ok: boolean; errors: string[] }> =>
    ipcRenderer.invoke(IPC_CHANNELS.CHECK_INTEGRITY),
  getAppointments: (): Promise<Array<{ appointment: Appointment; patient: { id: string; name: string } | null }>> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_APPOINTMENTS),
  getAppointmentById: (id: string): Promise<{ appointment: Appointment; patient: { id: string; name: string; email: string | null; phone: string | null } | null } | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_APPOINTMENT_BY_ID, id),
  getAppointmentsByPatient: (patientId: string): Promise<Appointment[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_APPOINTMENTS_BY_PATIENT, patientId),
  getAppointmentsByDate: (date: string): Promise<Array<{ appointment: Appointment; patient: { id: string; name: string } | null }>> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_APPOINTMENTS_BY_DATE, date),
  getAppointmentsByDateRange: (startDate: string, endDate: string): Promise<Array<{ appointment: Appointment; patient: { id: string; name: string } | null }>> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_APPOINTMENTS_BY_DATE_RANGE, startDate, endDate),
  createAppointment: (input: AppointmentInput): Promise<Appointment> =>
    ipcRenderer.invoke(IPC_CHANNELS.CREATE_APPOINTMENT, input),
  updateAppointment: (id: string, input: Partial<AppointmentInput>): Promise<Appointment> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_APPOINTMENT, id, input),
  deleteAppointment: (id: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_APPOINTMENT, id),
  getAvailableSlots: (date: string, duration?: number): Promise<string[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_AVAILABLE_SLOTS, date, duration),
  getConsultations: (): Promise<Array<{ consultation: Consultation; patient: { id: string; name: string } | null }>> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_CONSULTATIONS),
  getConsultationById: (id: string): Promise<{ consultation: Consultation; patient: { id: string; name: string } | null } | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_CONSULTATION_BY_ID, id),
  getConsultationsByPatient: (patientId: string): Promise<Consultation[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_CONSULTATIONS_BY_PATIENT, patientId),
  getConsultationsByDateRange: (startDate: string, endDate: string): Promise<Consultation[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_CONSULTATIONS_BY_DATE_RANGE, startDate, endDate),
  createConsultation: (input: ConsultationInput): Promise<Consultation> =>
    ipcRenderer.invoke(IPC_CHANNELS.CREATE_CONSULTATION, input),
  updateConsultation: (id: string, input: Partial<ConsultationInput>): Promise<Consultation> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_CONSULTATION, id, input),
  deleteConsultation: (id: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_CONSULTATION, id),
  getSettings: (): Promise<Record<string, string>> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_SETTINGS),
  getSettingByKey: (key: string): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_SETTING_BY_KEY, key),
  setSettingValue: (key: string, value: string): Promise<unknown> =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_SETTING_VALUE, key, value),
  updateMultipleSettings: (values: Record<string, string>): Promise<unknown[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_MULTIPLE_SETTINGS, values),
  getPrescriptionConfig: (): Promise<{
    clinicName: string;
    doctorName: string;
    doctorLicense: string;
    doctorSpecialty: string;
    clinicAddress: string;
    clinicPhone: string;
    clinicEmail: string;
    clinicLogo: string;
  }> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_PRESCRIPTION_CONFIG),
  getWorkingHours: (): Promise<{
    start: string;
    end: string;
    appointmentDuration: number;
  }> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_WORKING_HOURS),
  createRemindersForAppointment: (appointmentId: string): Promise<unknown[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.CREATE_REMINDERS_FOR_APPOINTMENT, appointmentId),
  getRemindersByAppointment: (appointmentId: string): Promise<unknown[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_REMINDERS_BY_APPOINTMENT, appointmentId),
  cancelReminders: (appointmentId: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.CANCEL_REMINDERS, appointmentId),
  getReminderStats: (): Promise<{
    total: number;
    pending: number;
    sent: number;
    failed: number;
  }> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_REMINDER_STATS),
  processPendingReminders: (): Promise<unknown[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.PROCESS_PENDING_REMINDERS)
};

contextBridge.exposeInMainWorld("electronAPI", api);
