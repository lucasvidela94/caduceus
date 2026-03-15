import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as path from "path";
import * as fs from "fs";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { patients } from "./schema/patients";

const DB_PATH = path.join(process.cwd(), "caduceus.db");
const MIGRATIONS_FOLDER = path.join(__dirname, "../../drizzle");

let db: ReturnType<typeof drizzle> | null = null;

export const getConnection = (): ReturnType<typeof drizzle> => {
  if (db === null) {
    const sqlite = new Database(DB_PATH);
    sqlite.pragma("journal_mode = WAL");
    db = drizzle(sqlite, { schema: { patients } });
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

export const backupBeforeMigration = (): string => {
  const sqlite = new Database(DB_PATH);
  const backupPath = DB_PATH.replace(".db", `.backup-${Date.now()}.db`);
  sqlite.backup(backupPath);
  sqlite.close();
  return backupPath;
};
