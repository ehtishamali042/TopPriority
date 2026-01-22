/**
 * Tasbeeh Types
 */

export type TasbeehPeriod = "daily" | "weekly" | "monthly";

export interface Tasbeeh {
  id: string;
  name: string;
  arabicText?: string;
  translation?: string;
  targetCount: number;
  period: TasbeehPeriod;
  currentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TasbeehInput {
  name: string;
  arabicText?: string;
  translation?: string;
  targetCount: number;
  period: TasbeehPeriod;
}

export interface TasbeehUpdate extends Partial<TasbeehInput> {
  currentCount?: number;
}

export const PERIOD_LABELS: Record<TasbeehPeriod, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};
