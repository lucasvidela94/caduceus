import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { patients } from "./patients";

export const consultations = sqliteTable("consultations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  patientId: integer("patient_id").notNull().references(() => patients.id),
  date: integer("date", { mode: "timestamp" }).notNull(),
  
  // Motivo y síntomas
  reason: text("reason").notNull(),
  symptoms: text("symptoms"),
  
  // Examen físico
  bloodPressure: text("blood_pressure"),
  heartRate: integer("heart_rate"),
  temperature: text("temperature"),
  weight: text("weight"),
  height: text("height"),
  physicalExam: text("physical_exam"),
  
  // Diagnóstico y tratamiento
  diagnosis: text("diagnosis").notNull(),
  treatment: text("treatment"),
  prescription: text("prescription"),
  
  // Estudios solicitados
  labRequested: integer("lab_requested", { mode: "boolean" }).default(false),
  rxRequested: integer("rx_requested", { mode: "boolean" }).default(false),
  ecgRequested: integer("ecg_requested", { mode: "boolean" }).default(false),
  ultrasoundRequested: integer("ultrasound_requested", { mode: "boolean" }).default(false),
  otherStudies: text("other_studies"),
  
  // Seguimiento
  nextAppointment: text("next_appointment"),
  notes: text("notes"),
  
  // Metadata
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

export type Consultation = typeof consultations.$inferSelect;
export type NewConsultation = typeof consultations.$inferInsert;