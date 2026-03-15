import { contextBridge, ipcRenderer } from "electron";

const IPC_CHANNELS = {
  GET_PATIENTS: "get-patients",
  ADD_PATIENT: "add-patient",
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
  created_at: string;
}

export interface BackupInfo {
  name: string;
  path: string;
  size: number;
  created: Date;
}

export interface ElectronAPI {
  getPatients: () => Promise<Patient[]>;
  addPatient: (name: string) => Promise<Patient>;
  createBackup: () => Promise<{ success: boolean; path: string }>;
  listBackups: () => Promise<BackupInfo[]>;
  restoreBackup: (backupPath: string) => Promise<{ success: boolean }>;
  exportJSON: () => Promise<{ success: boolean; canceled?: boolean; path?: string }>;
  importJSON: () => Promise<{ success: boolean; canceled?: boolean; imported: number; errors: string[] }>;
  exportCSV: () => Promise<{ success: boolean; canceled?: boolean; path?: string }>;
  checkIntegrity: () => Promise<{ ok: boolean; errors: string[] }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

const api: ElectronAPI = {
  getPatients: (): Promise<Patient[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_PATIENTS),
  addPatient: (name: string): Promise<Patient> =>
    ipcRenderer.invoke(IPC_CHANNELS.ADD_PATIENT, name),
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
