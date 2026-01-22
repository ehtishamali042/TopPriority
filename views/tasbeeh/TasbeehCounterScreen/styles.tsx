/**
 * TasbeehCounterScreen Styles
 */

import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const COUNTER_SIZE = Math.min(SCREEN_WIDTH * 0.7, 280);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  periodBadge: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  arabicContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  arabicText: {
    fontSize: 36,
    lineHeight: 52,
    textAlign: "center",
  },
  translation: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  counterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  counterButton: {
    width: COUNTER_SIZE,
    height: COUNTER_SIZE,
    borderRadius: COUNTER_SIZE / 2,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  counterText: {
    fontSize: 72,
    fontWeight: "200",
  },
  targetText: {
    fontSize: 18,
    marginTop: 4,
  },
  completeText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
    marginTop: 8,
  },
  tapHint: {
    marginTop: 16,
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 12,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "500",
    width: 45,
    textAlign: "right",
  },
  resetButton: {
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 30,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
