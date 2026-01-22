/**
 * Tasbeeh Storage Service
 * Domain-specific storage service built on top of the generic AsyncStorage service
 */

import type {
  Tasbeeh,
  TasbeehInput,
  TasbeehPeriod,
  TasbeehUpdate,
} from "../features/tasbeeh/types";
import {
  CollectionStorageService,
  createCollectionStorage,
  generateId,
  getTimestamp,
  type StorageResult,
} from "./async-storage.service";

/**
 * Storage key for tasbeeh collection
 */
const TASBEEH_STORAGE_KEY = "tasbeeh_list";

/**
 * Storage configuration
 */
const STORAGE_CONFIG = {
  keyPrefix: "@tasbeeh",
  enableLogging: __DEV__, // Enable logging in development
};

/**
 * Tasbeeh Storage Service Class
 * Provides domain-specific methods for tasbeeh data management
 */
class TasbeehStorageService {
  private storage: CollectionStorageService<Tasbeeh>;

  constructor() {
    this.storage = createCollectionStorage<Tasbeeh>(
      TASBEEH_STORAGE_KEY,
      STORAGE_CONFIG,
    );
  }

  // ============================================
  // Basic CRUD Operations
  // ============================================

  /**
   * Load all tasbeehs from storage
   */
  async loadAll(): Promise<Tasbeeh[]> {
    const result = await this.storage.getAll();
    if (result.success) {
      return result.data ?? [];
    }
    console.error("Error loading tasbeehs:", result.error);
    return [];
  }

  /**
   * Get a single tasbeeh by ID
   */
  async getById(id: string): Promise<Tasbeeh | undefined> {
    const result = await this.storage.getById(id);
    if (result.success) {
      return result.data;
    }
    console.error("Error getting tasbeeh:", result.error);
    return undefined;
  }

  /**
   * Save all tasbeehs to storage (replaces entire collection)
   */
  async saveAll(tasbeehs: Tasbeeh[]): Promise<void> {
    const result = await this.storage.saveAll(tasbeehs);
    if (!result.success) {
      console.error("Error saving tasbeehs:", result.error);
      throw result.error;
    }
  }

