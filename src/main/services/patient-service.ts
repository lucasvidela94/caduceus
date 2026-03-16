import { PatientRepository } from "../database/repositories/patient-repository";
import type { Patient, PatientInput } from "../../shared/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)]{7,20}$/;

export const PatientService = {
  create: (input: PatientInput): Patient => {
    validateInput(input);
    return PatientRepository.create({
      name: input.name.trim(),
      email: input.email?.trim() || undefined,
      phone: input.phone?.trim() || undefined,
      address: input.address?.trim() || undefined,
      notes: input.notes?.trim() || undefined
    });
  },

  update: (id: number, input: Partial<PatientInput>): Patient => {
    if (input.name !== undefined) {
      validateInput({ ...input, name: input.name } as PatientInput);
    }
    return PatientRepository.update(id, input);
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
  },

  search: (query: string): Patient[] => {
    if (!query || query.trim().length === 0) {
      return PatientRepository.findAll();
    }

    const searchTerm = query.toLowerCase().trim();
    const allPatients = PatientRepository.findAll();

    return allPatients.filter(patient => {
      const nameMatch = patient.name.toLowerCase().includes(searchTerm);
      const emailMatch = patient.email?.toLowerCase().includes(searchTerm) ?? false;
      const phoneMatch = patient.phone?.toLowerCase().includes(searchTerm) ?? false;
      const addressMatch = patient.address?.toLowerCase().includes(searchTerm) ?? false;
      const notesMatch = patient.notes?.toLowerCase().includes(searchTerm) ?? false;

      return nameMatch || emailMatch || phoneMatch || addressMatch || notesMatch;
    });
  }
};

const validateInput = (input: PatientInput): void => {
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

  if (input.email && input.email.trim().length > 0 && !EMAIL_REGEX.test(input.email)) {
    throw new Error("El email no es válido");
  }

  if (input.phone && input.phone.trim().length > 0 && !PHONE_REGEX.test(input.phone)) {
    throw new Error("El teléfono no es válido");
  }

  if (input.address && input.address.length > 255) {
    throw new Error("La dirección no puede tener más de 255 caracteres");
  }

  if (input.notes && input.notes.length > 2000) {
    throw new Error("Las notas no pueden tener más de 2000 caracteres");
  }
};