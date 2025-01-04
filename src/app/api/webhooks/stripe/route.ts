import { env } from "@/data/env/server";
import { getTierPriceId } from "@/data/subTier";
import { updateUserSubscription } from "@/server/db/subscription";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
export async function POST(request: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature") as string,
    env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case "customer.subscription.deleted": {
      await handleUserDeletion(event.data.object);
      break;
    }
    case "customer.subscription.updated": {
      await handleUserUpdation(event.data.object);
      break;
    }
    case "customer.subscription.created": {
      await handleUserCreation(event.data.object);
      break;
    }
  }
  return new Response(null, { status: 200 });
}

 async function handleUserCreation(
  subscriptionData: Stripe.Subscription
) {
  const tier = getTierPriceId(subscriptionData.items.data[0].price.id);

  const clerkUserId = subscriptionData.metadata.clerkUserId;
  if (clerkUserId == null || tier == null) {
    return new Response(null, { status: 500 });
  }
  const customer = subscriptionData.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;

 await updateUserSubscription(
    {
      stripeCustomerId: customerId,
      tier: tier.name,
      stripeSubscriptionId: subscriptionData.id,
      stripeSubscriptionItemId: subscriptionData.items.data[0].id,
    },
    clerkUserId,
    null
  );
  return new Response(null, {status : 200})
}
async function handleUserUpdation(
  subscriptionData: Stripe.Subscription
) {
  const tier = getTierPriceId(subscriptionData.items.data[0].price.id);
  const customer = subscriptionData.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;
  if (tier == null) {
    return new Response(null, { status: 500 });
  }
   await updateUserSubscription({ tier: tier.name }, null, customerId);
   return new Response(null, {status : 200})
}
 async function handleUserDeletion(
  subscriptionData: Stripe.Subscription
) {
  const customer = subscriptionData.customer;
  const customerId = typeof customer === "string" ? customer : customer.id;
   await updateUserSubscription(
    {
      tier: "Free",
      stripeSubscriptionId: null,
      stripeSubscriptionItemId: null,
    },
    null,
    customerId
  );
  return new Response(null, {status : 200})
}
