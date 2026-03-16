import { ipcMain, BrowserWindow, type IpcMainInvokeEvent } from "electron";
import { IPC_CHANNELS } from "../channels";
import { patientService } from "../../database/rxdb";

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
      return patientService.getAll();
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.ADD_PATIENT,
    async (event: IpcMainInvokeEvent, input: {
      name: string;
      email?: string;
      phone?: string;
      address?: string;
      notes?: string;
      reminderPreference?: string;
    }) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      return patientService.create(input);
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.GET_PATIENT,
    async (event: IpcMainInvokeEvent, id: string) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      return patientService.getById(id);
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.UPDATE_PATIENT,
    async (event: IpcMainInvokeEvent, id: string, input: Partial<{
      name: string;
      email?: string;
      phone?: string;
      address?: string;
      notes?: string;
      reminderPreference?: string;
    }>) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      return patientService.update(id, input);
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.DELETE_PATIENT,
    async (event: IpcMainInvokeEvent, id: string) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      await patientService.delete(id);
      return { success: true };
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.SEARCH_PATIENTS,
    async (event: IpcMainInvokeEvent, query: string) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      return patientService.search(query);
    }
  );
};