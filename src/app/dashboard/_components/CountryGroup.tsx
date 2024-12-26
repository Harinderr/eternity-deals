
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { updateCountries, updateCountryGroups } from "@/lib/task"
import { getCountryGroup } from "@/server/db/products"
import { group } from "console"
import { useEffect } from "react"
import CountryGroupForm from "./CountryGroupForm"

const CountryGroup = async ({productId, userId}: {
   productId : string,
   userId : string
}) => {
   const countryGroup  = await getCountryGroup({productId,userId})
  return (
    <Card>
    
    <CardContent className="p-8 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Country Group Settings</h1>
     <p>Set discounts and coupens based on country groups and make your task easy.</p>
     <div className="">
     <CountryGroupForm productId={productId} countryGroup={countryGroup}></CountryGroupForm>
     </div>
    </CardContent>
  </Card>
  )
}

export default CountryGroup