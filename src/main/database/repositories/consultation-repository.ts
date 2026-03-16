import { eq, and, gte, lte, desc } from "drizzle-orm";
import { getConnection } from "../connection";
import { consultations, NewConsultation } from "../schema/consultations";
import { patients } from "../schema/patients";

export const consultationRepository = {
  findAll: async () => {
    const db = getConnection();
    return db
      .select({
        consultation: consultations,
        patient: patients,
      })
      .from(consultations)
      .leftJoin(patients, eq(consultations.patientId, patients.id))
      .orderBy(desc(consultations.date));
  },

  findById: async (id: number) => {
    const db = getConnection();
    const result = await db
      .select({
        consultation: consultations,
        patient: patients,
      })
      .from(consultations)
      .leftJoin(patients, eq(consultations.patientId, patients.id))
      .where(eq(consultations.id, id))
      .limit(1);
    return result[0] || null;
  },

  findByPatientId: async (patientId: number) => {
    const db = getConnection();
    return db
      .select({
        consultation: consultations,
        patient: patients,
      })
      .from(consultations)
      .leftJoin(patients, eq(consultations.patientId, patients.id))
      .where(eq(consultations.patientId, patientId))
      .orderBy(desc(consultations.date));
  },

  findByDateRange: async (startDate: Date, endDate: Date) => {
    const db = getConnection();
    return db
      .select({
        consultation: consultations,
        patient: patients,
      })
      .from(consultations)
      .leftJoin(patients, eq(consultations.patientId, patients.id))
      .where(and(
        gte(consultations.date, startDate),
        lte(consultations.date, endDate)
      ))
      .orderBy(desc(consultations.date));
  },

  create: async (data: NewConsultation) => {
    const db = getConnection();
    const result = await db.insert(consultations).values(data).returning();
    return result[0];
  },

  update: async (id: number, data: Partial<NewConsultation>) => {
    const db = getConnection();
    const result = await db
      .update(consultations)
      .set(data)
      .where(eq(consultations.id, id))
      .returning();
    return result[0];
  },

  delete: async (id: number) => {
    const db = getConnection();
    await db.delete(consultations).where(eq(consultations.id, id));
  },
};