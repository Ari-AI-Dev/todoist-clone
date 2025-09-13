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
    const todo = await ctx.db.get(args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    await ctx.db.patch(args.id, { isCompleted: !todo.isCompleted });
  },
});

export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Additional queries for filtering
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