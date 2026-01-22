/**
 * TasbeehEditScreen Types
 */

import type { TasbeehPeriod } from "@/features/tasbeeh";

export interface TasbeehEditScreenProps {
  // Add any screen-specific props here
}

export interface TasbeehFormState {
  name: string;
  arabicText: string;
  translation: string;
  targetCount: string;
  period: TasbeehPeriod;
}

export interface FormValidationResult {
  isValid: boolean;
  errorMessage?: string;
}
