import { ipcMain } from "electron";
import { exposeIpcMainRxStorage } from "rxdb/plugins/electron";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import * as path from "path";
import * as fs from "fs";
import { app } from "electron";

const STORAGE_KEY = "main-storage";
const DB_DIR = "rxdb-data";
const DB_FILE = "database.json";

// Memory storage with JSON persistence
class PersistentMemoryStorage {
  private memoryStorage: any;
  private dbPath: string;
  private data: Map<string, any> = new Map();

  constructor() {
    this.dbPath = path.join(app.getPath("userData"), DB_DIR);
    this.memoryStorage = getRxStorageMemory();
    this.loadFromDisk();
    
    // Auto-save every 5 seconds
    setInterval(() => this.saveToDisk(), 5000);
  }

  private loadFromDisk(): void {
    try {
      const filePath = path.join(this.dbPath, DB_FILE);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(content);
        this.data = new Map(Object.entries(parsed));
        console.log("Database loaded from disk");
      }
    } catch (error) {
      console.error("Failed to load database:", error);
    }
  }

  private saveToDisk(): void {
    try {
      if (!fs.existsSync(this.dbPath)) {
        fs.mkdirSync(this.dbPath, { recursive: true });
      }
      const filePath = path.join(this.dbPath, DB_FILE);
      const obj = Object.fromEntries(this.data);
      fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
    } catch (error) {
      console.error("Failed to save database:", error);
    }
  }

  getStorage() {
    return this.memoryStorage;
  }
}

const persistentStorage = new PersistentMemoryStorage();

export const exposeRxStorage = (): void => {
  exposeIpcMainRxStorage({
    key: STORAGE_KEY,
    storage: persistentStorage.getStorage(),
    ipcMain,
  });
  
  console.log("RxStorage exposed with JSON persistence");
};

export { STORAGE_KEY };
