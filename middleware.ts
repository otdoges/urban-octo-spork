import { clerkMiddleware } from "@clerk/nextjs/server";

// Simple implementation - will protect all routes
export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect all routes except root
    "/((?!_next|api|trpc|$).*)",
    // Also run for API routes
    "/api/(.*)",
    "/trpc/(.*)",
  ],
};
