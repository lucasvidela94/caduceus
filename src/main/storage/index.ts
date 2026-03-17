import { ipcMain } from "electron";
import { exposeIpcMainRxStorage } from "rxdb/plugins/electron";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { JsonStorageAdapter } from "./adapters/json-adapter";

const STORAGE_KEY = "main-storage";

// Simple storage setup - using JSON files with encryption
const storageAdapter = new JsonStorageAdapter();

export const initializeStorage = async (): Promise<void> => {
  await storageAdapter.initialize();
  console.log("Storage initialized: JSON with AES-256 encryption");
};

export const exposeRxStorage = (): void => {
  exposeIpcMainRxStorage({
    key: STORAGE_KEY,
    storage: getRxStorageMemory(),
    ipcMain,
  });
  
  console.log("RxStorage exposed");
};

export { STORAGE_KEY, storageAdapter };
