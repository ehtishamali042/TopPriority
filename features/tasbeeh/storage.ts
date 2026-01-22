/**
 * Tasbeeh Storage Helpers
 * Uses AsyncStorage for persistent local storage
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Tasbeeh } from "./types";

const STORAGE_KEY = "@tasbeeh_list";

/**
 * Load all tasbeehs from storage
 */
export async function loadTasbeehs(): Promise<Tasbeeh[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue) as Tasbeeh[];
    }
    return [];
  } catch (error) {
    console.error("Error loading tasbeehs:", error);
    return [];
  }
}

/**
 * Save all tasbeehs to storage
 */
export async function saveTasbeehs(tasbeehs: Tasbeeh[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(tasbeehs);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving tasbeehs:", error);
    throw error;
  }
}

/**
 * Clear all tasbeehs from storage
 */
export async function clearTasbeehs(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing tasbeehs:", error);
    throw error;
  }
}

/**
 * Generate a unique ID for a new tasbeeh
 */
export function generateId(): string {
  return `tasbeeh_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
