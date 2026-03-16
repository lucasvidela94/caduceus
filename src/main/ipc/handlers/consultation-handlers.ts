import { ipcMain } from "electron";
import { consultationService } from "../../database/rxdb";
import { CONSULTATION_CHANNELS } from "../../../shared/channels";

export const registerConsultationHandlers = (): void => {
  ipcMain.handle(CONSULTATION_CHANNELS.GET_ALL, async () => {
    return consultationService.getAll();
  });

  ipcMain.handle(CONSULTATION_CHANNELS.GET_BY_ID, async (_, id: string) => {
    return consultationService.getById(id);
  });

  ipcMain.handle(CONSULTATION_CHANNELS.GET_BY_PATIENT, async (_, patientId: string) => {
    return consultationService.getByPatientId(patientId);
  });

  ipcMain.handle(CONSULTATION_CHANNELS.GET_BY_DATE_RANGE, async (_, startDate: string, endDate: string) => {
    return consultationService.getByDateRange(startDate, endDate);
  });

  ipcMain.handle(CONSULTATION_CHANNELS.CREATE, async (_, data: {
    patientId: string;
    date: string;
    reason: string;
    symptoms?: string;
    bloodPressure?: string;
    heartRate?: number;
    temperature?: string;
    weight?: string;
    height?: string;
    physicalExam?: string;
    diagnosis: string;
    treatment?: string;
    prescription?: string;
    labRequested?: boolean;
    rxRequested?: boolean;
    ecgRequested?: boolean;
    ultrasoundRequested?: boolean;
    otherStudies?: string;
    nextAppointment?: string;
    notes?: string;
  }) => {
    return consultationService.create(data);
  });

  ipcMain.handle(CONSULTATION_CHANNELS.UPDATE, async (_, id: string, data: Partial<{
    date: string;
    reason: string;
    symptoms: string;
    bloodPressure: string;
    heartRate: number;
    temperature: string;
    weight: string;
    height: string;
    physicalExam: string;
    diagnosis: string;
    treatment: string;
    prescription: string;
    labRequested: boolean;
    rxRequested: boolean;
    ecgRequested: boolean;
    ultrasoundRequested: boolean;
    otherStudies: string;
    nextAppointment: string;
    notes: string;
  }>) => {
    return consultationService.update(id, data);
  });

  ipcMain.handle(CONSULTATION_CHANNELS.DELETE, async (_, id: string) => {
    return consultationService.delete(id);
  });
};