import { consultationRepository } from "../database/repositories/consultation-repository";
import { NewConsultation } from "../database/schema/consultations";

export const consultationService = {
  getAll: async () => {
    return consultationRepository.findAll();
  },

  getById: async (id: number) => {
    return consultationRepository.findById(id);
  },

  getByPatientId: async (patientId: number) => {
    return consultationRepository.findByPatientId(patientId);
  },

  getByDateRange: async (startDate: Date, endDate: Date) => {
    return consultationRepository.findByDateRange(startDate, endDate);
  },

  create: async (data: NewConsultation) => {
    if (!data.patientId) {
      throw new Error("El paciente es obligatorio");
    }
    if (!data.reason) {
      throw new Error("El motivo de consulta es obligatorio");
    }
    if (!data.diagnosis) {
      throw new Error("El diagnóstico es obligatorio");
    }

    return consultationRepository.create(data);
  },

  update: async (id: number, data: Partial<NewConsultation>) => {
    const existing = await consultationRepository.findById(id);
    if (!existing) {
      throw new Error("Consulta no encontrada");
    }

    return consultationRepository.update(id, data);
  },

  delete: async (id: number) => {
    const existing = await consultationRepository.findById(id);
    if (!existing) {
      throw new Error("Consulta no encontrada");
    }
    return consultationRepository.delete(id);
  },
};