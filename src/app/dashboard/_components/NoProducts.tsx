import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NoProducts() {
    return (
        <div className="h-screen  w-full  flex justify-center items-center">
            <div className="wrapper flex flex-col gap-2">
        <h1 className="font-bold text-4xl">There are no Products Yet</h1>
        <p className="text-center">Create a product to use our Features</p>
          <Button asChild>
            <Link href="/dashboard/products/new">Create Product</Link>
           </Button>
            </div>
        </div>
    )
}