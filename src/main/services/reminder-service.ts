import { appointmentService } from "../database/rxdb";
import { patientService } from "../database/rxdb";

const REMINDER_HOURS_BEFORE = 24;

export const reminderService = {
  createRemindersForAppointment: async (appointmentId: string) => {
    const appointment = await appointmentService.getById(appointmentId);
    if (!appointment) {
      throw new Error("Turno no encontrado");
    }
    const patient = await patientService.getById(appointment.patientId);
    if (!patient) {
      throw new Error("Paciente no encontrado");
    }
    return [];
  },

  getPendingReminders: async () => [],

  processPendingReminders: async () => [],

  getRemindersByAppointment: async (_appointmentId: string) => [],

  cancelReminders: async (_appointmentId: string) => {},

  getStats: async () => ({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0,
  }),
};