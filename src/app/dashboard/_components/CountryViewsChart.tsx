'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis } from "recharts"


const CountryViewsChart = ({countryChartData}:{
    countryChartData :{
        views : number,
        countryName : string,
        countryCode : string
    }[]
}) => {
   
  return (
    <Card className="mt-4">
        <CardHeader className="text-3xl font-semibold">Country Views History</CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] mx-auto w-1/3"
          >
            <BarChart accessibilityLayer data={countryChartData}>
          
              <XAxis
                dataKey="countryName"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0,3)}/>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="views" fill="var(--color-views)" radius={4} />
              <ChartLegend content={<ChartLegendContent  nameKey='countryName'/>} />

            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
  )
}

export default CountryViewsChart
  
  const chartConfig = {
    views: {
      label: "views",
      color: "#0352fc",
    },
  } satisfies ChartConfig;