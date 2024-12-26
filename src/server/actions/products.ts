"use server";
import { CountryGroupSchema, formSchema, ProductCustomizeSchema } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { string, z } from "zod";
import {
  createProductInDb,
  deleteProductFromDB,
  saveCustomiztionDataToDb,
  updateCountryGroupDiscountsDb,
  updateProductDb,
} from "../db/products";
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
  id: string,
  formData: z.infer<typeof formSchema>
): Promise<{ error: boolean; message: string } | undefined> {
  const { userId } = await auth();
  const { success, data } = formSchema.safeParse(formData);
  if (!success || userId == null) {
    return { error: true, message: "Can't perform the action right now" };
  }
  const isSuccess = await updateProductDb(formData, { id, userId });
  if (isSuccess) {
    redirect("/dashboard");
  }
  return {
    error: !isSuccess,
    message: isSuccess
      ? "Product details updated"
      : "Error while updating product",
  };
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

export async function updateCountryGroupDiscounts(
  productId: string,
  values: z.infer<typeof CountryGroupSchema>
) {
  
  const {userId} = await auth();
  const { success, data } = CountryGroupSchema.safeParse(values);
  if (!success || userId == null) {
    return {
      error: true,
      message: "Unable to Complete",
    };
  }
  const insertGroup: {
    countryGroupId: string;
    discountPercentage: number;
    coupon: string;
    productId: string;
  }[] = [];
  const deleteGroup: {
    countryGroupId: string;
  }[] = [];

  data.groups.forEach(i => {
    if(i.coupon != null && i.discountPercentage > 0  ){
        insertGroup.push({
          countryGroupId : i.id,
          discountPercentage : i.discountPercentage,
          coupon : i.coupon,
          productId : productId
        })
    }
    else {
      deleteGroup.push({
        countryGroupId : i.id
      })

    }
  })
  const res = await updateCountryGroupDiscountsDb(deleteGroup,insertGroup,{productId,userId})
 return {error : !res, message : 'Successfully saved'}
}
 
export async function saveCustomiztionData(formData : z.infer<typeof ProductCustomizeSchema>,productId:string) {
    const {userId} = await auth()
    const {success , data} =  ProductCustomizeSchema.safeParse(formData)
    if(userId == null) {
      return { error : true, message : 'either not authenticated' }
    }
    if( !success) {
      return { error : true, message : ' unexpected data' }
    }
   await saveCustomiztionDataToDb(userId,productId, formData)
  return {error : false , message : 'Banner data updated successfully'}
}