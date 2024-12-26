'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const ProductLimit = () => {
  const router = useRouter()
  return (
    <Card className="mt-8">
    <CardHeader>
        <CardTitle className="text-2xl">Upgrade Subscription</CardTitle>
        <CardDescription>Max product limit reached for your tier, Upgrade subscription to create more Products</CardDescription>
    </CardHeader>
    <CardContent className="">
        <Button onClick={()=> router.push('/#pricing')}>Upgrade Account</Button>
    </CardContent>
   </Card>
  )
}

export default ProductLimit