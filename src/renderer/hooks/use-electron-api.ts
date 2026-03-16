import type { Patient, PatientInput } from "@shared/types";
import { patientService } from "@/services";

export const useElectronAPI = () => {
  const getPatients = (): Promise<Patient[]> => patientService.getAll();
  const addPatient = (input: PatientInput): Promise<Patient> => patientService.create(input);
  return { getPatients, addPatient };
};
