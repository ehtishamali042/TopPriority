/**
 * Tasbeeh Zustand Store
 */

import {
  generateId,
  loadTasbeehs,
  saveTasbeehs,
} from "@/features/tasbeeh/storage";
import type {
  Tasbeeh,
  TasbeehInput,
  TasbeehUpdate,
} from "@/features/tasbeeh/types";
import { create } from "zustand";

interface TasbeehState {
  tasbeehs: Tasbeeh[];
  loaded: boolean;

  // Actions
  loadFromStorage: () => Promise<void>;
  addTasbeeh: (input: TasbeehInput) => Promise<Tasbeeh>;
  updateTasbeeh: (
    id: string,
    updates: TasbeehUpdate,
  ) => Promise<Tasbeeh | null>;
  deleteTasbeeh: (id: string) => Promise<boolean>;
  incrementCount: (id: string) => Promise<Tasbeeh | null>;
  resetCount: (id: string) => Promise<Tasbeeh | null>;
  getTasbeeh: (id: string) => Tasbeeh | undefined;
}

export const useTasbeehStore = create<TasbeehState>((set, get) => ({
  tasbeehs: [],
  loaded: false,

  loadFromStorage: async () => {
    if (get().loaded) return;
    const data = await loadTasbeehs();
    set({ tasbeehs: data, loaded: true });
  },

  addTasbeeh: async (input: TasbeehInput) => {
    const now = new Date().toISOString();
    const newTasbeeh: Tasbeeh = {
      id: generateId(),
      ...input,
      currentCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [...get().tasbeehs, newTasbeeh];
    set({ tasbeehs: updatedList });
    await saveTasbeehs(updatedList);
    return newTasbeeh;
  },

  updateTasbeeh: async (id: string, updates: TasbeehUpdate) => {
    const { tasbeehs } = get();
    const index = tasbeehs.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updatedTasbeeh: Tasbeeh = {
      ...tasbeehs[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [...tasbeehs];
    updatedList[index] = updatedTasbeeh;
    set({ tasbeehs: updatedList });
    await saveTasbeehs(updatedList);
    return updatedTasbeeh;
  },

  deleteTasbeeh: async (id: string) => {
    const { tasbeehs } = get();
    const updatedList = tasbeehs.filter((t) => t.id !== id);
    if (updatedList.length === tasbeehs.length) return false;

    set({ tasbeehs: updatedList });
    await saveTasbeehs(updatedList);
    return true;
  },

  incrementCount: async (id: string) => {
    const tasbeeh = get().tasbeehs.find((t) => t.id === id);
    if (!tasbeeh) return null;
    return get().updateTasbeeh(id, { currentCount: tasbeeh.currentCount + 1 });
  },

  resetCount: async (id: string) => {
    return get().updateTasbeeh(id, { currentCount: 0 });
  },

  getTasbeeh: (id: string) => {
    return get().tasbeehs.find((t) => t.id === id);
  },
}));
