/**
 * Tasbeeh Custom Hooks
 * Wrapper hooks around Zustand store for convenience
 */

import { useTasbeehStore } from "@/store/tasbeeh";
import { useEffect } from "react";

/**
 * Hook to load tasbeehs from storage on app start
 */
export function useTasbeehLoader() {
  const tasbeehs = useTasbeehStore((state) => state.tasbeehs);
  const loaded = useTasbeehStore((state) => state.loaded);
  const loadFromStorage = useTasbeehStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return { tasbeehs, loaded };
}

/**
 * Hook to get all tasbeehs
 */
export function useTasbeehs() {
  const tasbeehs = useTasbeehStore((state) => state.tasbeehs);
  const loaded = useTasbeehStore((state) => state.loaded);
  return { tasbeehs, loaded };
}

/**
 * Hook to get a single tasbeeh by ID
 */
export function useTasbeeh(id: string) {
  return useTasbeehStore((state) => state.tasbeehs.find((t) => t.id === id));
}

/**
 * Hook for tasbeeh CRUD operations
 */
export function useTasbeehActions() {
  const addTasbeeh = useTasbeehStore((state) => state.addTasbeeh);
  const updateTasbeeh = useTasbeehStore((state) => state.updateTasbeeh);
  const deleteTasbeeh = useTasbeehStore((state) => state.deleteTasbeeh);
  const incrementCount = useTasbeehStore((state) => state.incrementCount);
  const resetCount = useTasbeehStore((state) => state.resetCount);

  return {
    addTasbeeh,
    updateTasbeeh,
    deleteTasbeeh,
    incrementCount,
    resetCount,
  };
}
