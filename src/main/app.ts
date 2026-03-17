import { app, BrowserWindow } from "electron";
import * as path from "path";
import { createMainWindow } from "./window/window-manager";
import { setupMenu } from "./window/menu";
import { registerIpcHandlers } from "./ipc";
import { initializeStorage, exposeRxStorage } from "./storage";

const PLATFORM = {
  DARWIN: "darwin"
} as const;

export const initializeApp = (): void => {
  app.whenReady().then(async () => {
    await initializeStorage();
    exposeRxStorage();
    registerIpcHandlers();
    setupMenu();
    createMainWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== PLATFORM.DARWIN) {
      app.quit();
    }
  });
};