import { app, BrowserWindow } from "electron";
import * as path from "path";
import { createMainWindow } from "./window/window-manager";
import { setupMenu } from "./window/menu";
import { registerIpcHandlers } from "./ipc";
import { runMigrations, backupBeforeMigration } from "./database/connection";
import { createBackup, cleanupOldBackups } from "./services/backup-service";

const PLATFORM = {
  DARWIN: "darwin"
} as const;

const DB_PATH = path.join(process.cwd(), "caduceus.db");

export const initializeApp = (): void => {
  app.whenReady().then(() => {
    // Backup before running migrations
    try {
      const backupPath = backupBeforeMigration();
      console.log("Database backup created:", backupPath);
    } catch (error) {
      console.error("Failed to create backup before migration:", error);
    }

    // Run Drizzle migrations
    try {
      runMigrations();
      console.log("Database migrations completed");
    } catch (error) {
      console.error("Migration failed:", error);
      // Continue anyway - the app should still work with existing schema
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
