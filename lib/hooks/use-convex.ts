'use client';

import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

// Temporary API type solution until our schema is properly generated
const api: any = {};

export function useCurrentUser() {
  const { user } = useUser();
  // Temporarily disable actual query until our schema is generated
  // const convexUser = useQuery(api.users.getUser);
  const convexUser = null;
  
  return {
    user,
    convexUser,
  };
}

export function useWebsites() {
  // Temporarily return mock data until our schema is generated
  // const websites = useQuery(api.websites.getUserWebsites);
  // const createWebsite = useMutation(api.websites.createWebsite);
  // const updateWebsiteStatus = useMutation(api.websites.updateWebsiteStatus);
  
  const mockWebsites = [
    {
      _id: "mockId1" as Id<"websites">,
      userId: "user123",
      name: "Example Site",
      url: "https://example.com",
      status: "completed",
      createdAt: Date.now() - 1000000,
      updatedAt: Date.now() - 500000
    }
  ];
  
  return {
    websites: mockWebsites,
    createWebsite: async () => "mockId" as Id<"websites">,
    updateWebsiteStatus: async () => "mockId" as Id<"websites">
  };
}

export function useWebsiteConfigs(websiteId: Id<"websites"> | null) {
  // Temporarily return mock data until our schema is generated
  // const configs = websiteId ? useQuery(api.configs.getWebsiteConfigs, { websiteId }) : null;
  // const createConfig = useMutation(api.configs.createConfig);
  // const updateConfig = useMutation(api.configs.updateConfig);
  
  return {
    configs: [],
    createConfig: async () => "mockId" as Id<"configs">,
    updateConfig: async () => "mockId" as Id<"configs">,
  };
}

export function useWebsiteElements(websiteId: Id<"websites"> | null, elementType?: string) {
  // Temporarily return mock data until our schema is generated
  // const elements = websiteId ? 
  //   useQuery(api.elements.getWebsiteElements, { 
  //     websiteId, 
  //     elementType: elementType ? elementType : undefined 
  //   }) : null;
  // const createElement = useMutation(api.elements.createElement);
  // const deleteElement = useMutation(api.elements.deleteElement);
  
  return {
    elements: [],
    createElement: async () => "mockId" as Id<"elements">,
    deleteElement: async () => true,
  };
}
