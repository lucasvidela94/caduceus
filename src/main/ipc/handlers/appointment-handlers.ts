import { ipcMain } from "electron";
import { appointmentService, patientService } from "../../database/rxdb";
import { APPOINTMENT_CHANNELS } from "../../../shared/channels";

export const registerAppointmentHandlers = (): void => {
  ipcMain.handle(APPOINTMENT_CHANNELS.GET_ALL, async () => {
    const list = await appointmentService.getAll();
    const result = await Promise.all(list.map(async (apt: any) => {
      let patient = null;
      try {
        patient = await patientService.getById(apt.patientId);
      } catch {
        patient = null;
      }
      return { appointment: apt, patient: patient ? { id: patient.id, name: patient.name } : null };
    }));
    return result;
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_ID, async (_, id: string) => {
    const apt = await appointmentService.getById(id);
    if (!apt) return null;
    let patient = null;
    try {
      patient = await patientService.getById((apt as any).patientId);
    } catch {
      patient = null;
    }
    return { appointment: apt, patient: patient ? { id: patient.id, name: patient.name, email: patient.email, phone: patient.phone } : null };
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_PATIENT, async (_, patientId: string) => {
    return appointmentService.getByPatientId(patientId);
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_DATE, async (_, date: string) => {
    const list = await appointmentService.getByDate(date);
    return Promise.all(list.map(async (apt: any) => {
      let patient = null;
      try {
        patient = await patientService.getById(apt.patientId);
      } catch {
        patient = null;
      }
      return { appointment: apt, patient: patient ? { id: patient.id, name: patient.name } : null };
    }));
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_DATE_RANGE, async (_, startDate: string, endDate: string) => {
    const list = await appointmentService.getByDateRange(startDate, endDate);
    return Promise.all(list.map(async (apt: any) => {
      let patient = null;
      try {
        patient = await patientService.getById(apt.patientId);
      } catch {
        patient = null;
      }
      return { appointment: apt, patient: patient ? { id: patient.id, name: patient.name } : null };
    }));
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.CREATE, async (_, data: {
    patientId: string;
    date: string;
    time: string;
    duration: number;
    reason: string;
    notes?: string;
  }) => {
    return appointmentService.create(data);
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.UPDATE, async (_, id: string, data: Partial<{
    date: string;
    time: string;
    duration: number;
    reason: string;
    status: string;
    notes: string;
  }>) => {
    return appointmentService.update(id, data);
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.DELETE, async (_, id: string) => {
    return appointmentService.delete(id);
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_AVAILABLE_SLOTS, async (_, date: string, duration?: number) => {
    return appointmentService.getAvailableSlots(date, duration);
  });
};