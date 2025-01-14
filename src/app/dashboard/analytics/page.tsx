import { auth } from "@clerk/nextjs/server";
import {  getProducts } from "@/server/db/products";
import { CHART_INTERVALS, getCountryViewData, getProductCountryViewCount, getViewsByCountryGroup } from "@/server/db/productView";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import CountryViewsChart from "../_components/CountryViewsChart";
import ViewsDaysChart from "../_components/ViewsDaysChart";
import CountryGroupViewChart from "../_components/CountryGroupViewChart";

export default async function Analytics({
  searchParams,
}: {
  searchParams: {
    time?: keyof typeof CHART_INTERVALS;
    product?: string;
  };
}) {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();
  const products = await getProducts(userId);
  const time : keyof typeof CHART_INTERVALS  = searchParams.time ?? "last7Days";
  const product = searchParams.product ?? "Allproducts";
  const currentProduct = products.find((i) => i.name === product);
  const TimeInterval = ["last7Days", "last30Days", "last1Year"];
  const chartData = await getProductCountryViewCount(currentProduct?.id, time);
  const countryChartData = await getCountryViewData(currentProduct?.id,time,userId)
  const countryGroupViewData = await getViewsByCountryGroup(currentProduct?.id, userId)
  return (
    <div className="analytics_wrapper container mt-16">
      <h1 className="text-4xl bold">Analytics</h1>
      <div className="flex sm:flex-row flex-col  gap-4 my-8 ">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="bg-gray-100 flex flex-row justify-between gap-4 border-gray-900 p-4 rounded-lg">
              {searchParams.time ?? "last7Days"} <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            {TimeInterval.map((i) => {
              return (
                <DropdownMenuItem key={i} >
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
            <div className="bg-gray-100 flex flex-row gap-4 justify-between border-gray-900 p-4 rounded-lg">
              {searchParams.product ?? "All Products"}
              <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            {products.map((i) => {
              return (
                <DropdownMenuItem key={i.name} >
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
