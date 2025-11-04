import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

interface EmptyStateProps {
  filter: "All" | "Active" | "Completed";
}

export function EmptyState({ filter }: EmptyStateProps) {
  const colors = useThemeColors();

  const getMessage = () => {
    switch (filter) {
      case "Active":
        return "No active todos!\nTake a break 🎉";
      case "Completed":
        return "No completed todos yet.\nGet started! 💪";
      default:
        return "No todos yet!\nCreate one to get started 🚀";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        {getMessage()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
