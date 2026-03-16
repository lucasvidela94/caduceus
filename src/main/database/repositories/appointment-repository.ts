import { eq, and, gte, lte } from "drizzle-orm";
import { getConnection } from "../connection";
import { appointments, NewAppointment } from "../schema/appointments";
import { patients } from "../schema/patients";

export const appointmentRepository = {
  findAll: async () => {
    const db = getConnection();
    return db
      .select({
        appointment: appointments,
        patient: patients,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .orderBy(appointments.date, appointments.time);
  },

  findById: async (id: number) => {
    const db = getConnection();
    const result = await db
      .select({
        appointment: appointments,
        patient: patients,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .where(eq(appointments.id, id))
      .limit(1);
    return result[0] || null;
  },

  findByPatientId: async (patientId: number) => {
    const db = getConnection();
    return db
      .select({
        appointment: appointments,
        patient: patients,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .where(eq(appointments.patientId, patientId))
      .orderBy(appointments.date, appointments.time);
  },

  findByDate: async (date: Date) => {
    const db = getConnection();
    return db
      .select({
        appointment: appointments,
        patient: patients,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .where(eq(appointments.date, date))
      .orderBy(appointments.time);
  },

  findByDateRange: async (startDate: Date, endDate: Date) => {
    const db = getConnection();
    return db
      .select({
        appointment: appointments,
        patient: patients,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .where(and(
        gte(appointments.date, startDate),
        lte(appointments.date, endDate)
      ))
      .orderBy(appointments.date, appointments.time);
  },

  findOverlapping: async (date: Date, time: string, duration: number, excludeId?: number) => {
    const db = getConnection();
    
    const [hours, minutes] = time.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;
    
    const allAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.date, date));
    
    return allAppointments.filter(apt => {
      if (excludeId && apt.id === excludeId) return false;
      
      const [aptHours, aptMinutes] = apt.time.split(":").map(Number);
      const aptStart = aptHours * 60 + aptMinutes;
      const aptEnd = aptStart + apt.duration;
      
      return (startMinutes < aptEnd && endMinutes > aptStart);
    });
  },

  create: async (data: NewAppointment) => {
    const db = getConnection();
    const result = await db.insert(appointments).values(data).returning();
    return result[0];
  },

  update: async (id: number, data: Partial<NewAppointment>) => {
    const db = getConnection();
    const result = await db
      .update(appointments)
      .set(data)
      .where(eq(appointments.id, id))
      .returning();
    return result[0];
  },

  delete: async (id: number) => {
    const db = getConnection();
    await db.delete(appointments).where(eq(appointments.id, id));
  },
};