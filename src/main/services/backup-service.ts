import * as fs from "fs";
import * as path from "path";
import { app } from "electron";
import { patientService, appointmentService, consultationService, settingsService } from "../database/rxdb";

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

export interface BackupData {
  version: string;
  exportedAt: string;
  patients: any[];
  appointments: any[];
  consultations: any[];
  settings: Record<string, string>;
}

export const createBackup = async (_dbPath: string): Promise<string> => {
  ensureBackupDirectory();
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFileName = `caduceus-backup-${timestamp}.json`;
  const backupPath = path.join(getBackupDirectory(), backupFileName);
  
  // Export all data from RxDB
  const [patients, appointments, consultations, settings] = await Promise.all([
    patientService.getAll(),
    appointmentService.getAll(),
    consultationService.getAll(),
    settingsService.getAll()
  ]);
  
  const backupData: BackupData = {
    version: "0.3.0",
    exportedAt: new Date().toISOString(),
    patients,
    appointments,
    consultations,
    settings
  };
  
  fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), "utf8");
  
  return backupPath;
};

export const listBackups = (): Array<{ name: string; path: string; size: number; created: Date }> => {
  const backupDir = getBackupDirectory();
  
  if (!fs.existsSync(backupDir)) {
    return [];
  }
  
  const files = fs.readdirSync(backupDir)
    .filter((file) => file.endsWith(".json"))
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

export const restoreBackup = async (backupPath: string): Promise<void> => {
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }
  
  const content = fs.readFileSync(backupPath, "utf8");
  const data: BackupData = JSON.parse(content);
  
  // Restore patients
  if (data.patients) {
    for (const patient of data.patients) {
      try {
        await patientService.create(patient);
      } catch (error) {
        console.error(`Failed to restore patient: ${patient.name}`, error);
      }
    }
  }
  
  // Restore appointments
  if (data.appointments) {
    for (const appointment of data.appointments) {
      try {
        await appointmentService.create(appointment);
      } catch (error) {
        console.error(`Failed to restore appointment: ${appointment.id}`, error);
      }
    }
  }
  
  // Restore consultations
  if (data.consultations) {
    for (const consultation of data.consultations) {
      try {
        await consultationService.create(consultation);
      } catch (error) {
        console.error(`Failed to restore consultation: ${consultation.id}`, error);
      }
    }
  }
  
  // Restore settings
  if (data.settings) {
    for (const [key, value] of Object.entries(data.settings)) {
      try {
        await settingsService.setValue(key, value);
      } catch (error) {
        console.error(`Failed to restore setting: ${key}`, error);
      }
    }
  }
};