import { eq } from "drizzle-orm";
import { getConnection } from "../connection";
import { settings, NewSetting, SETTING_KEYS, SettingKey } from "../schema/settings";

export const settingsRepository = {
  getAll: async () => {
    const db = getConnection();
    return db.select().from(settings);
  },

  getByKey: async (key: string) => {
    const db = getConnection();
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);
    return result[0] || null;
  },

  getValue: async (key: string, defaultValue?: string): Promise<string | null> => {
    const setting = await settingsRepository.getByKey(key);
    return setting?.value ?? defaultValue ?? null;
  },

  setValue: async (key: SettingKey, value: string) => {
    const db = getConnection();
    const existing = await settingsRepository.getByKey(key);
    
    if (existing) {
      const result = await db
        .update(settings)
        .set({ value, updatedAt: new Date() })
        .where(eq(settings.key, key))
        .returning();
      return result[0];
    } else {
      const result = await db
        .insert(settings)
        .values({ key, value })
        .returning();
      return result[0];
    }
  },

  delete: async (key: string) => {
    const db = getConnection();
    await db.delete(settings).where(eq(settings.key, key));
  },

  // Obtener todas las configuraciones como un objeto
  getAllAsObject: async (): Promise<Record<string, string>> => {
    const allSettings = await settingsRepository.getAll();
    return allSettings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  },

  // Valores por defecto
  getDefaults: (): Record<SettingKey, string> => ({
    [SETTING_KEYS.CLINIC_NAME]: "Consultorio Médico",
    [SETTING_KEYS.DOCTOR_NAME]: "",
    [SETTING_KEYS.DOCTOR_LICENSE]: "",
    [SETTING_KEYS.DOCTOR_SPECIALTY]: "",
    [SETTING_KEYS.CLINIC_ADDRESS]: "",
    [SETTING_KEYS.CLINIC_PHONE]: "",
    [SETTING_KEYS.CLINIC_EMAIL]: "",
    [SETTING_KEYS.CLINIC_LOGO]: "",
    [SETTING_KEYS.WORKING_HOURS_START]: "09:00",
    [SETTING_KEYS.WORKING_HOURS_END]: "18:00",
    [SETTING_KEYS.APPOINTMENT_DURATION]: "30",
  }),
};