/**
 * Tasbeeh Custom Hooks
 * Wrapper hooks around Zustand store for convenience
 */

import { useTasbeehStore } from "@/store/tasbeeh";
import { useEffect, useState } from "react";

/**
 * Hook to check if store has been hydrated from storage
 */
export function useTasbeehHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useTasbeehStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );

    setHydrated(useTasbeehStore.persist.hasHydrated());

    return () => {
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
}

/**
 * Hook to get all tasbeehs with hydration status
 */
export function useTasbeehs() {
  const tasbeehs = useTasbeehStore((state) => state.tasbeehs);
  const hydrated = useTasbeehHydration();
  return { tasbeehs, isReady: hydrated };
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
