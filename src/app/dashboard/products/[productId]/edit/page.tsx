import { auth } from "@clerk/nextjs/server";
import EditFormComponent from "@/app/dashboard/_components/EditFormComponent";
import { getProduct, getProudctCustomization } from "@/server/db/products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from "@/app/dashboard/_components/BackButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import CountryGroup from "@/app/dashboard/_components/CountryGroup";
import BannerCustomizeForm from "@/app/dashboard/_components/BannerCustomizeForm";
import { getUserSubTier } from "@/server/db/subscription";
import { ProductCustomizationTable, ProductTable } from "@/drizzle/schema";

export default async function EditProduct({
  params,
  searchParams : {tab = 'product'}
}: {
  params: { productId: string };
  searchParams : {tab?: string}
}) {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();
  if (params.productId == null) return;
  const product = await getProduct(params.productId, userId);
const productCustomization = await getProudctCustomization(userId, params.productId)
if(!productCustomization)  throw new Error('cant reach')
  return (
    <div className="mt-16 w-full px-4">
      <div className="flex flex-start flex-row gap-4 py-4">
        <BackButton></BackButton>
        <h1 className="sm:text-3xl text-xl font-semibold">Edit Product</h1>
      </div>
      <Tabs defaultValue={tab} className="">
        <TabsList className="grid h-12 w-full grid-cols-3">
          <TabsTrigger className="h-full" value="product"  >Product</TabsTrigger>
          <TabsTrigger className="h-full" value="country">Country</TabsTrigger>
          <TabsTrigger className="h-full" value="Banner">Others</TabsTrigger>
        </TabsList>
        <TabsContent value="product">
          <Card className="px-12 py-8">
            <CardHeader className="text-2xl font-bold">Product Info</CardHeader>
            <CardContent>
              <EditFormComponent product={product}></EditFormComponent>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="country">
        <CountryGroup productId={params.productId} userId={userId} ></CountryGroup>
        </TabsContent>
        <TabsContent value="Banner">
        <BannerCustomize userId={userId} productCustomization={productCustomization} ></BannerCustomize>
        </TabsContent>
      </Tabs>
    </div>
  );
}






async function BannerCustomize({userId,productCustomization}:{userId :string,
  productCustomization : {
    productId: string
    locationMessage: string
    backgroundColor: string
    textColor: string
    fontSize: string
    bannerContainer: string
    isSticky: boolean
    classPrefix: string | null}}){
  const subTier = await getUserSubTier(userId)
  if(subTier == null) return
return (
  <Card>
<CardHeader className="text-3xl font-semibold">Banner Customization</CardHeader>
<CardContent>
<BannerCustomizeForm subTier={subTier} productCustomization={productCustomization} ></BannerCustomizeForm>
</CardContent>
</Card>
)
} 