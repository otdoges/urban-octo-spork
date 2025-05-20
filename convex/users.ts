import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId } from "./auth";

export const createUser = mutation({
  args: {
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    
    if (existingUser) {
      return existingUser._id;
    }
    
    // Create new user
    const timestamp = Date.now();
    const user = await ctx.db.insert("users", {
      userId,
      name: args.name,
      email: args.email,
      image: args.image,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    
    return user;
  },
});

export const getUser = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
    
    return user;
  },
});
