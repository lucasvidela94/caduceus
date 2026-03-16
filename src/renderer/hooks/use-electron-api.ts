import type { Patient, PatientInput } from "@shared/types";

export const useElectronAPI = () => {
  const getPatients = (): Promise<Patient[]> => {
    return window.electronAPI.getPatients();
  };

  const addPatient = (input: PatientInput): Promise<Patient> => {
    return window.electronAPI.addPatient(input);
  };

  return { getPatients, addPatient };
};
