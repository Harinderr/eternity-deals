"use server";
import { formSchema } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { string, z } from "zod";
import { createProductInDb, deleteProductFromDB ,updateProductDb} from "../db/products";
import { redirect } from "next/navigation";
import { boolean } from "drizzle-orm/mysql-core";

export async function createProduct(
  formData: z.infer<typeof formSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = formSchema.safeParse(formData);
  if (!success || userId == null) {
    return { error: true, message: "Can't perform the action right now" };
  }
  const { id } = await createProductInDb({ ...formData, clerkUserId: userId });
  redirect(`/dashboard/products/${id}/edit?tab=countries`);
}
export async function updateProduct(
   id  : string,
  formData: z.infer<typeof formSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = formSchema.safeParse(formData);
  if (!success || userId == null) {
    return { error: true, message: "Can't perform the action right now" };
  }
  const isSuccess = await updateProductDb(formData,{id,userId} );
  if(isSuccess){
   redirect('/dashboard')
  }
  return {
   error: !isSuccess,
   message: isSuccess ? "Product details updated" : 'Error while updating product',
 }
 
}


export async function deleteProduct(productId: string) {
  const { userId } = await auth();
  if (userId == null) {
    return { error: true, message: "not Authenticated" };
  }

  const isSuccess = await deleteProductFromDB(productId, userId);
  return {
    error: !isSuccess,
    message: isSuccess ? "Successfully deleted" : "Unable to perform action",
  };
}
