import { reminderRepository } from "../database/repositories/reminder-repository";
import { appointmentRepository } from "../database/repositories/appointment-repository";
import { PatientRepository } from "../database/repositories/patient-repository";
import { NewReminder } from "../database/schema/reminders";

const REMINDER_HOURS_BEFORE = 24; // Enviar recordatorio 24 horas antes

export const reminderService = {
  // Crear recordatorios para un turno
  createRemindersForAppointment: async (appointmentId: number) => {
    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new Error("Turno no encontrado");
    }

    const patient = await PatientRepository.findById(appointment.appointment.patientId);
    if (!patient) {
      throw new Error("Paciente no encontrado");
    }

    // Borrar recordatorios existentes para este turno
    await reminderRepository.deleteByAppointmentId(appointmentId);

    const reminders: NewReminder[] = [];
    const appointmentDate = new Date(appointment.appointment.date);
    const reminderTime = new Date(appointmentDate.getTime() - REMINDER_HOURS_BEFORE * 60 * 60 * 1000);

    // Determinar qué recordatorios crear según preferencia del paciente
    const preference = patient.reminderPreference || "email";

    if (preference === "email" || preference === "both") {
      if (patient.email) {
        reminders.push({
          appointmentId,
          type: "email",
          status: "pending",
          scheduledFor: reminderTime,
        });
      }
    }

    if (preference === "sms" || preference === "both") {
      if (patient.phone) {
        reminders.push({
          appointmentId,
          type: "sms",
          status: "pending",
          scheduledFor: reminderTime,
        });
      }
    }

    // Crear los recordatorios
    const created = [];
    for (const reminder of reminders) {
      created.push(await reminderRepository.create(reminder));
    }

    return created;
  },

  // Obtener recordatorios pendientes para enviar
  getPendingReminders: async () => {
    const now = new Date();
    return reminderRepository.findPendingBefore(now);
  },

  // Procesar recordatorios pendientes (simulado - en producción enviaría email/SMS real)
  processPendingReminders: async () => {
    const pending = await reminderService.getPendingReminders();
    const results = [];

    for (const reminder of pending) {
      try {
        // Aquí iría la lógica real de envío de email/SMS
        // Por ahora simulamos el envío
        console.log(`Enviando recordatorio ${reminder.type} para turno ${reminder.appointmentId}`);
        
        await reminderRepository.markAsSent(reminder.id);
        results.push({ id: reminder.id, status: "sent" });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error desconocido";
        await reminderRepository.markAsFailed(reminder.id, errorMsg);
        results.push({ id: reminder.id, status: "failed", error: errorMsg });
      }
    }

    return results;
  },

  // Obtener todos los recordatorios de un turno
  getRemindersByAppointment: async (appointmentId: number) => {
    return reminderRepository.findByAppointmentId(appointmentId);
  },

  // Cancelar recordatorios de un turno
  cancelReminders: async (appointmentId: number) => {
    await reminderRepository.deleteByAppointmentId(appointmentId);
  },

  // Estadísticas de recordatorios
  getStats: async () => {
    const all = await reminderRepository.findAll();
    return {
      total: all.length,
      pending: all.filter(r => r.status === "pending").length,
      sent: all.filter(r => r.status === "sent").length,
      failed: all.filter(r => r.status === "failed").length,
    };
  },
};