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