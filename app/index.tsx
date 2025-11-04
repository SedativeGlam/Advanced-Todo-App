import { useMutation, useQuery } from "convex/react";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { EmptyState } from "./components/EmptyState";
import { TodoItem } from "./components/TodoItem";
import { useTheme } from "./hooks/useTheme";
import { useThemeColors } from "./hooks/useThemeColors";
import { Todo } from "./types/todo";

export default function TodoScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();

  // Responsive logic
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [newTodo, setNewTodo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Completed">("All");

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalDueDate, setModalDueDate] = useState("");

  // Convex queries and mutations
  const todos = useQuery(api.todos.searchTodos, { searchQuery }) ?? [];
  const createTodo = useMutation(api.todos.createTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const clearCompleted = useMutation(api.todos.clearCompleted);

  const isLoading = todos === undefined;

  const headerImages = {
    light: require("../assets/images/header-bg-light.jpg"),
    dark: require("../assets/images/header-bg-dark.jpg"),
  };

  // Filter todos
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    switch (filter) {
      case "Active":
        filtered = todos.filter((todo) => !todo.completed);
        break;
      case "Completed":
        filtered = todos.filter((todo) => todo.completed);
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => a.order - b.order);
  }, [todos, filter]);

  const itemsLeft = todos.filter((todo) => !todo.completed).length;

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        await createTodo({
          title: newTodo.trim(),
        });
        setNewTodo("");
      } catch (error) {
        Alert.alert("Error", "Failed to create todo. Please try again.");
      }
    }
  };

  const handleToggleTodo = async (id: Id<"todos">) => {
    try {
      await toggleTodo({ id });
    } catch (error) {
      Alert.alert("Error", "Failed to update todo. Please try again.");
    }
  };

  const handleDeleteTodo = async (id: Id<"todos">) => {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTodo({ id });
          } catch (error) {
            Alert.alert("Error", "Failed to delete todo. Please try again.");
          }
        },
      },
    ]);
  };

  const handleClearCompleted = async () => {
    try {
      await clearCompleted();
    } catch (error) {
      Alert.alert("Error", "Failed to clear completed todos.");
    }
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setModalTitle(todo.title);
    setModalDescription(todo.description || "");
    setModalDueDate(todo.dueDate || "");
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingTodo(null);
    setModalTitle("");
    setModalDescription("");
    setModalDueDate("");
  };

  const handleSaveTodo = async () => {
    if (!modalTitle.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    try {
      if (editingTodo) {
        await updateTodo({
          id: editingTodo._id,
          title: modalTitle.trim(),
          description: modalDescription.trim() || undefined,
          dueDate: modalDueDate.trim() || undefined,
        });
      }
      closeModal();
    } catch (error) {
      Alert.alert("Error", "Failed to save todo. Please try again.");
    }
  };

  // Seed function
  const handleSeedData = async () => {
    const defaultTodos = [
      { title: "Complete online JavaScript course", completed: true },
      { title: "Jog around the park 3x", completed: false },
      { title: "10 minutes meditation", completed: false },
      { title: "Read for 1 hour", completed: false },
      { title: "Pick up groceries", completed: false },
      { title: "Complete Todo App on Frontend Mentor", completed: false },
    ];

    try {
      const createdIds = [];
      for (const todo of defaultTodos) {
        const id = await createTodo({
          title: todo.title,
        });
        createdIds.push(id);
      }

      if (createdIds[0]) {
        await toggleTodo({ id: createdIds[0] });
      }

      Alert.alert("Success", "Sample todos loaded!");
    } catch (error) {
      Alert.alert("Error", "Failed to load sample data");
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={theme === "light" ? "light-content" : "light-content"}
      />

      <ImageBackground
        source={headerImages[theme]}
        style={styles.header}
        resizeMode="cover"
      >
        <View style={styles.headerOverlay}>
          <View
            style={[
              styles.headerContent,
              isMobile && styles.headerContentMobile,
            ]}
          >
            <Text style={styles.headerTitle}>TODO</Text>
            <TouchableOpacity
              onPress={toggleTheme}
              accessibilityLabel="Toggle theme"
            >
              <Text style={styles.themeIcon}>
                {theme === "light" ? "☾" : "☀"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Main Content */}
      <View style={[styles.content, isMobile && styles.contentMobile]}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.cardBackground,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View
            style={[
              styles.checkboxPlaceholder,
              { borderColor: colors.checkboxBorder },
            ]}
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Create a new todo..."
            placeholderTextColor={colors.inputPlaceholder}
            value={newTodo}
            onChangeText={setNewTodo}
            onSubmitEditing={handleAddTodo}
            returnKeyType="done"
          />
        </View>

        {/* Seed Button*/}
        {todos.length === 0 && !isLoading && (
          <TouchableOpacity
            style={[
              styles.seedButton,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.shadow,
              },
            ]}
            onPress={handleSeedData}
          >
            <Text style={styles.seedButtonText}>📝 Load Sample Todos</Text>
          </TouchableOpacity>
        )}

        {/* Todo List */}
        <View
          style={[
            styles.todoListContainer,
            {
              backgroundColor: colors.cardBackground,
              shadowColor: colors.shadow,
            },
          ]}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text
                style={[styles.loadingText, { color: colors.textSecondary }]}
              >
                Loading todos...
              </Text>
            </View>
          ) : filteredTodos.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <ScrollView style={styles.todoList}>
              {filteredTodos.map((todo, index) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onToggle={() => handleToggleTodo(todo._id)}
                  onDelete={() => handleDeleteTodo(todo._id)}
                  onPress={() => openEditModal(todo)}
                  isLast={index === filteredTodos.length - 1}
                />
              ))}
            </ScrollView>
          )}

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              {itemsLeft} {itemsLeft === 1 ? "item" : "items"} left
            </Text>

            {/* Desktop Filter*/}
            {!isMobile && (
              <View style={styles.filterContainerDesktop}>
                {(["All", "Active", "Completed"] as const).map((filterType) => (
                  <TouchableOpacity
                    key={filterType}
                    onPress={() => setFilter(filterType)}
                    style={styles.filterButton}
                    accessibilityLabel={`Filter ${filterType}`}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        { color: colors.textSecondary },
                        filter === filterType && { color: colors.primary },
                      ]}
                    >
                      {filterType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity onPress={handleClearCompleted}>
              <Text
                style={[styles.footerText, { color: colors.textSecondary }]}
              >
                Clear Completed
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mobile Filter*/}
        {isMobile && (
          <View
            style={[
              styles.filterContainerMobile,
              {
                backgroundColor: colors.cardBackground,
                shadowColor: colors.shadow,
              },
            ]}
          >
            {(["All", "Active", "Completed"] as const).map((filterType) => (
              <TouchableOpacity
                key={filterType}
                onPress={() => setFilter(filterType)}
                style={styles.filterButton}
                accessibilityLabel={`Filter ${filterType}`}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: colors.textSecondary },
                    filter === filterType && { color: colors.primary },
                  ]}
                >
                  {filterType}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[styles.dragHint, { color: colors.textSecondary }]}>
          Drag and drop to reorder list
        </Text>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Edit Todo
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text
                  style={[styles.closeButton, { color: colors.textSecondary }]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.modalInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Title *"
              placeholderTextColor={colors.textSecondary}
              value={modalTitle}
              onChangeText={setModalTitle}
            />

            <TextInput
              style={[
                styles.modalInput,
                styles.modalTextArea,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Description"
              placeholderTextColor={colors.textSecondary}
              value={modalDescription}
              onChangeText={setModalDescription}
              multiline
              numberOfLines={4}
            />

            <TextInput
              style={[
                styles.modalInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Due Date (YYYY-MM-DD)"
              placeholderTextColor={colors.textSecondary}
              value={modalDueDate}
              onChangeText={setModalDueDate}
            />

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSaveTodo}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 300,
    width: "100%",
  },
  headerOverlay: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 50,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    maxWidth: 540,
    width: "100%",
    alignSelf: "center",
  },
  headerContentMobile: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 15,
  },
  themeIcon: {
    fontSize: 26,
    color: "#ffffff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -150,
    maxWidth: 540,
    width: "100%",
    alignSelf: "center",
  },
  contentMobile: {
    paddingHorizontal: 20,
    width: "100%",
    marginTop: -150,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 5,
  },
  checkboxPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 20,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "400",
  },
  seedButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  seedButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  todoListContainer: {
    borderRadius: 5,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 5,
    overflow: "hidden",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  todoList: {
    maxHeight: 400,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "400",
  },
  // Desktop filter
  filterContainerDesktop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  // Mobile filter
  filterContainerMobile: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 5,
    marginTop: 16,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 5,
    gap: 18,
  },
  filterButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  dragHint: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 49,
    fontWeight: "400",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxWidth: 500,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 24,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
