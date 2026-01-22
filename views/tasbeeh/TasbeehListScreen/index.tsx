/**
 * Tasbeeh List Screen
 * Displays all tasbeehs and allows navigation to counter/edit screens
 */

import { useTasbeehActions, useTasbeehs } from "@/hooks/use-tasbeeh";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Tasbeeh } from "@/types/tasbeeh";
import { PERIOD_LABELS } from "@/types/tasbeeh";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "./styles";
import { calculateProgressInfo, getCardBgColor } from "./utils";

export default function TasbeehListScreen() {
  const router = useRouter();
  const { tasbeehs, isReady } = useTasbeehs();
  const { deleteTasbeeh } = useTasbeehActions();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");

  const handlePress = (tasbeeh: Tasbeeh) => {
    router.push(`/(tasbeeh)/${tasbeeh.id}`);
  };

  const handleEdit = (tasbeeh: Tasbeeh) => {
    router.push(`/(tasbeeh)/edit?id=${tasbeeh.id}`);
  };

  const handleDelete = (tasbeeh: Tasbeeh) => {
    Alert.alert(
      "Delete Tasbeeh",
      `Are you sure you want to delete "${tasbeeh.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTasbeeh(tasbeeh.id),
        },
      ],
    );
  };

  const handleLongPress = (tasbeeh: Tasbeeh) => {
    Alert.alert(tasbeeh.name, "What would you like to do?", [
      { text: "Cancel", style: "cancel" },
      { text: "Edit", onPress: () => handleEdit(tasbeeh) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => handleDelete(tasbeeh),
      },
    ]);
  };

  const handleCreate = () => {
    router.push("/(tasbeeh)/edit");
  };

  const renderItem = ({ item }: { item: Tasbeeh }) => {
    const { progress, isComplete } = calculateProgressInfo(
      item.currentCount,
      item.targetCount,
    );

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: getCardBgColor(backgroundColor),
          },
        ]}
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={[styles.cardTitle, { color: textColor }]}>
              {item.name}
            </Text>
            {isComplete && <Text style={styles.completeBadge}>✓</Text>}
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.editIcon, { color: iconColor }]}>✎</Text>
          </TouchableOpacity>
        </View>

        {item.arabicText && (
          <Text style={[styles.arabicText, { color: textColor }]}>
            {item.arabicText}
          </Text>
        )}

        <View style={styles.cardFooter}>
          <Text style={[styles.periodText, { color: iconColor }]}>
            {PERIOD_LABELS[item.period]}
          </Text>
          <Text style={[styles.progressText, { color: tintColor }]}>
            {item.currentCount} / {item.targetCount}
          </Text>
        </View>

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
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: iconColor }]}>
        No tasbeehs yet
      </Text>
      <Text style={[styles.emptySubtext, { color: iconColor }]}>
        Tap the + button to create your first tasbeeh
      </Text>
    </View>
  );

  if (!isReady) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={tasbeehs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: tintColor }]}
        onPress={handleCreate}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
