import { eq } from "drizzle-orm";
import { getConnection } from "../connection";
import { patients } from "../schema/patients";
import type { Patient, PatientInput } from "../../../shared/types";

export const PatientRepository = {
  create: (input: PatientInput): Patient => {
    const db = getConnection();
    const result = db
      .insert(patients)
      .values({
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        address: input.address || null,
        notes: input.notes || null,
        reminderPreference: input.reminderPreference || "email"
      })
      .returning()
      .get();
    
    return mapToPatient(result);
  },

  findAll: (): Patient[] => {
    const db = getConnection();
    const results = db
      .select()
      .from(patients)
      .orderBy(patients.createdAt)
      .all();
    
    return results.map(mapToPatient);
  },

  findById: (id: number): Patient | null => {
    const db = getConnection();
    const result = db
      .select()
      .from(patients)
      .where(eq(patients.id, id))
      .get();
    
    return result ? mapToPatient(result) : null;
  },

  update: (id: number, input: Partial<PatientInput>): Patient => {
    const db = getConnection();
    const result = db
      .update(patients)
      .set({
        ...(input.name !== undefined && { name: input.name }),
        ...(input.email !== undefined && { email: input.email || null }),
        ...(input.phone !== undefined && { phone: input.phone || null }),
        ...(input.address !== undefined && { address: input.address || null }),
        ...(input.notes !== undefined && { notes: input.notes || null }),
        ...(input.reminderPreference !== undefined && { reminderPreference: input.reminderPreference })
      })
      .where(eq(patients.id, id))
      .returning()
      .get();
    
    if (!result) {
      throw new Error(`Patient with id ${id} not found`);
    }
    
    return mapToPatient(result);
  },

  delete: (id: number): boolean => {
    const db = getConnection();
    const result = db
      .delete(patients)
      .where(eq(patients.id, id))
      .run();
    
    return result.changes > 0;
  }
};

const mapToPatient = (row: typeof patients.$inferSelect): Patient => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  address: row.address,
  notes: row.notes,
  reminderPreference: row.reminderPreference,
  created_at: row.createdAt?.toISOString() || new Date().toISOString(),
  updated_at: row.updatedAt?.toISOString() || new Date().toISOString()
});
