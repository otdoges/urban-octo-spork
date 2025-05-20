import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // Websites table to store website conversion data
  websites: defineTable({
    userId: v.string(),
    url: v.string(),
    name: v.string(),
    status: v.string(), // "pending", "processing", "completed", "failed"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_user", ["userId"])
  .index("by_user_and_status", ["userId", "status"]),

  // Configurations table to store generated configurations
  configs: defineTable({
    websiteId: v.id("websites"),
    userId: v.string(),
    configData: v.any(), // JSON data of the configuration
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_website", ["websiteId"])
  .index("by_user", ["userId"]),

  // Elements table to store detected elements
  elements: defineTable({
    websiteId: v.id("websites"),
    userId: v.string(),
    elementType: v.string(), // "header", "footer", "nav", etc.
    elementData: v.any(), // JSON data of the element
    createdAt: v.number(),
  })
  .index("by_website", ["websiteId"])
  .index("by_website_and_type", ["websiteId", "elementType"])
  .index("by_user", ["userId"]),
});
