/**
 * Tasbeeh Zustand Store with Persist
 */

import { STORAGE_KEYS } from "@/constants/storage-keys";
import type { Tasbeeh, TasbeehInput, TasbeehUpdate } from "@/types/tasbeeh";
import { generateId } from "@/utils";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TasbeehState {
  tasbeehs: Tasbeeh[];

  // Actions
  addTasbeeh: (input: TasbeehInput) => Tasbeeh;
  updateTasbeeh: (id: string, updates: TasbeehUpdate) => Tasbeeh | null;
  deleteTasbeeh: (id: string) => boolean;
  incrementCount: (id: string) => Tasbeeh | null;
  resetCount: (id: string) => Tasbeeh | null;
  getTasbeeh: (id: string) => Tasbeeh | undefined;
}

export const useTasbeehStore = create<TasbeehState>()(
  persist(
    (set, get) => ({
      tasbeehs: [],

      addTasbeeh: (input: TasbeehInput) => {
        const now = new Date().toISOString();
        const newTasbeeh: Tasbeeh = {
          id: generateId("tasbeeh"),
          ...input,
          currentCount: 0,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({ tasbeehs: [...state.tasbeehs, newTasbeeh] }));
        return newTasbeeh;
      },

      updateTasbeeh: (id: string, updates: TasbeehUpdate) => {
        const { tasbeehs } = get();
        const index = tasbeehs.findIndex((t) => t.id === id);
        if (index === -1) return null;

        const updatedTasbeeh: Tasbeeh = {
          ...tasbeehs[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          tasbeehs: state.tasbeehs.map((t) =>
            t.id === id ? updatedTasbeeh : t,
          ),
        }));
        return updatedTasbeeh;
      },

      deleteTasbeeh: (id: string) => {
        const { tasbeehs } = get();
        if (!tasbeehs.some((t) => t.id === id)) return false;

        set((state) => ({
          tasbeehs: state.tasbeehs.filter((t) => t.id !== id),
        }));
        return true;
      },

      incrementCount: (id: string) => {
        const tasbeeh = get().tasbeehs.find((t) => t.id === id);
        if (!tasbeeh) return null;
        return get().updateTasbeeh(id, {
          currentCount: tasbeeh.currentCount + 1,
        });
      },

      resetCount: (id: string) => {
        return get().updateTasbeeh(id, { currentCount: 0 });
      },

      getTasbeeh: (id: string) => {
        return get().tasbeehs.find((t) => t.id === id);
      },
    }),
    {
      name: STORAGE_KEYS.TASBEEH,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
