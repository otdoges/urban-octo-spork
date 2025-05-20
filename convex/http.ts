import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { v } from "convex/values";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";

const http = httpRouter();

// Handle Clerk webhooks
http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

    // Get the headers
    const svix_id = request.headers.get("svix-id") || "";
    const svix_timestamp = request.headers.get("svix-timestamp") || "";
    const svix_signature = request.headers.get("svix-signature") || "";

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error: Missing svix headers", { status: 400 });
    }

    // Get the body
    const body = await request.text();
    
    // Verify the payload with the headers
    let event: WebhookEvent;
    try {
      event = webhook.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error verifying webhook", { status: 400 });
    }

    // Handle the webhook
    const eventType = event.type;
    
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, image_url, first_name, last_name } = event.data;
      
      const email = email_addresses && email_addresses[0]?.email_address;
      const name = [first_name, last_name].filter(Boolean).join(" ");
      
      // Log the user event instead of trying to directly insert
      // HTTP handlers don't have direct database access
      console.log("User event received:", { id, email, name });
    }

    return new Response("Success", { status: 200 });
  }),
});

export default http;
