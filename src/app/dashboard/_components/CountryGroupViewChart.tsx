

"use client";

import { Bar, BarChart, XAxis} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


const CountryGroupViewChart = ({
    countryGroupViewData 
}: {
    countryGroupViewData? : {
        views : string | null,
        countryGroup : string,
        
    }[]
}) => {
 
  if (countryGroupViewData == null || countryGroupViewData === undefined) return (<h1>no data available</h1>)
  return (
    <Card className="mt-4">
        <CardHeader className="text-3xl font-semibold">Day Views History</CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] mx-auto w-1/3"
          >
            <BarChart accessibilityLayer data={countryGroupViewData}>
          
              <XAxis
                dataKey="countryGroup"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.split(":")[1] }
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="views" fill="var(--color-views)" radius={4} />
              <ChartLegend content={<ChartLegendContent  nameKey='views'/>} />

            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
  )
}

export default CountryGroupViewChart

  
  const chartConfig = {
    views: {
      label: "views",
      color: "#0352fc",
    },
  } satisfies ChartConfig;
  