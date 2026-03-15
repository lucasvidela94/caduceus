import { registerPatientHandlers } from "./handlers/patient-handlers";
import { registerBackupHandlers } from "./handlers/backup-handlers";
import { registerDataHandlers } from "./handlers/data-handlers";

export const registerIpcHandlers = (): void => {
  registerPatientHandlers();
  registerBackupHandlers();
  registerDataHandlers();
};
