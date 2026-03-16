import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as path from "path";
import * as fs from "fs";
import { app } from "electron";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { patients } from "./schema/patients";
import { appointments } from "./schema/appointments";
import { consultations } from "./schema/consultations";
import { settings } from "./schema/settings";
import { reminders } from "./schema/reminders";

const DB_PATH = path.join(app.getPath("userData"), "caduceus.db");
const MIGRATIONS_FOLDER = path.join(process.cwd(), "drizzle");

let db: ReturnType<typeof drizzle> | null = null;

export const getConnection = (): ReturnType<typeof drizzle> => {
  if (db === null) {
    const sqlite = new Database(DB_PATH);
    sqlite.pragma("journal_mode = WAL");
    db = drizzle(sqlite, { schema: { patients, appointments, consultations, settings, reminders } });
  }
  return db;
};

export const closeConnection = (): void => {
  if (db !== null) {
    const sqlite = db.$client as Database.Database;
    sqlite.close();
    db = null;
  }
};

export const runMigrations = (): void => {
  const connection = getConnection();
  
  if (fs.existsSync(MIGRATIONS_FOLDER)) {
    migrate(connection, { migrationsFolder: MIGRATIONS_FOLDER });
  }
};

export const backupBeforeMigration = async (): Promise<string> => {
  const backupDir = path.join(app.getPath("userData"), "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  const sqlite = new Database(DB_PATH);
  const backupPath = path.join(backupDir, `caduceus-backup-${Date.now()}.db`);
  await sqlite.backup(backupPath);
  sqlite.close();
  return backupPath;
};
