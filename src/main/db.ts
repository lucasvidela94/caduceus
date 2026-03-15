import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";
import * as path from "path";
import type { Patient, PatientInput } from "../shared/types";

const DB_PATH = path.join(process.cwd(), "medicos.db");

const db: DatabaseType = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export const addPatient = (input: PatientInput): Patient => {
  const stmt = db.prepare(
    "INSERT INTO patients (name) VALUES (?) RETURNING id, name, created_at"
  );
  const result = stmt.get(input.name) as Patient;
  return result;
};

export const getPatients = (): Patient[] => {
  const stmt = db.prepare(
    "SELECT id, name, created_at FROM patients ORDER BY created_at DESC"
  );
  return stmt.all() as Patient[];
};

export { db };
