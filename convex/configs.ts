import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./auth";

export const createConfig = mutation({
  args: {
    websiteId: v.id("websites"),
    configData: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const timestamp = Date.now();
    
    // Verify website ownership
    const website = await ctx.db.get(args.websiteId);
    if (!website || website.userId !== userId) {
      throw new Error("Website not found or you don't have permission");
    }
    
    const config = await ctx.db.insert("configs", {
      websiteId: args.websiteId,
      userId,
      configData: args.configData,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    
    return config;
  },
});

export const updateConfig = mutation({
  args: {
    configId: v.id("configs"),
    configData: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    // Verify ownership
    const config = await ctx.db.get(args.configId);
    if (!config || config.userId !== userId) {
      throw new Error("Config not found or you don't have permission");
    }
    
    await ctx.db.patch(args.configId, {
      configData: args.configData,
      updatedAt: Date.now(),
    });
    
    return args.configId;
  },
});

export const getWebsiteConfigs = query({
  args: { websiteId: v.id("websites") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    // First verify website ownership
    const website = await ctx.db.get(args.websiteId);
    if (!website || website.userId !== userId) {
      return [];
    }
    
    const configs = await ctx.db
      .query("configs")
      .filter((q) => q.eq(q.field("websiteId"), args.websiteId))
      .collect();
    
    return configs;
  },
});

export const getConfigById = query({
  args: { configId: v.id("configs") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    const config = await ctx.db.get(args.configId);
    
    // Only return if this belongs to the user
    if (!config || config.userId !== userId) {
      return null;
    }
    
    return config;
  },
});
