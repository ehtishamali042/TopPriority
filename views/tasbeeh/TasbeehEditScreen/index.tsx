/**
 * Tasbeeh Edit Screen
 * Create or edit a tasbeeh entry
 */

import type { TasbeehInput, TasbeehPeriod } from "@/features/tasbeeh";
import {
  PERIOD_LABELS,
  useTasbeeh,
  useTasbeehActions,
} from "@/features/tasbeeh";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "./styles";
import { getInputBgColor, validateForm } from "./utils";

const PERIODS: TasbeehPeriod[] = ["daily", "weekly", "monthly"];

export default function TasbeehEditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existingTasbeeh = useTasbeeh(id ?? "");
  const { addTasbeeh, updateTasbeeh } = useTasbeehActions();

  const isEditing = !!id && !!existingTasbeeh;

  const [name, setName] = useState("");
  const [arabicText, setArabicText] = useState("");
  const [translation, setTranslation] = useState("");
  const [targetCount, setTargetCount] = useState("33");
  const [period, setPeriod] = useState<TasbeehPeriod>("daily");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");

  // Load existing tasbeeh data if editing
  useEffect(() => {
    if (existingTasbeeh) {
      setName(existingTasbeeh.name);
      setArabicText(existingTasbeeh.arabicText || "");
      setTranslation(existingTasbeeh.translation || "");
      setTargetCount(existingTasbeeh.targetCount.toString());
      setPeriod(existingTasbeeh.period);
    }
  }, [existingTasbeeh]);

  const handleSave = async () => {
    const validation = validateForm({
      name,
      arabicText,
      translation,
      targetCount,
      period,
    });

    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.errorMessage);
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const input: TasbeehInput = {
        name: name.trim(),
        arabicText: arabicText.trim() || undefined,
        translation: translation.trim() || undefined,
        targetCount: parseInt(targetCount, 10),
        period,
      };

      if (isEditing && id) {
        await updateTasbeeh(id, input);
      } else {
        await addTasbeeh(input);
      }

      router.back();
    } catch {
      Alert.alert("Error", "Failed to save tasbeeh. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBgColor = getInputBgColor(backgroundColor);
  const borderColor = iconColor + "40";

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: textColor }]}>Name *</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBgColor, color: textColor, borderColor },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="e.g., SubhanAllah"
            placeholderTextColor={iconColor}
            autoFocus={!isEditing}
          />
        </View>

        {/* Arabic Text Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: textColor }]}>Arabic Text</Text>
          <TextInput
            style={[
              styles.input,
              styles.arabicInput,
              { backgroundColor: inputBgColor, color: textColor, borderColor },
            ]}
            value={arabicText}
            onChangeText={setArabicText}
            placeholder="e.g., سُبْحَانَ ٱللَّٰهِ"
            placeholderTextColor={iconColor}
            textAlign="right"
          />
        </View>

        {/* Translation Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: textColor }]}>
            Translation / Description
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
              { backgroundColor: inputBgColor, color: textColor, borderColor },
            ]}
            value={translation}
            onChangeText={setTranslation}
            placeholder="e.g., Glory be to Allah"
            placeholderTextColor={iconColor}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Target Count Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: textColor }]}>
            Target Count *
          </Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBgColor, color: textColor, borderColor },
            ]}
            value={targetCount}
            onChangeText={setTargetCount}
            placeholder="33"
            placeholderTextColor={iconColor}
            keyboardType="number-pad"
          />
        </View>

        {/* Period Selector */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: textColor }]}>Period</Text>
          <View style={styles.periodContainer}>
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.periodButton,
                  { borderColor: period === p ? tintColor : borderColor },
                  period === p && { backgroundColor: tintColor + "20" },
                ]}
                onPress={() => setPeriod(p)}
              >
                <Text
                  style={[
                    styles.periodText,
                    { color: period === p ? tintColor : textColor },
                  ]}
                >
                  {PERIOD_LABELS[p]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: tintColor },
            isSubmitting && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Tasbeeh"
                : "Create Tasbeeh"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
