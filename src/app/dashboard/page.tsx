import { auth } from "@clerk/nextjs/server";
import { getProducts } from "@/server/db/products";
import NoProducts from "./_components/NoProducts";
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
    <div className="mt-20 mb-40 container px-4 sm:px-10 md:px-36 flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center">
        <div className="flex justify-start gap-4 items-center">
          <Button className="rounded-full" size={"icon"}>
            <ChevronLeft className="font-bold" />
          </Button>
          <h1 className="font-bold text-2xl sm:text-3xl">My Products</h1>
        </div>
        <Button asChild>
          <Link
            className="flex flex-row justify-between items-center gap-2"
            href={"/dashboard/products/new"}
          >
            New Product <Plus className="font-bold" />
          </Link>
        </Button>
      </div>

      {/* Products Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
        {products.map((product) => (
          <ProductList key={product.id} value={product} />
        ))}
      </div>
    </div>
  );
}
