import { contextBridge, ipcRenderer } from "electron";

const IPC_CHANNELS = {
  GET_PATIENTS: "get-patients",
  ADD_PATIENT: "add-patient",
  GET_PATIENT: "get-patient",
  UPDATE_PATIENT: "update-patient",
  DELETE_PATIENT: "delete-patient",
  CREATE_BACKUP: "create-backup",
  LIST_BACKUPS: "list-backups",
  RESTORE_BACKUP: "restore-backup",
  EXPORT_JSON: "export-json",
  IMPORT_JSON: "import-json",
  EXPORT_CSV: "export-csv",
  CHECK_INTEGRITY: "check-integrity"
} as const;

export interface Patient {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
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

export interface ElectronAPI {
  getPatients: () => Promise<Patient[]>;
  addPatient: (input: PatientInput) => Promise<Patient>;
  getPatient: (id: number) => Promise<Patient>;
  updatePatient: (id: number, input: Partial<PatientInput>) => Promise<Patient>;
  deletePatient: (id: number) => Promise<{ success: boolean }>;
  createBackup: () => Promise<{ success: boolean; path: string }>;
  listBackups: () => Promise<BackupInfo[]>;
  restoreBackup: (backupPath: string) => Promise<{ success: boolean }>;
  exportJSON: () => Promise<{ success: boolean; canceled?: boolean; path?: string }>;
  importJSON: () => Promise<{ success: boolean; canceled?: boolean; imported: number; errors: string[] }>;
  exportCSV: () => Promise<{ success: boolean; canceled?: boolean; path?: string }>;
  checkIntegrity: () => Promise<{ ok: boolean; errors: string[] }>;
}

const api: ElectronAPI = {
  getPatients: (): Promise<Patient[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_PATIENTS),
  addPatient: (input: PatientInput): Promise<Patient> =>
    ipcRenderer.invoke(IPC_CHANNELS.ADD_PATIENT, input),
  getPatient: (id: number): Promise<Patient> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_PATIENT, id),
  updatePatient: (id: number, input: Partial<PatientInput>): Promise<Patient> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_PATIENT, id, input),
  deletePatient: (id: number): Promise<{ success: boolean }> =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_PATIENT, id),
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
    ipcRenderer.invoke(IPC_CHANNELS.CHECK_INTEGRITY)
};

contextBridge.exposeInMainWorld("electronAPI", api);
