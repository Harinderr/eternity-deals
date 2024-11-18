import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { env } from "@/data/env/server";
import { createUserSubscription, deleteUserSubscription } from "@/server/db/subscription";

export async function POST(req: Request) {
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRAT);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  switch (evt.type) {
    case "user.created":
      {
        console.log('user creattion initiated')
        await createUserSubscription({
          clerkUserId: evt.data.id,
          tier: "Free",
        });
      }
      break;
    case "user.deleted": {
      if(evt.data.id != null) {
        console.log('user delete initiated')
        await deleteUserSubscription(evt.data.id)
      }
    }
    break;
  }
  //   // Do something with the payload
  //   // For this guide, you simply log the payload to the console
  //   const { id } = evt.data
  //   const eventType = evt.type
  //   console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  //   console.log('Webhook body:', body)

  return new Response("webhook called", { status: 200 });
}
