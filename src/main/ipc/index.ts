import { registerBackupHandlers } from "./handlers/backup-handlers";
import { registerDataHandlers } from "./handlers/data-handlers";

export const registerIpcHandlers = (): void => {
  registerBackupHandlers();
  registerDataHandlers();
};
