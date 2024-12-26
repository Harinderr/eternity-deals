import { auth } from "@clerk/nextjs/server";
import Navbar from "./_components/Navbar";
import { getProducts } from "@/server/db/products";
import NoProducts from "./_components/NoProducts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductList from "./_components/productsList";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";


export default async function DashBoard() {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();
  const products = await getProducts(userId);
  if (products.length === 0) return <NoProducts />;

  return (
    <div className="mt-20 mb-40 container px-36 flex flex-col gap-10 ">
        <div className="flex flex-row justify-between">
        <div className="flex justify-start gap-4">
            <Button className="rounded-full" size={'icon'}>
            <ChevronLeft className="font-bold" />
            </Button>
            <h1 className="font-bold text-3xl">My Products</h1>
        </div>
        <Button asChild>
        <Link className="flex flex-row justify-between items-center gap-2" href={"/dashboard/products/new"}>New Product <Plus className="font-bold"/> </Link>
        </Button>
        </div> 
        <div className="grid grid-cols-2 gap-4">
      {products.map((i) => {
        return (
         <ProductList key={i.id} value={i} ></ProductList>
        );
      })}
      </div>
    </div>
  );
}
