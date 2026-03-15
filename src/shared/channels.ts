export const IPC_CHANNELS = {
  GET_PATIENTS: "get-patients",
  ADD_PATIENT: "add-patient"
} as const;

type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];

export type { IpcChannel };
