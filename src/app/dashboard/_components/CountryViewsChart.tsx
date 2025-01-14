'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"


const CountryViewsChart = ({countryChartData}:{
    countryChartData :{
        views : number,
        countryName : string,
        countryCode : string
    }[]
}) => {
   if(countryChartData == null) return <p>No Data Available</p>
   const data  = countryChartData.map((val,i)=> {
    return {...val,views : val.views != null ? Number(val.views) : 0,}
})
  return (
    <Card className="mt-4">
        <CardHeader className="text-3xl font-semibold">Country Views History</CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] mx-auto w-2/3"
          >
            <BarChart accessibilityLayer data={data}>
             <YAxis
                        dataKey="views"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`} // Format values, if necessary
                      />
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