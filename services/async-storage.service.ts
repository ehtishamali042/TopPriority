/**
 * Generic AsyncStorage Service
 * A type-safe, reusable abstraction over AsyncStorage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Result type for storage operations
 */
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * Configuration for creating a storage instance
 */
export interface StorageConfig {
  keyPrefix?: string;
  enableLogging?: boolean;
}

/**
 * Generic AsyncStorage Service Class
 * Provides type-safe CRUD operations for any data type
 */
export class AsyncStorageService<T> {
  private storageKey: string;
  private enableLogging: boolean;

  constructor(storageKey: string, config?: StorageConfig) {
    const prefix = config?.keyPrefix ?? "@app";
    this.storageKey = `${prefix}_${storageKey}`;
    this.enableLogging = config?.enableLogging ?? false;
  }

  /**
   * Log helper for debugging
   */
  private log(message: string, ...args: unknown[]): void {
    if (this.enableLogging) {
      console.log(`[AsyncStorage:${this.storageKey}] ${message}`, ...args);
    }
  }

  /**
   * Get item from storage
   */
  async get(): Promise<StorageResult<T>> {
    try {
      const jsonValue = await AsyncStorage.getItem(this.storageKey);
      if (jsonValue !== null) {
        const data = JSON.parse(jsonValue) as T;
        this.log("Get successful", data);
        return { success: true, data };
      }
      this.log("Get returned null - no data found");
      return { success: true, data: undefined };
    } catch (error) {
      this.log("Get failed", error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Set item in storage
   */
  async set(value: T): Promise<StorageResult<void>> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(this.storageKey, jsonValue);
      this.log("Set successful", value);
      return { success: true };
    } catch (error) {
      this.log("Set failed", error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Remove item from storage
   */
  async remove(): Promise<StorageResult<void>> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
      this.log("Remove successful");
      return { success: true };
    } catch (error) {
      this.log("Remove failed", error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Check if item exists in storage
   */
  async exists(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(this.storageKey);
      return value !== null;
    } catch {
      return false;
    }
  }

  /**
   * Merge data with existing stored data (for objects)
   */
  async merge(value: Partial<T>): Promise<StorageResult<void>> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.mergeItem(this.storageKey, jsonValue);
      this.log("Merge successful", value);
      return { success: true };
    } catch (error) {
      this.log("Merge failed", error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Get the storage key
   */
  getStorageKey(): string {
    return this.storageKey;
  }
}

/**
 * Collection Storage Service for array-based data
 * Extends basic storage with collection-specific operations
 */
export class CollectionStorageService<T extends { id: string }> {
  private storage: AsyncStorageService<T[]>;
  private enableLogging: boolean;

  constructor(storageKey: string, config?: StorageConfig) {
    this.storage = new AsyncStorageService<T[]>(storageKey, config);
    this.enableLogging = config?.enableLogging ?? false;
  }

  /**
   * Log helper for debugging
   */
  private log(message: string, ...args: unknown[]): void {
    if (this.enableLogging) {
      console.log(
        `[CollectionStorage:${this.storage.getStorageKey()}] ${message}`,
        ...args,
      );
    }
  }

  /**
   * Get all items in collection
   */
  async getAll(): Promise<StorageResult<T[]>> {
    const result = await this.storage.get();
    if (result.success) {
      return { success: true, data: result.data ?? [] };
    }
    return result as StorageResult<T[]>;
  }

  /**
   * Get single item by ID
   */
  async getById(id: string): Promise<StorageResult<T | undefined>> {
    const result = await this.getAll();
    if (result.success && result.data) {
      const item = result.data.find((item) => item.id === id);
      return { success: true, data: item };
    }
    return { success: false, error: result.error };
  }

  /**
   * Add new item to collection
   */
  async add(item: T): Promise<StorageResult<T[]>> {
    const result = await this.getAll();
    if (result.success) {
      const items = result.data ?? [];
      const updatedItems = [...items, item];
      const saveResult = await this.storage.set(updatedItems);
      if (saveResult.success) {
        this.log("Added item", item);
        return { success: true, data: updatedItems };
      }
      return { success: false, error: saveResult.error };
    }
    return { success: false, error: result.error };
  }

  /**
   * Add multiple items to collection
   */
  async addMany(newItems: T[]): Promise<StorageResult<T[]>> {
    const result = await this.getAll();
    if (result.success) {
      const items = result.data ?? [];
      const updatedItems = [...items, ...newItems];
      const saveResult = await this.storage.set(updatedItems);
      if (saveResult.success) {
        this.log("Added multiple items", newItems.length);
        return { success: true, data: updatedItems };
      }
      return { success: false, error: saveResult.error };
    }
    return { success: false, error: result.error };
  }

  /**
   * Update item in collection by ID
   */
  async update(id: string, updates: Partial<T>): Promise<StorageResult<T[]>> {
    const result = await this.getAll();
    if (result.success) {
      const items = result.data ?? [];
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        return {
          success: false,
          error: new Error(`Item with id ${id} not found`),
        };
      }
      const updatedItems = [...items];
      updatedItems[index] = { ...updatedItems[index], ...updates };
      const saveResult = await this.storage.set(updatedItems);
      if (saveResult.success) {
        this.log("Updated item", id, updates);
        return { success: true, data: updatedItems };
      }
      return { success: false, error: saveResult.error };
    }
    return { success: false, error: result.error };
  }

  /**
   * Replace item in collection by ID
   */
  async replace(id: string, newItem: T): Promise<StorageResult<T[]>> {
    const result = await this.getAll();
    if (result.success) {
      const items = result.data ?? [];
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        return {
          success: false,
          error: new Error(`Item with id ${id} not found`),
        };
      }
      const updatedItems = [...items];
      updatedItems[index] = newItem;
      const saveResult = await this.storage.set(updatedItems);
      if (saveResult.success) {
        this.log("Replaced item", id);
        return { success: true, data: updatedItems };
      }
      return { success: false, error: saveResult.error };
    }
    return { success: false, error: result.error };
  }

  /**
   * Remove item from collection by ID
   */
  async remove(id: string): Promise<StorageResult<T[]>> {
    const result = await this.getAll();
    if (result.success) {
      const items = result.data ?? [];
      const updatedItems = items.filter((item) => item.id !== id);
      const saveResult = await this.storage.set(updatedItems);
      if (saveResult.success) {
        this.log("Removed item", id);
        return { success: true, data: updatedItems };
      }
      return { success: false, error: saveResult.error };
    }
    return { success: false, error: result.error };
  }

  /**
   * Remove multiple items from collection by IDs
   */
  async removeMany(ids: string[]): Promise<StorageResult<T[]>> {
    const result = await this.getAll();
    if (result.success) {
      const items = result.data ?? [];
      const idSet = new Set(ids);
      const updatedItems = items.filter((item) => !idSet.has(item.id));
      const saveResult = await this.storage.set(updatedItems);
      if (saveResult.success) {
        this.log("Removed multiple items", ids.length);
        return { success: true, data: updatedItems };
      }
      return { success: false, error: saveResult.error };
    }
    return { success: false, error: result.error };
  }

  /**
   * Clear all items in collection
   */
  async clear(): Promise<StorageResult<void>> {
    return this.storage.remove();
  }

  /**
   * Save all items (replace entire collection)
   */
  async saveAll(items: T[]): Promise<StorageResult<void>> {
    return this.storage.set(items);
  }

  /**
   * Get count of items in collection
   */
  async count(): Promise<number> {
    const result = await this.getAll();
    return result.success ? (result.data?.length ?? 0) : 0;
  }

  /**
   * Check if item exists by ID
   */
  async exists(id: string): Promise<boolean> {
    const result = await this.getById(id);
    return result.success && result.data !== undefined;
  }

  /**
   * Find items matching a predicate
   */
  async find(predicate: (item: T) => boolean): Promise<StorageResult<T[]>> {
    const result = await this.getAll();
    if (result.success && result.data) {
      const filtered = result.data.filter(predicate);
      return { success: true, data: filtered };
    }
    return { success: false, error: result.error };
  }

  /**
   * Find first item matching a predicate
   */
  async findOne(
    predicate: (item: T) => boolean,
  ): Promise<StorageResult<T | undefined>> {
    const result = await this.getAll();
    if (result.success && result.data) {
      const item = result.data.find(predicate);
      return { success: true, data: item };
    }
    return { success: false, error: result.error };
  }
}

/**
 * Factory function to create a simple key-value storage instance
 */
export function createStorage<T>(
  storageKey: string,
  config?: StorageConfig,
): AsyncStorageService<T> {
  return new AsyncStorageService<T>(storageKey, config);
}

/**
 * Factory function to create a collection storage instance
 */
export function createCollectionStorage<T extends { id: string }>(
  storageKey: string,
  config?: StorageConfig,
): CollectionStorageService<T> {
  return new CollectionStorageService<T>(storageKey, config);
}

/**
 * Utility to generate unique IDs
 */
export function generateId(prefix: string = "item"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Utility to get current timestamp in ISO format
 */
export function getTimestamp(): string {
  return new Date().toISOString();
}
