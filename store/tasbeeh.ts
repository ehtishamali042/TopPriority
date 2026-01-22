/**
 * Tasbeeh Zustand Store
 */

import { generateId } from "@/services/async-storage.service";
import { tasbeehStorage } from "@/services/tasbeeh-storage.service";
import type { Tasbeeh, TasbeehInput, TasbeehUpdate } from "@/types/tasbeeh";
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
    const data = await tasbeehStorage.loadAll();
    set({ tasbeehs: data, loaded: true });
  },

  addTasbeeh: async (input: TasbeehInput) => {
    const now = new Date().toISOString();
    const newTasbeeh: Tasbeeh = {
      id: generateId("tasbeeh"),
      ...input,
      currentCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [...get().tasbeehs, newTasbeeh];
    set({ tasbeehs: updatedList });
    await tasbeehStorage.saveAll(updatedList);
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
    await tasbeehStorage.saveAll(updatedList);
    return updatedTasbeeh;
  },

  deleteTasbeeh: async (id: string) => {
    const { tasbeehs } = get();
    const updatedList = tasbeehs.filter((t) => t.id !== id);
    if (updatedList.length === tasbeehs.length) return false;

    set({ tasbeehs: updatedList });
    await tasbeehStorage.saveAll(updatedList);
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
