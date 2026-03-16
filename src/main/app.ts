import { app, BrowserWindow } from "electron";
import * as path from "path";
import { createMainWindow } from "./window/window-manager";
import { setupMenu } from "./window/menu";
import { registerIpcHandlers } from "./ipc";
import { createBackup, cleanupOldBackups } from "./services/backup-service";
import { getRxDatabase } from "./database/rxdb/database";

const PLATFORM = {
  DARWIN: "darwin"
} as const;

const DB_PATH = path.join(process.cwd(), "caduceus.db");

export const initializeApp = (): void => {
  app.whenReady().then(async () => {
    // Initialize RxDB database
    try {
      await getRxDatabase();
      console.log("RxDB database initialized");
    } catch (error) {
      console.error("Failed to initialize RxDB:", error);
    }

    registerIpcHandlers();
    setupMenu();
    createMainWindow();

    // Create initial backup and schedule daily backups
    try {
      createBackup(DB_PATH);
      cleanupOldBackups();
    } catch (error) {
      console.error("Failed to create initial backup:", error);
    }

    // Schedule daily backups (every 24 hours)
    setInterval(() => {
      try {
        createBackup(DB_PATH);
        cleanupOldBackups();
      } catch (error) {
        console.error("Failed to create scheduled backup:", error);
      }
    }, 24 * 60 * 60 * 1000);

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