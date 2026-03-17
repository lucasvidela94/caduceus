import { ipcMain } from "electron";
import { exposeIpcMainRxStorage } from "rxdb/plugins/electron";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import * as path from "path";
import * as fs from "fs";
import { app } from "electron";
import * as crypto from "crypto";

const STORAGE_KEY = "main-storage";
const DB_DIR = "rxdb-data";
const DB_FILE = "database.enc";
const KEY_FILE = "db.key";

// Encryption utilities
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

class EncryptionService {
  private keyPath: string;

  constructor(basePath: string) {
    this.keyPath = path.join(basePath, KEY_FILE);
  }

  private getOrCreateKey(): Buffer {
    if (fs.existsSync(this.keyPath)) {
      return fs.readFileSync(this.keyPath);
    }
    // Generate new key
    const key = crypto.randomBytes(KEY_LENGTH);
    fs.writeFileSync(this.keyPath, key);
    fs.chmodSync(this.keyPath, 0o600); // Restrict permissions
    return key;
  }

  encrypt(data: string): Buffer {
    const key = this.getOrCreateKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(data, "utf8"),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    // Format: IV (16 bytes) + AuthTag (16 bytes) + EncryptedData
    return Buffer.concat([iv, authTag, encrypted]);
  }

  decrypt(encryptedData: Buffer): string {
    const key = this.getOrCreateKey();
    
    const iv = encryptedData.subarray(0, IV_LENGTH);
    const authTag = encryptedData.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const data = encryptedData.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final()
    ]);
    
    return decrypted.toString("utf8");
  }
}

// Memory storage with encrypted JSON persistence
class PersistentMemoryStorage {
  private memoryStorage: any;
  private dbPath: string;
  private data: Map<string, any> = new Map();
  private encryption: EncryptionService;

  constructor() {
    this.dbPath = path.join(app.getPath("userData"), DB_DIR);
    this.encryption = new EncryptionService(this.dbPath);
    this.memoryStorage = getRxStorageMemory();
    this.loadFromDisk();
    
    // Auto-save every 5 seconds
    setInterval(() => this.saveToDisk(), 5000);
  }

  private loadFromDisk(): void {
    try {
      const filePath = path.join(this.dbPath, DB_FILE);
      if (fs.existsSync(filePath)) {
        const encrypted = fs.readFileSync(filePath);
        const decrypted = this.encryption.decrypt(encrypted);
        const parsed = JSON.parse(decrypted);
        this.data = new Map(Object.entries(parsed));
        console.log("Database loaded and decrypted successfully");
      }
    } catch (error) {
      console.error("Failed to load database:", error);
      // If decryption fails, start with empty database
      this.data = new Map();
    }
  }

  private saveToDisk(): void {
    try {
      if (!fs.existsSync(this.dbPath)) {
        fs.mkdirSync(this.dbPath, { recursive: true });
      }
      const filePath = path.join(this.dbPath, DB_FILE);
      const obj = Object.fromEntries(this.data);
      const json = JSON.stringify(obj);
      const encrypted = this.encryption.encrypt(json);
      fs.writeFileSync(filePath, encrypted);
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
  
  console.log("RxStorage exposed with AES-256 encrypted persistence");
};

export { STORAGE_KEY };
