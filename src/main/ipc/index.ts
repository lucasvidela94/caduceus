import { registerPatientHandlers } from "./handlers/patient-handlers";
import { registerBackupHandlers } from "./handlers/backup-handlers";
import { registerDataHandlers } from "./handlers/data-handlers";
import { registerAppointmentHandlers } from "./handlers/appointment-handlers";
import { registerConsultationHandlers } from "./handlers/consultation-handlers";
import { registerSettingsHandlers } from "./handlers/settings-handlers";
import { registerReminderHandlers } from "./handlers/reminder-handlers";

export const registerIpcHandlers = (): void => {
  registerPatientHandlers();
  registerBackupHandlers();
  registerDataHandlers();
  registerAppointmentHandlers();
  registerConsultationHandlers();
  registerSettingsHandlers();
  registerReminderHandlers();
};
