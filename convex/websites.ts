import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./auth";

export const createWebsite = mutation({
  args: {
    url: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const timestamp = Date.now();
    
    const website = await ctx.db.insert("websites", {
      userId,
      url: args.url,
      name: args.name,
      status: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    
    return website;
  },
});

export const updateWebsiteStatus = mutation({
  args: {
    websiteId: v.id("websites"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    // Verify ownership
    const website = await ctx.db.get(args.websiteId);
    if (!website || website.userId !== userId) {
      throw new Error("Website not found or you don't have permission");
    }
    
    await ctx.db.patch(args.websiteId, {
      status: args.status,
      updatedAt: Date.now(),
    });
    
    return args.websiteId;
  },
});

export const getUserWebsites = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    
    const websites = await ctx.db
      .query("websites")
      .withIndex("by_user")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();
    
    return websites;
  },
});

export const getWebsiteById = query({
  args: { websiteId: v.id("websites") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    const website = await ctx.db.get(args.websiteId);
    
    // Only return if this belongs to the user
    if (!website || website.userId !== userId) {
      return null;
    }
    
    return website;
  },
});
