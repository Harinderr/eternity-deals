"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


const ViewsDaysChart = ({
    chartData 
}: {
    chartData? : {
        date : string,
        views : number,
        
    }[]
}) => {
  if (chartData == null || chartData === undefined) return (<h1>no data available</h1>)
  return (
    <Card className="mt-4">
        <CardHeader className="text-3xl font-semibold">Day Views History</CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] mx-auto w-1/3"
          >
            <BarChart accessibilityLayer data={chartData}>
          
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => chartData.length == 12 ? value.split("-").slice(0,2).join("-") :value.split("-").slice(2)}
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

export default ViewsDaysChart

  
  const chartConfig = {
    views: {
      label: "views",
      color: "#0352fc",
    },
  } satisfies ChartConfig;
  