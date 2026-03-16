import * as fs from "fs";
import * as path from "path";
import { app } from "electron";

const BACKUP_RETENTION_DAYS = 30;
const MAX_BACKUP_COUNT = 10;

export const getBackupDirectory = (): string => {
  return path.join(app.getPath("userData"), "backups");
};

export const ensureBackupDirectory = (): void => {
  const backupDir = getBackupDirectory();
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
};

export const createBackup = (dbPath: string): string => {
  ensureBackupDirectory();
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFileName = `caduceus-backup-${timestamp}.db`;
  const backupPath = path.join(getBackupDirectory(), backupFileName);
  
  fs.copyFileSync(dbPath, backupPath);
  
  return backupPath;
};

export const listBackups = (): Array<{ name: string; path: string; size: number; created: Date }> => {
  const backupDir = getBackupDirectory();
  
  if (!fs.existsSync(backupDir)) {
    return [];
  }
  
  const files = fs.readdirSync(backupDir)
    .filter((file) => file.endsWith(".db"))
    .map((file) => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        size: stats.size,
        created: stats.birthtime
      };
    })
    .sort((a, b) => b.created.getTime() - a.created.getTime());
  
  return files;
};

export const cleanupOldBackups = (): void => {
  const backups = listBackups();
  const now = new Date();
  
  // Remove backups older than retention period
  const oldBackups = backups.filter((backup) => {
    const ageInDays = (now.getTime() - backup.created.getTime()) / (1000 * 60 * 60 * 24);
    return ageInDays > BACKUP_RETENTION_DAYS;
  });
  
  for (const backup of oldBackups) {
    try {
      fs.unlinkSync(backup.path);
    } catch (error) {
      console.error(`Failed to delete old backup: ${backup.path}`, error);
    }
  }
  
  // Keep only the most recent MAX_BACKUP_COUNT backups
  if (backups.length > MAX_BACKUP_COUNT) {
    const backupsToDelete = backups.slice(MAX_BACKUP_COUNT);
    for (const backup of backupsToDelete) {
      try {
        fs.unlinkSync(backup.path);
      } catch (error) {
        console.error(`Failed to delete excess backup: ${backup.path}`, error);
      }
    }
  }
};

export const restoreBackup = (backupPath: string, targetPath: string): void => {
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }
  
  // Create backup of current database before restoring
  if (fs.existsSync(targetPath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const preRestoreBackup = path.join(
      getBackupDirectory(),
      `caduceus-pre-restore-${timestamp}.db`
    );
    fs.copyFileSync(targetPath, preRestoreBackup);
  }
  
  fs.copyFileSync(backupPath, targetPath);
};
