import { PatientRepository } from "../database/repositories/patient-repository";
import type { Patient, PatientInput } from "../../shared/types";

export const PatientService = {
  create: (input: PatientInput): Patient => {
    if (!input.name || input.name.trim().length === 0) {
      throw new Error("El nombre del paciente es requerido");
    }

    const trimmedName = input.name.trim();
    
    if (trimmedName.length < 2) {
      throw new Error("El nombre debe tener al menos 2 caracteres");
    }

    if (trimmedName.length > 100) {
      throw new Error("El nombre no puede tener más de 100 caracteres");
    }

    return PatientRepository.create({ name: trimmedName });
  },

  getAll: (): Patient[] => {
    return PatientRepository.findAll();
  },

  getById: (id: number): Patient => {
    const patient = PatientRepository.findById(id);
    if (patient === null) {
      throw new Error(`Paciente con ID ${id} no encontrado`);
    }
    return patient;
  },

  delete: (id: number): void => {
    const deleted = PatientRepository.delete(id);
    if (!deleted) {
      throw new Error(`No se pudo eliminar el paciente con ID ${id}`);
    }
  }
};
