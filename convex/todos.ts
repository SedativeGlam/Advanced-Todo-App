import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all todos
export const getTodos = query({
  handler: async (ctx) => {
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_order")
      .order("asc")
      .collect();
    return todos;
  },
});

// Search todos
export const searchTodos = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, { searchQuery }) => {
    const todos = await ctx.db.query("todos").collect();

    if (!searchQuery) return todos;

    return todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },
});

// Create todo
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const todos = await ctx.db.query("todos").collect();
    const maxOrder =
      todos.length > 0 ? Math.max(...todos.map((t) => t.order)) : 0;

    const todoId = await ctx.db.insert("todos", {
      title: args.title,
      description: args.description,
      dueDate: args.dueDate,
      completed: false,
      order: maxOrder + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return todoId;
  },
});

// Update todo
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Toggle todo completion
export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, { id }) => {
    const todo = await ctx.db.get(id);
    if (!todo) throw new Error("Todo not found");

    await ctx.db.patch(id, {
      completed: !todo.completed,
      updatedAt: Date.now(),
    });
  },
});

// Delete todo
export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Update todo order (for drag and drop)
export const updateTodoOrder = mutation({
  args: {
    todoId: v.id("todos"),
    newOrder: v.number(),
  },
  handler: async (ctx, { todoId, newOrder }) => {
    await ctx.db.patch(todoId, {
      order: newOrder,
      updatedAt: Date.now(),
    });
  },
});

// Bulk update orders
export const updateTodoOrders = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("todos"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, { updates }) => {
    for (const update of updates) {
      await ctx.db.patch(update.id, {
        order: update.order,
        updatedAt: Date.now(),
      });
    }
  },
});

// Clear completed todos
export const clearCompleted = mutation({
  handler: async (ctx) => {
    const completedTodos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();

    for (const todo of completedTodos) {
      await ctx.db.delete(todo._id);
    }
  },
});
