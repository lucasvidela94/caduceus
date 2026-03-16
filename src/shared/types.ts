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
  reminderPreference?: string;
}

export interface BackupInfo {
  name: string;
  path: string;
  size: number;
  created: Date;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  patients: unknown[];
  appointments: unknown[];
  consultations: unknown[];
  settings: Record<string, string>;
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
  status?: "pending" | "completed" | "cancelled" | "no-show";
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
  createBackup: (data: BackupData) => Promise<{ success: boolean; path: string }>;
  listBackups: () => Promise<BackupInfo[]>;
  getBackupData: (backupPath: string) => Promise<BackupData>;
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
  getWorkingHours: () => Promise<{ start: string; end: string; appointmentDuration: number }>;
  createRemindersForAppointment: (appointmentId: string) => Promise<unknown[]>;
  getRemindersByAppointment: (appointmentId: string) => Promise<unknown[]>;
  cancelReminders: (appointmentId: string) => Promise<void>;
  getReminderStats: () => Promise<{ total: number; pending: number; sent: number; failed: number }>;
  processPendingReminders: () => Promise<unknown[]>;
  ipcRenderer: {
    on: (channel: string, listener: (event: unknown, ...args: unknown[]) => void) => void;
    postMessage: (channel: string, message: unknown) => void;
    removeListener: (channel: string, listener: (event: unknown, ...args: unknown[]) => void) => void;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}