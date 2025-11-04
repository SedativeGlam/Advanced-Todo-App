import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";
import { Todo } from "../types/todo";
interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onPress: () => void;
  isLast: boolean;
  drag?: () => void;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onPress,
  isLast,
}: TodoItemProps) {
  const colors = useThemeColors();

  return (
    <Animated.View
      style={[
        styles.todoItem,
        {
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity style={styles.checkbox} onPress={onToggle}>
        {todo.completed ? (
          <LinearGradient
            colors={[colors.checkboxGradient1, colors.checkboxGradient2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkboxChecked}
          >
            <Text style={styles.checkmark}>✓</Text>
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.checkboxUnchecked,
              { borderColor: colors.checkboxBorder },
            ]}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.content} onPress={onPress}>
        <Text
          style={[
            styles.todoText,
            { color: colors.text },
            todo.completed && {
              color: colors.textCompleted,
            },
          ]}
        >
          {todo.title}
        </Text>
        {todo.description && (
          <Text
            style={[
              styles.description,
              { color: colors.textSecondary },
              todo.completed && { color: colors.textCompleted },
            ]}
            numberOfLines={1}
          >
            {todo.description}
          </Text>
        )}
        {todo.dueDate && (
          <Text style={[styles.dueDate, { color: colors.textSecondary }]}>
            📅 {new Date(todo.dueDate).toLocaleDateString()}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Text style={[styles.deleteIcon, { color: colors.textSecondary }]}>
          ✕
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  checkbox: {
    marginRight: 16,
  },
  checkboxUnchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 18,
  },
});
