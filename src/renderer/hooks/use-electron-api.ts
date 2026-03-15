import type { Patient } from "@shared/types";

export const useElectronAPI = () => {
  const getPatients = (): Promise<Patient[]> => {
    return window.electronAPI.getPatients();
  };

  const addPatient = (name: string): Promise<Patient> => {
    return window.electronAPI.addPatient(name);
  };

  return { getPatients, addPatient };
};
