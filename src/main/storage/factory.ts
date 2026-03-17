import type { StorageAdapter, StorageConfig } from "./interfaces/storage-adapter";
import { JsonStorageAdapter } from "./adapters/json-adapter";

export class StorageFactory {
  static create(config: StorageConfig): StorageAdapter {
    switch (config.type) {
      case "json":
        return new JsonStorageAdapter(config.options);
      case "memory":
        // TODO: Implement MemoryStorageAdapter for testing
        throw new Error("Memory adapter not yet implemented");
      case "supabase":
        // TODO: Implement SupabaseStorageAdapter
        throw new Error("Supabase adapter not yet implemented");
      case "postgres":
        // TODO: Implement PostgresStorageAdapter
        throw new Error("PostgreSQL adapter not yet implemented");
      default:
        throw new Error(`Unknown storage type: ${config.type}`);
    }
  }
}
