import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

// Claves de configuración permitidas
export const SETTING_KEYS = {
  CLINIC_NAME: "clinic_name",
  DOCTOR_NAME: "doctor_name",
  DOCTOR_LICENSE: "doctor_license",
  DOCTOR_SPECIALTY: "doctor_specialty",
  CLINIC_ADDRESS: "clinic_address",
  CLINIC_PHONE: "clinic_phone",
  CLINIC_EMAIL: "clinic_email",
  CLINIC_LOGO: "clinic_logo",
  WORKING_HOURS_START: "working_hours_start",
  WORKING_HOURS_END: "working_hours_end",
  APPOINTMENT_DURATION: "appointment_duration",
} as const;

export type SettingKey = typeof SETTING_KEYS[keyof typeof SETTING_KEYS];