  /**
   * Create a new tasbeeh
   */
  async create(input: TasbeehInput): Promise<StorageResult<Tasbeeh>> {
    const now = getTimestamp();
    const newTasbeeh: Tasbeeh = {
      id: generateId("tasbeeh"),
      name: input.name,
      arabicText: input.arabicText,
      translation: input.translation,
      targetCount: input.targetCount,
      period: input.period,
      currentCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.storage.add(newTasbeeh);
    if (result.success) {
      return { success: true, data: newTasbeeh };
    }
    return { success: false, error: result.error };
  }

  /**
   * Update an existing tasbeeh
   */
  async update(
    id: string,
    updates: TasbeehUpdate,
  ): Promise<StorageResult<Tasbeeh>> {
    const existing = await this.getById(id);
    if (!existing) {
      return {
        success: false,
        error: new Error(`Tasbeeh with id ${id} not found`),
      };
    }

    const updatedTasbeeh: Tasbeeh = {
      ...existing,
      ...updates,
      updatedAt: getTimestamp(),
    };

    const result = await this.storage.replace(id, updatedTasbeeh);
    if (result.success) {
      return { success: true, data: updatedTasbeeh };
    }
    return { success: false, error: result.error };
  }

  /**
   * Delete a tasbeeh by ID
   */
  async delete(id: string): Promise<StorageResult<void>> {
    const result = await this.storage.remove(id);
    if (result.success) {
      return { success: true };
    }
    return { success: false, error: result.error };
  }

  /**
   * Delete multiple tasbeehs
   */
  async deleteMany(ids: string[]): Promise<StorageResult<void>> {
    const result = await this.storage.removeMany(ids);
    if (result.success) {
      return { success: true };
    }
    return { success: false, error: result.error };
  }

  /**
   * Clear all tasbeehs from storage
   */
  async clear(): Promise<void> {
    const result = await this.storage.clear();
    if (!result.success) {
      console.error("Error clearing tasbeehs:", result.error);
      throw result.error;
    }
  }

  // ============================================
  // Domain-Specific Operations
  // ============================================

  /**
   * Increment the count of a tasbeeh
   */
  async incrementCount(
    id: string,
    amount: number = 1,
  ): Promise<StorageResult<Tasbeeh>> {
    const existing = await this.getById(id);
    if (!existing) {
      return {
        success: false,
        error: new Error(`Tasbeeh with id ${id} not found`),
      };
    }

    return this.update(id, {
      currentCount: existing.currentCount + amount,
    });
  }

  /**
   * Decrement the count of a tasbeeh
   */
  async decrementCount(
    id: string,
    amount: number = 1,
  ): Promise<StorageResult<Tasbeeh>> {
    const existing = await this.getById(id);
    if (!existing) {
      return {
        success: false,
        error: new Error(`Tasbeeh with id ${id} not found`),
      };
    }

    const newCount = Math.max(0, existing.currentCount - amount);
    return this.update(id, { currentCount: newCount });
  }

  /**
   * Reset the count of a tasbeeh to zero
   */
  async resetCount(id: string): Promise<StorageResult<Tasbeeh>> {
    return this.update(id, { currentCount: 0 });
  }

  /**
   * Reset counts for all tasbeehs
   */
  async resetAllCounts(): Promise<StorageResult<void>> {
    const tasbeehs = await this.loadAll();
    const now = getTimestamp();
    const resetTasbeehs = tasbeehs.map((t) => ({
      ...t,
      currentCount: 0,
      updatedAt: now,
    }));

    try {
      await this.saveAll(resetTasbeehs);
      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Get tasbeehs by period
   */
  async getByPeriod(period: TasbeehPeriod): Promise<Tasbeeh[]> {
    const result = await this.storage.find((t) => t.period === period);
    return result.success ? (result.data ?? []) : [];
  }

  /**
   * Get completed tasbeehs (current count >= target count)
   */
  async getCompleted(): Promise<Tasbeeh[]> {
    const result = await this.storage.find(
      (t) => t.currentCount >= t.targetCount,
    );
    return result.success ? (result.data ?? []) : [];
  }

  /**
   * Get incomplete tasbeehs (current count < target count)
   */
  async getIncomplete(): Promise<Tasbeeh[]> {
    const result = await this.storage.find(
      (t) => t.currentCount < t.targetCount,
    );
    return result.success ? (result.data ?? []) : [];
  }

  /**
   * Get total count of all tasbeehs
   */
  async getTotalCount(): Promise<number> {
    return this.storage.count();
  }

  /**
   * Check if a tasbeeh exists
   */
  async exists(id: string): Promise<boolean> {
    return this.storage.exists(id);
  }

  /**
   * Search tasbeehs by name (case-insensitive)
   */
  async searchByName(query: string): Promise<Tasbeeh[]> {
    const lowerQuery = query.toLowerCase();
    const result = await this.storage.find((t) =>
      t.name.toLowerCase().includes(lowerQuery),
    );
    return result.success ? (result.data ?? []) : [];
  }

  /**
   * Get progress percentage for a tasbeeh
   */
  getProgress(tasbeeh: Tasbeeh): number {
    if (tasbeeh.targetCount === 0) return 100;
    return Math.min(100, (tasbeeh.currentCount / tasbeeh.targetCount) * 100);
  }

  /**
   * Check if a tasbeeh is completed
   */
  isCompleted(tasbeeh: Tasbeeh): boolean {
    return tasbeeh.currentCount >= tasbeeh.targetCount;
  }
}

// ============================================
// Singleton Export
// ============================================

/**
 * Singleton instance of the tasbeeh storage service
 */
export const tasbeehStorage = new TasbeehStorageService();

/**
 * Export the class for testing or custom instances
 */
export { TasbeehStorageService };

// ============================================
// Legacy API Compatibility Layer
// ============================================

/**
 * Load all tasbeehs from storage (legacy compatibility)
 * @deprecated Use tasbeehStorage.loadAll() instead
 */
export async function loadTasbeehs(): Promise<Tasbeeh[]> {
  return tasbeehStorage.loadAll();
}

/**
 * Save all tasbeehs to storage (legacy compatibility)
 * @deprecated Use tasbeehStorage.saveAll() instead
 */
export async function saveTasbeehs(tasbeehs: Tasbeeh[]): Promise<void> {
  return tasbeehStorage.saveAll(tasbeehs);
}

/**
 * Clear all tasbeehs from storage (legacy compatibility)
 * @deprecated Use tasbeehStorage.clear() instead
 */
export async function clearTasbeehs(): Promise<void> {
  return tasbeehStorage.clear();
}

/**
 * Generate a unique ID for a new tasbeeh (legacy compatibility)
 * @deprecated Use generateId from async-storage.service instead
 */
export { generateId };
