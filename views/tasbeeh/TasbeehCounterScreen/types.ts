/**
 * TasbeehCounterScreen Types
 */

export interface TasbeehCounterScreenProps {
  // Add any screen-specific props here
}

export interface CounterDisplayProps {
  currentCount: number;
  targetCount: number;
  isComplete: boolean;
  tintColor: string;
  iconColor: string;
}
