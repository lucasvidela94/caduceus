import { getConnection } from "../connection";
import type { Patient, PatientInput } from "../../../shared/types";

export const PatientRepository = {
  create: (input: PatientInput): Patient => {
    const db = getConnection();
    const stmt = db.prepare(
      "INSERT INTO patients (name) VALUES (?) RETURNING id, name, created_at"
    );
    return stmt.get(input.name) as Patient;
  },

  findAll: (): Patient[] => {
    const db = getConnection();
    const stmt = db.prepare(
      "SELECT id, name, created_at FROM patients ORDER BY created_at DESC"
    );
    return stmt.all() as Patient[];
  },

  findById: (id: number): Patient | null => {
    const db = getConnection();
    const stmt = db.prepare(
      "SELECT id, name, created_at FROM patients WHERE id = ?"
    );
    return stmt.get(id) as Patient | null;
  },

  delete: (id: number): boolean => {
    const db = getConnection();
    const stmt = db.prepare("DELETE FROM patients WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }
};
