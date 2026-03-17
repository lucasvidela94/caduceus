/**
 * Interface for storage adapters
 * Allows switching between different storage implementations
 * (JSON files, Supabase, PostgreSQL, etc.)
 */

export interface StorageAdapter {
  name: string;
  
  // Initialize the storage (connect to DB, create files, etc.)
  initialize(): Promise<void>;
  
  // Collection operations
  getAll(collection: string): Promise<any[]>;
  getById(collection: string, id: string): Promise<any | null>;
  create(collection: string, data: any): Promise<any>;
  update(collection: string, id: string, data: Partial<any>): Promise<any>;
  delete(collection: string, id: string): Promise<void>;
  query(collection: string, selector: any): Promise<any[]>;
  
  // Backup/restore
  export(): Promise<Record<string, any[]>>;
  import(data: Record<string, any[]>): Promise<void>;
  
  // Cleanup
  close(): Promise<void>;
}

export interface StorageConfig {
  type: "json" | "supabase" | "postgres" | "memory";
  options?: Record<string, any>;
}
