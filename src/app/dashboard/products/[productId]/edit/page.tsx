import { auth } from "@clerk/nextjs/server";
import EditFormComponent from "@/app/dashboard/_components/EditFormComponent";
import { getProduct } from "@/server/db/products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from "@/app/dashboard/_components/BackButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import CountryGroup from "@/app/dashboard/_components/CountryGroup";

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

  return (
    <div className="mt-16 w-full px-12">
      <div className="flex flex-start flex-row gap-4 py-4">
        <BackButton></BackButton>
        <h1 className="text-3xl font-semibold">Edit Product</h1>
      </div>
      <Tabs defaultValue={tab} className="">
        <TabsList className="grid h-12 w-full grid-cols-3">
          <TabsTrigger className="h-full" value="product"  >Product</TabsTrigger>
          <TabsTrigger className="h-full" value="country">Country</TabsTrigger>
          <TabsTrigger className="h-full" value="others">Others</TabsTrigger>
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
        <CountryGroup></CountryGroup>
        </TabsContent>
        <TabsContent value="others">
        <Card>
            <CardHeader>Others</CardHeader>
            <CardContent>
             This is country info
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
