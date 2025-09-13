import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    userId: v.string(),
    createdAt: v.number(),
    // New fields for enhanced functionality
    priority: v.optional(v.union(v.literal("none"), v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.string()), // ISO date string
    reminders: v.optional(v.array(v.object({
      datetime: v.string(), // ISO datetime string
      type: v.union(v.literal("notification"), v.literal("email"))
    }))),
    project: v.optional(v.string()), // Project/inbox assignment
  }).index("by_user", ["userId"])
    .index("by_due_date", ["dueDate"])
    .index("by_priority", ["priority"]),
});