import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { patients } from "./patients";

export const appointments = sqliteTable("appointments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  date: integer("date", { mode: "timestamp" }).notNull(),
  time: text("time").notNull(),
  duration: integer("duration").notNull().default(30),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;