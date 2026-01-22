/**
 * TasbeehCounterScreen Utils
 */

/**
 * Calculate progress percentage
 */
export const calculateProgress = (
  currentCount: number,
  targetCount: number,
): number => {
  if (targetCount <= 0) return 0;
  return Math.min(100, Math.round((currentCount / targetCount) * 100));
};

/**
 * Check if tasbeeh is complete
 */
export const isTaskComplete = (
  currentCount: number,
  targetCount: number,
): boolean => {
  return currentCount >= targetCount;
};
