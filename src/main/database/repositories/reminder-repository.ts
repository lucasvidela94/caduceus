import { eq, and, gte, lte } from "drizzle-orm";
import { getConnection } from "../connection";
import { reminders, NewReminder } from "../schema/reminders";

export const reminderRepository = {
  findAll: async () => {
    const db = getConnection();
    return db.select().from(reminders);
  },

  findById: async (id: number) => {
    const db = getConnection();
    const result = await db
      .select()
      .from(reminders)
      .where(eq(reminders.id, id))
      .limit(1);
    return result[0] || null;
  },

  findByAppointmentId: async (appointmentId: number) => {
    const db = getConnection();
    return db
      .select()
      .from(reminders)
      .where(eq(reminders.appointmentId, appointmentId));
  },

  findPending: async () => {
    const db = getConnection();
    return db
      .select()
      .from(reminders)
      .where(eq(reminders.status, "pending"));
  },

  findPendingBefore: async (date: Date) => {
    const db = getConnection();
    return db
      .select()
      .from(reminders)
      .where(and(
        eq(reminders.status, "pending"),
        lte(reminders.scheduledFor, date)
      ));
  },

  create: async (data: NewReminder) => {
    const db = getConnection();
    const result = await db.insert(reminders).values(data).returning();
    return result[0];
  },

  update: async (id: number, data: Partial<NewReminder>) => {
    const db = getConnection();
    const result = await db
      .update(reminders)
      .set(data)
      .where(eq(reminders.id, id))
      .returning();
    return result[0];
  },

  markAsSent: async (id: number) => {
    const db = getConnection();
    const result = await db
      .update(reminders)
      .set({ 
        status: "sent", 
        sentAt: new Date() 
      })
      .where(eq(reminders.id, id))
      .returning();
    return result[0];
  },

  markAsFailed: async (id: number, error: string) => {
    const db = getConnection();
    const result = await db
      .update(reminders)
      .set({ 
        status: "failed", 
        error 
      })
      .where(eq(reminders.id, id))
      .returning();
    return result[0];
  },

  delete: async (id: number) => {
    const db = getConnection();
    await db.delete(reminders).where(eq(reminders.id, id));
  },

  deleteByAppointmentId: async (appointmentId: number) => {
    const db = getConnection();
    await db
      .delete(reminders)
      .where(eq(reminders.appointmentId, appointmentId));
  },
};