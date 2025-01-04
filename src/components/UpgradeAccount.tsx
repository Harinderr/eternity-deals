import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"


const UpgradeAccount = () => {
  return (
   <Card className="mt-8">
    <CardHeader>
        <CardTitle className="text-2xl">Upgrade Account</CardTitle>
        <CardDescription>Upgrade your account subscription to customize Banner informations. You are right now on Free tier.</CardDescription>
    </CardHeader>
    <CardContent className="">
        <Button>
          <Link href={'/#pricing'}>Upgrade Account</Link>
        </Button>
    </CardContent>
   </Card>
  )
}

export default UpgradeAccount