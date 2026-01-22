/**
 * Tasbeeh Counter Screen
 * Main counting interface for a tasbeeh
 */

import { useTasbeeh, useTasbeehActions } from "@/hooks/use-tasbeeh";
import { useThemeColor } from "@/hooks/use-theme-color";
import { PERIOD_LABELS } from "@/types/tasbeeh";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./styles";
import { calculateProgress, isTaskComplete } from "./utils";

export default function TasbeehCounterScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tasbeeh = useTasbeeh(id || "");
  const { incrementCount, resetCount } = useTasbeehActions();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");

  const handleIncrement = useCallback(async () => {
    if (!id) return;

    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await incrementCount(id);
  }, [id, incrementCount]);

  const handleReset = useCallback(async () => {
    if (!id) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await resetCount(id);
  }, [id, resetCount]);

  if (!tasbeeh) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: textColor }]}>
          Tasbeeh not found
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { borderColor: tintColor }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: tintColor }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progress = calculateProgress(tasbeeh.currentCount, tasbeeh.targetCount);
  const isComplete = isTaskComplete(tasbeeh.currentCount, tasbeeh.targetCount);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{tasbeeh.name}</Text>
        <Text style={[styles.periodBadge, { color: iconColor }]}>
          {PERIOD_LABELS[tasbeeh.period]}
        </Text>
      </View>

      {/* Arabic Text */}
      {tasbeeh.arabicText && (
        <View style={styles.arabicContainer}>
          <Text style={[styles.arabicText, { color: textColor }]}>
            {tasbeeh.arabicText}
          </Text>
        </View>
      )}

      {/* Translation */}
      {tasbeeh.translation && (
        <Text style={[styles.translation, { color: iconColor }]}>
          {tasbeeh.translation}
        </Text>
      )}

      {/* Main Counter Button */}
      <View style={styles.counterContainer}>
        <TouchableOpacity
          style={[
            styles.counterButton,
            {
              borderColor: isComplete ? "#4CAF50" : tintColor,
              backgroundColor: isComplete ? "#4CAF5015" : tintColor + "10",
            },
          ]}
          onPress={handleIncrement}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.counterText,
              { color: isComplete ? "#4CAF50" : tintColor },
            ]}
          >
            {tasbeeh.currentCount}
          </Text>
          <Text style={[styles.targetText, { color: iconColor }]}>
            of {tasbeeh.targetCount}
          </Text>
          {isComplete && <Text style={styles.completeText}>✓ Complete</Text>}
        </TouchableOpacity>

        <Text style={[styles.tapHint, { color: iconColor }]}>Tap to count</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[styles.progressBarBg, { backgroundColor: iconColor + "30" }]}
        >
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progress}%`,
                backgroundColor: isComplete ? "#4CAF50" : tintColor,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressPercent, { color: iconColor }]}>
          {progress}%
        </Text>
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={[styles.resetButton, { borderColor: iconColor + "50" }]}
        onPress={handleReset}
        activeOpacity={0.7}
      >
        <Text style={[styles.resetButtonText, { color: iconColor }]}>
          Reset Count
        </Text>
      </TouchableOpacity>
    </View>
  );
}
