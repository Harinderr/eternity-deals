"use server"

import { env as serverEnv } from "@/data/env/server";
import { env as clientEnv } from "@/data/env/client";
import { auth, currentUser, User } from "@clerk/nextjs/server";
import { error } from "console";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { getUserSubscription } from "../db/subscription";
import { subscriptionTiers, TierNames } from "@/data/subTier";
const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);
export type PaidTier  = Exclude<TierNames, "Free"> 

export async function cancelSession() {
  const user = await currentUser()
  if(user == null) return 
  const subscription = await getUserSubscription(user.id)
  if(subscription == null) return 
  if(subscription.stripeCustomerId == null || subscription.stripeSubscriptionId == null){
    return
  }
  const protalSession = await stripe.billingPortal.sessions.create({
    customer : subscription.stripeCustomerId,
    return_url :`${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscriptions`,
    flow_data : {
      type : 'subscription_cancel',
      subscription_cancel : {
        subscription : subscription.stripeSubscriptionId
      }
    }
  })
  redirect(protalSession.url)
}
export async function createCustomerPortalSession() {
  const {userId} = await auth()
  if(userId == null) return 
  const subscription = await getUserSubscription(userId)
  if(subscription?.stripeCustomerId == null) {
    return 
  }
  const protalSession  = await stripe.billingPortal.sessions.create({
    customer : subscription.stripeCustomerId,
    return_url : `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscriptions`

  })

  redirect(protalSession.url)
    
}

export async function createCheckoutSession(tier:PaidTier){
  const user = await currentUser();
  if (user == null) return ;
  const subscription = await getUserSubscription(user.id);
  if (subscription == null) return 
  if (subscription.stripeCustomerId == null) {
    const url = await getCheckoutSession(tier, user);
    if (url == null) {
      return 
    }
    
    redirect(url)
   } else {
      const url = await getUserSubscriptionUpgradeSession(tier, subscription);
 
      redirect(url);
    }
  
}
export async function getCheckoutSession(tier: PaidTier, user: User) {
  const session = await stripe.checkout.sessions.create({
    customer_email: user.primaryEmailAddress?.emailAddress,
    subscription_data: {
      metadata: {
        clerkUserId: user.id,
      },
    },
    line_items: [
      {
        price: subscriptionTiers[tier].stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscriptions`,
    cancel_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscriptions`,
  });
  return session.url;
}

export async function getUserSubscriptionUpgradeSession(
  tier: PaidTier,
  subscription: {
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripeSubscriptionItemId: string | null;
  }
) {
  if (
    subscription.stripeCustomerId == null ||
    subscription.stripeSubscriptionId == null ||
    subscription.stripeSubscriptionItemId == null
  ) {
    throw new Error();
  }
  console.log('this is tier',subscriptionTiers[tier].stripePriceId)
  const protalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${clientEnv.NEXT_PUBLIC_SERVER_URL}/dashboard/subscriptions`,
    flow_data: {
      type: "subscription_update_confirm",
      subscription_update_confirm: {
        subscription: subscription.stripeSubscriptionId,
        items: [
          {
            id: subscription.stripeSubscriptionItemId,
            price: subscriptionTiers[tier].stripePriceId,
            quantity: 1,
          },
        ],
      },
    },
  });
  return protalSession.url;
}
