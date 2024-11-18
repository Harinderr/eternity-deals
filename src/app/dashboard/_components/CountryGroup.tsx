import { Card, CardContent, CardHeader } from "@/components/ui/card"


const CountryGroup = () => {
  return (
    <Card>
    
    <CardContent className="p-4">
        <h1 className="text-2xl font-bold">Country Group Settings</h1>
     <p>Set discounts and coupens based on country groups and make your task easy.</p>
     <div className="flex flex-row justify-around">
        <div className="flags w-1/2">Flags</div>
        <div className="">Discount</div>
        <div className="">Coupen</div>
     </div>
    </CardContent>
  </Card>
  )
}

export default CountryGroup