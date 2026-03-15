import { ipcMain, BrowserWindow, type IpcMainInvokeEvent } from "electron";
import * as path from "path";
import { IPC_CHANNELS } from "../channels";
import { createBackup, listBackups, restoreBackup } from "../../services/backup-service";

const DB_PATH = path.join(process.cwd(), "caduceus.db");

const validateSender = (event: IpcMainInvokeEvent): boolean => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  return win !== null;
};

export const registerBackupHandlers = (): void => {
  ipcMain.handle(
    IPC_CHANNELS.CREATE_BACKUP,
    async (event: IpcMainInvokeEvent) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      const backupPath = createBackup(DB_PATH);
      return { success: true, path: backupPath };
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.LIST_BACKUPS,
    async (event: IpcMainInvokeEvent) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      return listBackups();
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.RESTORE_BACKUP,
    async (event: IpcMainInvokeEvent, backupPath: string) => {
      if (!validateSender(event)) {
        throw new Error("Invalid sender");
      }
      restoreBackup(backupPath, DB_PATH);
      return { success: true };
    }
  );
};
