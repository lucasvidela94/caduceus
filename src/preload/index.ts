import { contextBridge, ipcRenderer } from "electron";

const IPC_CHANNELS = {
  GET_PATIENTS: "get-patients",
  ADD_PATIENT: "add-patient"
} as const;

export interface Patient {
  id: number;
  name: string;
  created_at: string;
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

const api: ElectronAPI = {
  getPatients: (): Promise<Patient[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_PATIENTS),
  addPatient: (name: string): Promise<Patient> =>
    ipcRenderer.invoke(IPC_CHANNELS.ADD_PATIENT, name)
};

contextBridge.exposeInMainWorld("electronAPI", api);
