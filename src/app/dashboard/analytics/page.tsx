import { auth } from "@clerk/nextjs/server";
import { getProduct, getProducts } from "@/server/db/products";
import { getCountryViewData, getProductCountryViewCount, getViewsByCountryGroup } from "@/server/db/productView";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { notFound } from "next/navigation";
import CountryViewsChart from "../_components/CountryViewsChart";
import ViewsDaysChart from "../_components/ViewsDaysChart";
import CountryGroupViewChart from "../_components/CountryGroupViewChart";

export default async function Analytics({
  searchParams,
}: {
  searchParams: {
    time?: string;
    product?: string;
  };
}) {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();
  const products = await getProducts(userId);
  const time : any = searchParams.time ?? "last7days";
  const product = searchParams.product ?? "Allproducts";
  const currentProduct = products.find((i) => i.name === product);
  const TimeInterval = ["last7Days", "last30Days", "last1Year"];
  const chartData = await getProductCountryViewCount(currentProduct?.id, time);
  const countryChartData = await getCountryViewData(currentProduct?.id,time,userId)
  const countryGroupViewData = await getViewsByCountryGroup(currentProduct?.id, userId)
  return (
    <div className="analytics_wrapper container mt-16">
      <h1 className="text-4xl bold">Analytics</h1>
      <div className="flex flex-row gap-4 my-8 ">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="bg-gray-200 flex flex-row gap-4 border-gray-900 p-4 rounded-lg">
              {searchParams.time ?? "last7Days"} <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            {TimeInterval.map((i) => {
              return (
                <DropdownMenuItem>
                  <Link
                    href={`/dashboard/analytics?product=${product}&time=${i}`}
                  >
                    {i}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="bg-gray-200 flex flex-row gap-4 border-gray-900 p-4 rounded-lg">
              {searchParams.product ?? "All Products"}
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            {products.map((i) => {
              return (
                <DropdownMenuItem>
                  <Link
                    href={`/dashboard/analytics?product=${i.name}&time=${time}`}
                  >
                    {i.name}
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuItem>
            
                  <Link
                    href={`/dashboard/analytics?product=Allproducts&time=${time}`}
                  >
                    Allproducts
                  </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm">Get the info about views of your website.</p>
      <ViewsDaysChart chartData={chartData}></ViewsDaysChart>
      <CountryViewsChart countryChartData={countryChartData}></CountryViewsChart>
      <CountryGroupViewChart countryGroupViewData={countryGroupViewData}></CountryGroupViewChart>
    </div>
  );
}
