import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx } from "./_generated/server";

export function authKickback() {
  return null;
}

export async function getUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("You must be logged in to perform this action");
  }
  return {
    id: identity.subject,
    name: identity.name,
    email: identity.email,
    image: identity.pictureUrl,
  };
}

export async function getUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("You must be logged in to perform this action");
  }
  return identity.subject;
}
