import { ipcMain } from "electron";
import { consultationService } from "../../services/consultation-service";
import { CONSULTATION_CHANNELS } from "../../../shared/channels";

export const registerConsultationHandlers = (): void => {
  ipcMain.handle(CONSULTATION_CHANNELS.GET_ALL, async () => {
    return consultationService.getAll();
  });

  ipcMain.handle(CONSULTATION_CHANNELS.GET_BY_ID, async (_, id: number) => {
    return consultationService.getById(id);
  });

  ipcMain.handle(CONSULTATION_CHANNELS.GET_BY_PATIENT, async (_, patientId: number) => {
    return consultationService.getByPatientId(patientId);
  });

  ipcMain.handle(CONSULTATION_CHANNELS.GET_BY_DATE_RANGE, async (_, startDate: string, endDate: string) => {
    return consultationService.getByDateRange(new Date(startDate), new Date(endDate));
  });

  ipcMain.handle(CONSULTATION_CHANNELS.CREATE, async (_, data) => {
    return consultationService.create({
      ...data,
      date: new Date(data.date),
    });
  });

  ipcMain.handle(CONSULTATION_CHANNELS.UPDATE, async (_, id: number, data) => {
    const updateData: Partial<typeof data> = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }
    return consultationService.update(id, updateData);
  });

  ipcMain.handle(CONSULTATION_CHANNELS.DELETE, async (_, id: number) => {
    return consultationService.delete(id);
  });
};