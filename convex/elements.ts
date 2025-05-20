import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./auth";

export const createElement = mutation({
  args: {
    websiteId: v.id("websites"),
    elementType: v.string(),
    elementData: v.any(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    // Verify website ownership
    const website = await ctx.db.get(args.websiteId);
    if (!website || website.userId !== userId) {
      throw new Error("Website not found or you don't have permission");
    }
    
    const element = await ctx.db.insert("elements", {
      websiteId: args.websiteId,
      userId,
      elementType: args.elementType,
      elementData: args.elementData,
      createdAt: Date.now(),
    });
    
    return element;
  },
});

export const getWebsiteElements = query({
  args: { 
    websiteId: v.id("websites"),
    elementType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    // First verify website ownership
    const website = await ctx.db.get(args.websiteId);
    if (!website || website.userId !== userId) {
      return [];
    }
    
    let elementsQuery = ctx.db
      .query("elements")
      .withIndex("by_website")
      .filter((q) => q.eq(q.field("websiteId"), args.websiteId));
      
    if (args.elementType) {
      elementsQuery = ctx.db
        .query("elements")
        .withIndex("by_website_and_type")
        .filter((q) => {
          // Ensure args.elementType is not undefined before using it
          const elementType = args.elementType as string;
          return q.eq(q.field("websiteId"), args.websiteId) && q.eq(q.field("elementType"), elementType);
        });
    }
    
    const elements = await elementsQuery.collect();
    return elements;
  },
});

export const deleteElement = mutation({
  args: { elementId: v.id("elements") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    // Verify ownership
    const element = await ctx.db.get(args.elementId);
    if (!element || element.userId !== userId) {
      throw new Error("Element not found or you don't have permission");
    }
    
    await ctx.db.delete(args.elementId);
    return true;
  },
});
