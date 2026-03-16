import { ipcMain } from "electron";
import { appointmentService } from "../../database/rxdb";
import { APPOINTMENT_CHANNELS } from "../../../shared/channels";

export const registerAppointmentHandlers = (): void => {
  ipcMain.handle(APPOINTMENT_CHANNELS.GET_ALL, async () => {
    return appointmentService.getAll();
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_ID, async (_, id: string) => {
    return appointmentService.getById(id);
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_PATIENT, async (_, patientId: string) => {
    return appointmentService.getByPatientId(patientId);
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_DATE, async (_, date: string) => {
    return appointmentService.getByDate(date);
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_DATE_RANGE, async (_, startDate: string, endDate: string) => {
    return appointmentService.getByDateRange(startDate, endDate);
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