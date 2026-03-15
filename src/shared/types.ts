export interface Patient {
  id: number;
  name: string;
  created_at: string;
}

export interface PatientInput {
  name: string;
}

export interface ElectronAPI {
  getPatients: () => Promise<Patient[]>;
  addPatient: (name: string) => Promise<Patient>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
