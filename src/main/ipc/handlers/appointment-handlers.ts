import { ipcMain } from "electron";
import { appointmentService } from "../../services/appointment-service";
import { APPOINTMENT_CHANNELS } from "../../../shared/channels";

export const registerAppointmentHandlers = (): void => {
  ipcMain.handle(APPOINTMENT_CHANNELS.GET_ALL, async () => {
    return appointmentService.getAll();
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_ID, async (_, id: number) => {
    return appointmentService.getById(id);
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_PATIENT, async (_, patientId: number) => {
    return appointmentService.getByPatientId(patientId);
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_DATE, async (_, date: string) => {
    return appointmentService.getByDate(new Date(date));
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_BY_DATE_RANGE, async (_, startDate: string, endDate: string) => {
    return appointmentService.getByDateRange(new Date(startDate), new Date(endDate));
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.CREATE, async (_, data) => {
    return appointmentService.create({
      ...data,
      date: new Date(data.date),
    });
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.UPDATE, async (_, id: number, data) => {
    const updateData: Partial<typeof data> = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }
    return appointmentService.update(id, updateData);
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.DELETE, async (_, id: number) => {
    return appointmentService.delete(id);
  });

  ipcMain.handle(APPOINTMENT_CHANNELS.GET_AVAILABLE_SLOTS, async (_, date: string, duration?: number) => {
    return appointmentService.getAvailableSlots(new Date(date), duration);
  });
};