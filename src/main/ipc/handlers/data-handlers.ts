import { ipcMain, BrowserWindow, type IpcMainInvokeEvent, dialog } from "electron";
import { IPC_CHANNELS } from "../channels";
import { writeJsonExport, writeCsvExport, readFileContent, type ExportData } from "../../services/export-import-service";

const validateSender = (event: IpcMainInvokeEvent): boolean => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  return win !== null;
};

export const registerDataHandlers = (): void => {
  ipcMain.handle(
    IPC_CHANNELS.EXPORT_JSON,
    async (event: IpcMainInvokeEvent, data: ExportData) => {
      if (!validateSender(event)) throw new Error("Invalid sender");
      const win = BrowserWindow.fromWebContents(event.sender);
      const result = await dialog.showSaveDialog(win!, {
        title: "Exportar Pacientes (JSON)",
        defaultPath: "caduceus-export.json",
        filters: [{ name: "JSON", extensions: ["json"] }]
      });
      if (result.canceled || !result.filePath) {
        return { success: false, canceled: true };
      }
      writeJsonExport(result.filePath, data);
      return { success: true, path: result.filePath };
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.IMPORT_JSON,
    async (event: IpcMainInvokeEvent) => {
      if (!validateSender(event)) throw new Error("Invalid sender");
      const win = BrowserWindow.fromWebContents(event.sender);
      const result = await dialog.showOpenDialog(win!, {
        title: "Importar Pacientes (JSON)",
        filters: [{ name: "JSON", extensions: ["json"] }],
        properties: ["openFile"]
      });
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, canceled: true };
      }
      const content = readFileContent(result.filePaths[0]);
      return { success: true, content };
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.EXPORT_CSV,
    async (event: IpcMainInvokeEvent, csvContent: string) => {
      if (!validateSender(event)) throw new Error("Invalid sender");
      const win = BrowserWindow.fromWebContents(event.sender);
      const result = await dialog.showSaveDialog(win!, {
        title: "Exportar Pacientes (CSV)",
        defaultPath: "caduceus-export.csv",
        filters: [{ name: "CSV", extensions: ["csv"] }]
      });
      if (result.canceled || !result.filePath) {
        return { success: false, canceled: true };
      }
      writeCsvExport(result.filePath, csvContent);
      return { success: true, path: result.filePath };
    }
  );

  ipcMain.handle(
    IPC_CHANNELS.CHECK_INTEGRITY,
    async (event: IpcMainInvokeEvent) => {
      if (!validateSender(event)) throw new Error("Invalid sender");
      return { ok: true, errors: [] };
    }
  );
};
