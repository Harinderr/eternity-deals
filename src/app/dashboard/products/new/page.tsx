import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import FormComponent from "../../_components/FormComponent";
import Link from "next/link";
import BackButton from "../../_components/BackButton";
import { getUserSubTier } from "@/server/db/subscription";
import { auth } from "@clerk/nextjs/server";
import { getProductCount } from "@/server/db/products";
import ProductLimit from "../../_components/ProductLimit";

export default async function CreateNewProduct() {
    const {userId} =  await auth()
    if(userId == null) throw new Error('unauthorized access')
    const subTier = await getUserSubTier(userId)
    const productCount  = await getProductCount(userId)
    const productPersmission  =   productCount < subTier.maxNumberOfProducts
    console.log(productPersmission)
return (
    <div className="mt-20 sm:container flex flex-col gap-8 ">
        <div className=" flex justify-start gap-4 items-center">
         <BackButton></BackButton>
        <h1 className="sm:text-3xl text-xl font-bold"> Create Product</h1>
        </div>
      { productPersmission ?  <FormComponent formType="Create Product"/> : <ProductLimit/>}
    </div>
)
}