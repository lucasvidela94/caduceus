import { ipcMain, BrowserWindow, type IpcMainInvokeEvent } from "electron";
import { IPC_CHANNELS } from "../channels";
import { PatientService } from "../../services/patient-service";
import type { PatientInput } from "../../../shared/types";

const validateSender = (event: IpcMainInvokeEvent): boolean => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  return win !== null;
};

export const registerPatientHandlers = (): void => {
  ipcMain.handle(
    IPC_CHANNELS.GET_PATIENTS,
    async (event: IpcMainInvokeEvent) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      return PatientService.getAll();
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.ADD_PATIENT,
    async (event: IpcMainInvokeEvent, input: PatientInput) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      return PatientService.create(input);
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.GET_PATIENT,
    async (event: IpcMainInvokeEvent, id: number) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      return PatientService.getById(id);
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.UPDATE_PATIENT,
    async (event: IpcMainInvokeEvent, id: number, input: Partial<PatientInput>) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      return PatientService.update(id, input);
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.DELETE_PATIENT,
    async (event: IpcMainInvokeEvent, id: number) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      PatientService.delete(id);
      return { success: true };
    }
  );
};