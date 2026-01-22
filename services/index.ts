/**
 * Services Index
 * Export all services from a single entry point
 */

// Generic AsyncStorage Service
export {
  AsyncStorageService,
  CollectionStorageService,
  createCollectionStorage,
  createStorage,
  generateId,
  getTimestamp,
  type StorageConfig,
  type StorageResult,
} from "./async-storage.service";

// Tasbeeh Storage Service
export {
  clearTasbeehs,
  // Legacy exports
  loadTasbeehs,
  saveTasbeehs,
  tasbeehStorage,
  TasbeehStorageService,
} from "./tasbeeh-storage.service";
