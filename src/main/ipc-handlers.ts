import { ipcMain, BrowserWindow, type IpcMainInvokeEvent } from "electron";
import { IPC_CHANNELS } from "../shared/channels";
import { getPatients, addPatient } from "./db";

const validateSender = (event: IpcMainInvokeEvent): boolean => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  return win !== null;
};

export const registerIpcHandlers = (): void => {
  ipcMain.handle(IPC_CHANNELS.GET_PATIENTS, async (event: IpcMainInvokeEvent) => {
    if (!validateSender(event)) {
      throw new Error("Invalid sender");
    }
    return getPatients();
  });

  ipcMain.handle(
    IPC_CHANNELS.ADD_PATIENT,
    async (event: IpcMainInvokeEvent, name: string) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      if (typeof name !== "string" || name.trim().length === 0) {
        throw new Error("Invalid patient name");
      }
      return addPatient({ name: name.trim() });
    }
  );
};
