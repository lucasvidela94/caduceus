/**
 * Interface for storage adapters
 * Defines the contract for any storage implementation
 */

export interface StorageAdapter {
  name: string;
  
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
  
  close(): Promise<void>;
}
