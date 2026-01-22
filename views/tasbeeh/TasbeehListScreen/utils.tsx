/**
 * TasbeehListScreen Utils
 */

import type { ProgressInfo } from "./types";

/**
 * Calculate progress information for a tasbeeh
 */
export const calculateProgressInfo = (
  currentCount: number,
  targetCount: number,
): ProgressInfo => {
  const progress =
    targetCount > 0
      ? Math.min(100, Math.round((currentCount / targetCount) * 100))
      : 0;
  const isComplete = currentCount >= targetCount;

  return { progress, isComplete };
};

/**
 * Get card background color based on theme
 */
export const getCardBgColor = (backgroundColor: string): string => {
  return backgroundColor === "#fff" ? "#f8f9fa" : "#252728";
};
