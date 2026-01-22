/**
 * TasbeehEditScreen Utils
 */

import type { FormValidationResult, TasbeehFormState } from "./types";

/**
 * Validate the tasbeeh form
 */
export const validateForm = (form: TasbeehFormState): FormValidationResult => {
  if (!form.name.trim()) {
    return {
      isValid: false,
      errorMessage: "Please enter a name for the tasbeeh.",
    };
  }

  const count = parseInt(form.targetCount, 10);
  if (isNaN(count) || count <= 0) {
    return {
      isValid: false,
      errorMessage: "Target count must be a positive number.",
    };
  }

  return { isValid: true };
};

/**
 * Get input background color based on theme
 */
export const getInputBgColor = (backgroundColor: string): string => {
  return backgroundColor === "#fff" ? "#f5f5f5" : "#252728";
};
