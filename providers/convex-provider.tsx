'use client';

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { PropsWithChildren } from "react";

// Initialize the Convex client
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export function ConvexProvider({ children }: PropsWithChildren) {
  const { getToken } = useAuth();
  
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
