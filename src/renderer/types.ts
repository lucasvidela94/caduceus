import type { Patient } from "@shared/types";

export interface ElectronAPI {
  getPatients: () => Promise<Patient[]>;
  addPatient: (name: string) => Promise<Patient>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
