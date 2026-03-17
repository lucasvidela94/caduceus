import * as path from "path";
import * as fs from "fs";
import { app } from "electron";
import * as crypto from "crypto";
import type { StorageAdapter } from "../interfaces/storage-adapter";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

class EncryptionService {
  private keyPath: string;

  constructor(basePath: string) {
    this.keyPath = path.join(basePath, "db.key");
  }

  private getOrCreateKey(): Buffer {
    if (fs.existsSync(this.keyPath)) {
      return fs.readFileSync(this.keyPath);
    }
    const key = crypto.randomBytes(KEY_LENGTH);
    fs.writeFileSync(this.keyPath, key);
    fs.chmodSync(this.keyPath, 0o600);
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

export class JsonStorageAdapter implements StorageAdapter {
  name = "json";
  private basePath: string;
  private encryption: EncryptionService;
  private data: Map<string, Map<string, any>> = new Map();

  constructor(options?: { basePath?: string }) {
    this.basePath = options?.basePath || path.join(app.getPath("userData"), "rxdb-data");
    this.encryption = new EncryptionService(this.basePath);
  }

  async initialize(): Promise<void> {
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
    await this.loadFromDisk();
    
    // Auto-save every 5 seconds
    setInterval(() => this.saveToDisk(), 5000);
  }

  private async loadFromDisk(): Promise<void> {
    try {
      const collections = ["patients", "appointments", "consultations", "settings"];
      
      for (const collection of collections) {
        const filePath = path.join(this.basePath, `${collection}.enc`);
        if (fs.existsSync(filePath)) {
          const encrypted = fs.readFileSync(filePath);
          const decrypted = this.encryption.decrypt(encrypted);
          const docs = JSON.parse(decrypted);
          this.data.set(collection, new Map(docs.map((d: any) => [d.id, d])));
        } else {
          this.data.set(collection, new Map());
        }
      }
    } catch (error) {
      console.error("Failed to load database:", error);
    }
  }

  private async saveToDisk(): Promise<void> {
    try {
      for (const [collection, docs] of this.data) {
        const filePath = path.join(this.basePath, `${collection}.enc`);
        const docsArray = Array.from(docs.values());
        const json = JSON.stringify(docsArray);
        const encrypted = this.encryption.encrypt(json);
        fs.writeFileSync(filePath, encrypted);
      }
    } catch (error) {
      console.error("Failed to save database:", error);
    }
  }

  async getAll(collection: string): Promise<any[]> {
    const docs = this.data.get(collection);
    return docs ? Array.from(docs.values()) : [];
  }

  async getById(collection: string, id: string): Promise<any | null> {
    const docs = this.data.get(collection);
    return docs?.get(id) || null;
  }

  async create(collection: string, data: any): Promise<any> {
    if (!this.data.has(collection)) {
      this.data.set(collection, new Map());
    }
    const docs = this.data.get(collection)!;
    docs.set(data.id, data);
    return data;
  }

  async update(collection: string, id: string, data: Partial<any>): Promise<any> {
    const docs = this.data.get(collection);
    if (!docs) throw new Error(`Collection ${collection} not found`);
    
    const existing = docs.get(id);
    if (!existing) throw new Error(`Document ${id} not found`);
    
    const updated = { ...existing, ...data };
    docs.set(id, updated);
    return updated;
  }

  async delete(collection: string, id: string): Promise<void> {
    const docs = this.data.get(collection);
    if (docs) {
      docs.delete(id);
    }
  }

  async query(collection: string, selector: any): Promise<any[]> {
    const docs = await this.getAll(collection);
    // Simple query implementation - can be extended
    return docs.filter(doc => {
      for (const [key, value] of Object.entries(selector)) {
        if (doc[key] !== value) return false;
      }
      return true;
    });
  }

  async export(): Promise<Record<string, any[]>> {
    const result: Record<string, any[]> = {};
    for (const [collection, docs] of this.data) {
      result[collection] = Array.from(docs.values());
    }
    return result;
  }

  async import(data: Record<string, any[]>): Promise<void> {
    for (const [collection, docs] of Object.entries(data)) {
      this.data.set(collection, new Map(docs.map(d => [d.id, d])));
    }
    await this.saveToDisk();
  }

  async close(): Promise<void> {
    await this.saveToDisk();
  }
}
