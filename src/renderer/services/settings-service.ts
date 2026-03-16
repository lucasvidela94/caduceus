import { getRxDatabase } from "@/database/database";

export const settingsService = {
  async getAll() {
    const db = await getRxDatabase();
    const settings = await db.settings.find().exec();
    const result: Record<string, string> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }
    return { ...settingsService.getDefaults(), ...result };
  },

  async getByKey(key: string): Promise<string | null> {
    const db = await getRxDatabase();
    const setting = await db.settings.findOne(key).exec();
    return setting?.value ?? null;
  },

  async setValue(key: string, value: string) {
    const db = await getRxDatabase();
    const existing = await db.settings.findOne(key).exec();
    if (existing) {
      await existing.update({
        $set: { value, updatedAt: Date.now() },
      });
      return existing;
    }
    return db.settings.insert({
      key,
      value,
      updatedAt: Date.now(),
    });
  },

  async updateMultiple(values: Record<string, string>): Promise<unknown[]> {
    const results: unknown[] = [];
    for (const [key, value] of Object.entries(values)) {
      const result = await settingsService.setValue(key, value);
      results.push(result);
    }
    return results;
  },

  getDefaults(): Record<string, string> {
    return {
      clinic_name: "Consultorio Médico",
      doctor_name: "",
      doctor_license: "",
      doctor_specialty: "",
      clinic_address: "",
      clinic_phone: "",
      clinic_email: "",
      clinic_logo: "",
      working_hours_start: "09:00",
      working_hours_end: "18:00",
      appointment_duration: "30",
    };
  },

  async getPrescriptionConfig() {
    const all = await settingsService.getAll();
    return {
      clinicName: all.clinic_name,
      doctorName: all.doctor_name,
      doctorLicense: all.doctor_license,
      doctorSpecialty: all.doctor_specialty,
      clinicAddress: all.clinic_address,
      clinicPhone: all.clinic_phone,
      clinicEmail: all.clinic_email,
      clinicLogo: all.clinic_logo,
    };
  },

  async getWorkingHours() {
    const all = await settingsService.getAll();
    return {
      start: all.working_hours_start,
      end: all.working_hours_end,
      appointmentDuration: parseInt(all.appointment_duration, 10) || 30,
    };
  },
};
