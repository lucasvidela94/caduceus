import { ipcMain } from "electron";
import { exposeIpcMainRxStorage } from "rxdb/plugins/electron";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import type { StorageAdapter } from "./interfaces/storage-adapter";
import { StorageFactory } from "./factory";

const STORAGE_KEY = "main-storage";

class StorageManager {
  private adapter: StorageAdapter;
  private memoryStorage: any;

  constructor() {
    // Configure storage type here
    // Can be changed via environment variable or config file
    const storageType = process.env.STORAGE_TYPE || "json";
    
    this.adapter = StorageFactory.create({
      type: storageType as any,
      options: {
        // Options for each adapter
        basePath: process.env.STORAGE_PATH,
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY,
        postgresUrl: process.env.DATABASE_URL,
      }
    });
    
    this.memoryStorage = getRxStorageMemory();
  }

  async initialize(): Promise<void> {
    await this.adapter.initialize();
    console.log(`Storage initialized: ${this.adapter.name}`);
  }

  getStorage() {
    return this.memoryStorage;
  }

  getAdapter(): StorageAdapter {
    return this.adapter;
  }
}

const storageManager = new StorageManager();

export const initializeStorage = async (): Promise<void> => {
  await storageManager.initialize();
};

export const exposeRxStorage = (): void => {
  exposeIpcMainRxStorage({
    key: STORAGE_KEY,
    storage: storageManager.getStorage(),
    ipcMain,
  });
  
  console.log("RxStorage exposed");
};

export { STORAGE_KEY, storageManager };
