import { subscriptionTiers } from "@/data/subTier";
import { db } from "@/drizzle/db";
import { ProductTable, UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAGS, getUserTag, revalidateDbCache } from "@/lib/cache";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";


export async  function  createUserSubscription(data : typeof  UserSubscriptionTable.$inferInsert) {
     try { 
         return  await db.insert(UserSubscriptionTable).values(data).onConflictDoNothing({
        target : UserSubscriptionTable.clerkUserId
    })}
    catch(error) {
    console.log('there is error', error)
    }
}

export async function deleteUserSubscription(clerkUserId:string){

   
  await db.batch([
    db.delete(UserSubscriptionTable).where(eq(UserSubscriptionTable.clerkUserId,clerkUserId)),
    db.delete(ProductTable).where(eq(ProductTable.clerkUserId, clerkUserId))
   ])

}

export async function getUserSubscription(userId :string) {
    const cacheFc = cache(unstable_cache(getUserSubscriptionInternals,undefined,{
      tags : [getUserTag(userId, CACHE_TAGS.usersubscription)]
    }))
    return cacheFc(userId)
}

export async function getUserSubTier(userId:string){
  const sub = await getUserSubscription(userId)
  if (sub == null)  throw new Error('no valid subscription')
  return subscriptionTiers[sub.tier]
}

export async function getUserSubscriptionInternals(userId:string) {
  return db.query.UserSubscriptionTable.findFirst({
    where : ({clerkUserId},{eq})=> {
       return eq(clerkUserId,userId)
    }
  })
}

export async function updateUserSubscription( data : Partial<typeof UserSubscriptionTable.$inferInsert>, userId : string | null,stripeCustomerId: string | null){
  console.log('route hit')
  let out: { id: string; userId: string } | null = null;
if(userId != null){  
   [out] = await db.update(UserSubscriptionTable).set(data)
  .where(eq(UserSubscriptionTable.clerkUserId, userId))
  .returning({
    id : UserSubscriptionTable.id,
    userId : UserSubscriptionTable.clerkUserId
  })}
  if(stripeCustomerId!=null) {
    [out] = await db.update(UserSubscriptionTable).set(data)
  .where(eq(UserSubscriptionTable.stripeCustomerId, stripeCustomerId))
  .returning({
    id : UserSubscriptionTable.id,
    userId : UserSubscriptionTable.clerkUserId
  })
  }
  
if(out != null) {
  revalidateDbCache({
    tag : CACHE_TAGS.usersubscription,
    userId : out.userId,
    Id : out.id
  })
}
else {
  console.log('ther is error')
}

  

}