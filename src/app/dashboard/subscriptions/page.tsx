import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTierPriceId, subscriptionTiers, subscriptionTiersInOrder, TierNames } from '@/data/subTier'
import { getProductCount } from '@/server/db/products'
import { getUserSubTier } from '@/server/db/subscription'
import { auth } from '@clerk/nextjs/server'
import { Progress } from "@/components/ui/progress"
import { ConvertToK } from '@/lib/utils'
import { cancelSession, createCheckoutSession, createCustomerPortalSession, PaidTier } from '@/server/actions/stripe'
import { Button } from '@/components/ui/button'
import { BadgeCheck } from 'lucide-react'
import { ReactNode } from 'react'


const Subscriptions = async () => {
  const {userId, redirectToSignIn} = await auth()
  if(userId == null) return redirectToSignIn()
  const tier =  await getUserSubTier(userId)
  const productCount = await getProductCount(userId)
 
  return (
    <div className='sm:container sm:px-12 flex flex-col gap-4 mt-12'>
      <h1 className='px-4 text-2xl font-semibold'>Manage Subscriptions</h1>
    <Card>
      <CardHeader>
        <CardTitle> Product Limit </CardTitle>
        <CardDescription>{productCount}/{tier.maxNumberOfProducts} of number of products limit</CardDescription>
      </CardHeader>
      <CardContent>
      <Progress value={(productCount/tier.maxNumberOfProducts)*100} className='w-full cursor-pointer' />
      </CardContent>
    </Card>
    <Card className='p-6'>
      <CardTitle className='mt-4 mb-2 text-2xl font-semibold'>Subscriptions</CardTitle>
      <form action={
         createCustomerPortalSession
      }>
        <Button className='mb-4'>
          Manage Subscription
        </Button>
      </form>
      <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
      {subscriptionTiersInOrder.map((t)=>{
      return (
        <PricingCard key={t.name} tier={tier.name} properties={t}></PricingCard>
      )
    })}
        
      </CardContent>
    </Card>
    
    </div>
  )
}


function PricingCard({
  properties,
  tier,
}: {
  properties: {
    name: string;
    priceInCents: number;
    maxNumberOfProducts: number;
    maxNumberOfVisits: number;
    canAccessAnalytics: boolean;
    canCustomizeBanner: boolean;
    canRemoveBranding: boolean;
  };
  tier?: TierNames;
}) {
  return (
    <Card className="">
      <CardHeader className="flex flex-col gap-2">
        <div className="text-accent text-center font-semibold text-blue-500 text-xl">
          {properties.name}
        </div>
        <CardTitle className="text-center">
          {properties.priceInCents / 100 + "$/mo"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {ConvertToK(properties.maxNumberOfVisits)} visits a month
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">

        <form
        action={
          properties.name === 'Free' ? cancelSession :
         createCheckoutSession.bind(null,properties.name as PaidTier)
        }
>       
      
        <Button 
        
          className={`bg-black ${
            tier == properties.name && "bg-black/60"
          }  text-white w-full`}
        >
          {tier == properties.name ? "Current" : "Swap"}
        </Button>
        </form> 
      
        <Features>
          {properties.maxNumberOfProducts}{" "}
          {properties.maxNumberOfProducts > 1 ? "products" : "product"}
        </Features>
        {properties.canAccessAnalytics && (
          <Features>Access to Advanced Analytics</Features>
        )}
        {properties.canCustomizeBanner && (
          <Features>Customized Banner</Features>
        )}
        {properties.canRemoveBranding && (
          <Features>Feature to remove Branding</Features>
        )}
      </CardContent>
    </Card>
  );
}

function Features({ children }: { children: ReactNode }) {
  return (
    <div className=" flex flex-row gap-2">
      <BadgeCheck color="#5d8eee" />
      <p className="text-sm"> {children}</p>
    </div>
  );
}

export default Subscriptions