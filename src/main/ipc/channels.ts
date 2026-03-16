export const IPC_CHANNELS = {
  GET_PATIENTS: "get-patients",
  ADD_PATIENT: "add-patient",
  GET_PATIENT: "get-patient",
  UPDATE_PATIENT: "update-patient",
  DELETE_PATIENT: "delete-patient",
  SEARCH_PATIENTS: "search-patients",
  CREATE_BACKUP: "create-backup",
  LIST_BACKUPS: "list-backups",
  RESTORE_BACKUP: "restore-backup",
  EXPORT_JSON: "export-json",
  IMPORT_JSON: "import-json",
  EXPORT_CSV: "export-csv",
  CHECK_INTEGRITY: "check-integrity"
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
