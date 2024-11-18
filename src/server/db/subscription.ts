import { db } from "@/drizzle/db";
import { ProductTable, UserSubscriptionTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";


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