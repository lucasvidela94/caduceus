import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import * as path from "path";

const DB_PATH = path.join(process.cwd(), "caduceus.db");

let db: DatabaseType | null = null;

export const getConnection = (): DatabaseType => {
  if (db === null) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
  }
  return db;
};

export const closeConnection = (): void => {
  if (db !== null) {
    db.close();
    db = null;
  }
};
