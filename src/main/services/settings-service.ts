import { settingsRepository } from "../database/repositories/settings-repository";
import { SettingKey, SETTING_KEYS } from "../database/schema/settings";

export const settingsService = {
  getAll: async () => {
    const settings = await settingsRepository.getAllAsObject();
    const defaults = settingsRepository.getDefaults();
    
    // Merge con valores por defecto
    return {
      ...defaults,
      ...settings
    };
  },

  getByKey: async (key: string) => {
    return settingsRepository.getValue(key);
  },

  setValue: async (key: SettingKey, value: string) => {
    // Validar que la clave sea válida
    if (!Object.values(SETTING_KEYS).includes(key)) {
      throw new Error(`Clave de configuración inválida: ${key}`);
    }
    
    return settingsRepository.setValue(key, value);
  },

  updateMultiple: async (values: Partial<Record<SettingKey, string>>): Promise<unknown[]> => {
    const results: unknown[] = [];
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) {
        const result = await settingsRepository.setValue(key as SettingKey, value);
        results.push(result);
      }
    }
    return results;
  },

  // Obtener configuración para recetas
  getPrescriptionConfig: async () => {
    const allSettings = await settingsService.getAll();
    
    return {
      clinicName: allSettings[SETTING_KEYS.CLINIC_NAME],
      doctorName: allSettings[SETTING_KEYS.DOCTOR_NAME],
      doctorLicense: allSettings[SETTING_KEYS.DOCTOR_LICENSE],
      doctorSpecialty: allSettings[SETTING_KEYS.DOCTOR_SPECIALTY],
      clinicAddress: allSettings[SETTING_KEYS.CLINIC_ADDRESS],
      clinicPhone: allSettings[SETTING_KEYS.CLINIC_PHONE],
      clinicEmail: allSettings[SETTING_KEYS.CLINIC_EMAIL],
      clinicLogo: allSettings[SETTING_KEYS.CLINIC_LOGO],
    };
  },

  // Obtener horarios de trabajo
  getWorkingHours: async () => {
    const allSettings = await settingsService.getAll();
    
    return {
      start: allSettings[SETTING_KEYS.WORKING_HOURS_START],
      end: allSettings[SETTING_KEYS.WORKING_HOURS_END],
      appointmentDuration: parseInt(allSettings[SETTING_KEYS.APPOINTMENT_DURATION]) || 30,
    };
  },
};