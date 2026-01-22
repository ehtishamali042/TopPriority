/**
 * TasbeehListScreen Types
 */

import type { Tasbeeh } from "@/types/tasbeeh";

export interface TasbeehListScreenProps {
  // Add any screen-specific props here
}

export interface TasbeehCardProps {
  item: Tasbeeh;
  backgroundColor: string;
  textColor: string;
  tintColor: string;
  iconColor: string;
  onPress: (tasbeeh: Tasbeeh) => void;
  onLongPress: (tasbeeh: Tasbeeh) => void;
  onEdit: (tasbeeh: Tasbeeh) => void;
}

export interface ProgressInfo {
  progress: number;
  isComplete: boolean;
}
