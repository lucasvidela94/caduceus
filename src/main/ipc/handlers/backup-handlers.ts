import { ipcMain, BrowserWindow, type IpcMainInvokeEvent } from "electron";
import { IPC_CHANNELS } from "../channels";
import { createBackupFromData, listBackups, readBackupData, type BackupData } from "../../services/backup-service";

const validateSender = (event: IpcMainInvokeEvent): boolean => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  return win !== null;
};

export const registerBackupHandlers = (): void => {
  ipcMain.handle(
    IPC_CHANNELS.CREATE_BACKUP,
    async (event: IpcMainInvokeEvent, data: BackupData) => {
      if (!validateSender(event)) throw new Error("Invalid sender");
      const backupPath = await createBackupFromData(data);
      return { success: true, path: backupPath };
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.LIST_BACKUPS,
    async (event: IpcMainInvokeEvent) => {
      if (!validateSender(event)) throw new Error("Invalid sender");
      return listBackups();
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.GET_BACKUP_DATA,
    async (event: IpcMainInvokeEvent, backupPath: string) => {
      if (!validateSender(event)) throw new Error("Invalid sender");
      return readBackupData(backupPath);
    }
  );
};
