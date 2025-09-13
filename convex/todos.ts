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
  args: { text: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("todos", {
      text: args.text,
      isCompleted: false,
      userId: args.userId,
      createdAt: Date.now(),
    });
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