import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTodos = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const addTodo = mutation({
  args: {
    text: v.string(),
    userId: v.string(),
    priority: v.optional(v.union(v.literal("none"), v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.string()),
    reminders: v.optional(v.array(v.object({
      datetime: v.string(),
      type: v.union(v.literal("notification"), v.literal("email"))
    }))),
    project: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("todos", {
      text: args.text,
      isCompleted: false,
      userId: args.userId,
      createdAt: Date.now(),
      priority: args.priority || "none",
      dueDate: args.dueDate,
      reminders: args.reminders || [],
      project: args.project || "Inbox",
    });
  },
});

export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    text: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("none"), v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.string()),
    reminders: v.optional(v.array(v.object({
      datetime: v.string(),
      type: v.union(v.literal("notification"), v.literal("email"))
    }))),
    project: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const todo = await ctx.db.get(id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    // Only update fields that are provided
    const updateData: any = {};
    if (updates.text !== undefined) updateData.text = updates.text;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.dueDate !== undefined) updateData.dueDate = updates.dueDate;
    if (updates.reminders !== undefined) updateData.reminders = updates.reminders;
    if (updates.project !== undefined) updateData.project = updates.project;

    await ctx.db.patch(id, updateData);
  },
});

export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    console.log("🔄 [BACKEND] Toggle todo mutation called with ID:", args.id);

    const todo = await ctx.db.get(args.id);
    if (!todo) {
      console.error("❌ [BACKEND] Todo not found with ID:", args.id);
      throw new Error("Todo not found");
    }

    console.log("📝 [BACKEND] Current todo state:", todo);
    console.log("🎯 [BACKEND] Current isCompleted:", todo.isCompleted);
    console.log("➡️ [BACKEND] Will change to:", !todo.isCompleted);

    await ctx.db.patch(args.id, { isCompleted: !todo.isCompleted });

    console.log("✅ [BACKEND] Todo toggled successfully");

    // Verify the change
    const updatedTodo = await ctx.db.get(args.id);
    console.log("🔍 [BACKEND] Updated todo state:", updatedTodo);
  },
});

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Advanced queries for filtering and analytics
export const getTodosByPriority = query({
  args: { userId: v.string(), priority: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("priority"), args.priority))
      .order("desc")
      .collect();
  },
});

export const getTodosByDueDate = query({
  args: { userId: v.string(), dueDate: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("dueDate"), args.dueDate))
      .order("desc")
      .collect();
  },
});

// Get todos with smart sorting (priority + due date + creation time)
export const getSmartSortedTodos = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Smart sorting algorithm
    return todos.sort((a, b) => {
      // First, sort by completion status (incomplete first)
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }

      // For incomplete todos, sort by priority
      if (!a.isCompleted && !b.isCompleted) {
        const priorityOrder = { "high": 3, "medium": 2, "low": 1, "none": 0 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;

        if (aPriority !== bPriority) {
          return bPriority - aPriority; // Higher priority first
        }

        // Then by due date (closer dates first)
        if (a.dueDate && b.dueDate) {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
          }
        } else if (a.dueDate && !b.dueDate) {
          return -1; // Items with due dates come first
        } else if (!a.dueDate && b.dueDate) {
          return 1;
        }
      }

      // Finally, sort by creation time (newer first)
      return b.createdAt - a.createdAt;
    });
  },
});

// Get productivity analytics
export const getProductivityStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const total = todos.length;
    const completed = todos.filter(t => t.isCompleted).length;
    const pending = total - completed;
    const highPriority = todos.filter(t => t.priority === "high").length;
    const mediumPriority = todos.filter(t => t.priority === "medium").length;
    const lowPriority = todos.filter(t => t.priority === "low").length;

    // Due date analysis
    const today = new Date().toISOString().split('T')[0];
    const overdue = todos.filter(t =>
      !t.isCompleted && t.dueDate && new Date(t.dueDate) < new Date(today)
    ).length;
    const dueToday = todos.filter(t =>
      !t.isCompleted && t.dueDate === today
    ).length;

    // Completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      completionRate,
      priority: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
        none: total - highPriority - mediumPriority - lowPriority
      },
      dueStatus: {
        overdue,
        dueToday,
        upcoming: pending - overdue - dueToday
      }
    };
  },
});

// Batch operations for better performance
export const batchUpdateTodos = mutation({
  args: {
    updates: v.array(v.object({
      id: v.id("todos"),
      isCompleted: v.optional(v.boolean()),
      priority: v.optional(v.union(v.literal("none"), v.literal("low"), v.literal("medium"), v.literal("high"))),
      dueDate: v.optional(v.string()),
      project: v.optional(v.string()),
    }))
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      const { id, ...data } = update;
      const todo = await ctx.db.get(id);
      if (todo) {
        const updateData: any = {};
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            updateData[key] = value;
          }
        });
        await ctx.db.patch(id, updateData);
      }
    }
  },
});