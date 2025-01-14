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

const CountryGroupViewChart = ({
  countryGroupViewData,
}: {
  countryGroupViewData?: {
    views: string | null;
    countryGroup: string;
  }[];
}) => {
  if (countryGroupViewData == null || countryGroupViewData === undefined)
    return <h1>no data available</h1>;
const data  = countryGroupViewData.map((val,i)=> {
    return {...val,views : val.views != null ? Number(val.views) : 0,}
})
  return (
    <Card className="mt-4">
      <CardHeader className="text-3xl font-semibold">Group Views History</CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] mx-auto w-2/3"
        >
          <BarChart accessibilityLayer data={data}>
            {/* Y-Axis to scale bar heights */}
            <YAxis
              dataKey="views"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`} // Format values, if necessary
            />

            {/* X-Axis for the groups */}
            <XAxis
              dataKey="countryGroup"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.split(" ")[2]}
            />

            {/* Tooltip and Legend */}
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="views" fill="var(--color-views)" radius={4} />
            <ChartLegend content={<ChartLegendContent nameKey="views" />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CountryGroupViewChart;

const chartConfig = {
  views: {
    label: "views",
    color: "#0352fc",
  },
} satisfies ChartConfig;
