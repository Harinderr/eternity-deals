import Image from "next/image";
import NavBar from "./_components/Navbar";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, CheckIcon } from "lucide-react";
import { NeonIcon } from "./icons/Neon";
import Link from "next/link";
import { ClerkIcon } from "./icons/Clerk";
import { subscriptionTiersInOrder } from "@/data/subTier";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConvertToK } from "@/lib/utils";
import { ReactNode } from "react";
import Logo from "@/components/Logo";
import {  cancelSession, createCheckoutSession, PaidTier } from "@/server/actions/stripe";
import { auth } from "@clerk/nextjs/server";
import { getUserSubTier } from "@/server/db/subscription";
import { subtle } from "crypto";

export default async function Home() {
  const {userId,redirectToSignIn} = await auth()
  if(userId == null) return redirectToSignIn()
    const subTier = await getUserSubTier(userId)
  return (
    <>
      <section className=" h-fit bg-gradient-to-t from-indigo-500  min-h-screen px-10 text-center pt-44">
        <div className="container  flex flex-col gap-5">
          <h1 className="text-5xl tracking-tighter  lg:text-6xl xl:text-7xl font-bold">
            Price Smarter, Sell bigger!
          </h1>
          <p className="text-lg">
            {" "}
            Optimize your product pricing across countries to maximize sales.
            Capture 85% of the untapped market with location-based dynamic
            pricing
          </p>
          <SignUpButton>
            <Button className="bg-black text-white  w-full">
              Get Started for free <ArrowRight />{" "}
            </Button>
          </SignUpButton>
        </div>
      </section>
      <section className="bg-black flex flex-col gap-8 text-white p-8 min-h-screen">
        <div className="container">
          <h1 className="text-3xl lg:text-3xl xl:text-4xl text-center pt-8 font-bold">
            Trusted by all the Modern Companies
          </h1>
        </div>
        <div className="icons_wrapper container grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          <Link href={"#"}>
            <NeonIcon></NeonIcon>
          </Link>
          <Link href={"#"}>
            <ClerkIcon></ClerkIcon>
          </Link>
          <Link href={"#"}>
            <NeonIcon></NeonIcon>
          </Link>
          <Link href={"#"}>
            <ClerkIcon></ClerkIcon>
          </Link>
          <Link href={"#"}>
            <NeonIcon></NeonIcon>
          </Link>
          <Link href={"#"}>
            <ClerkIcon></ClerkIcon>
          </Link>
          <Link href={"#"}>
            <NeonIcon></NeonIcon>
          </Link>
          <Link href={"#"}>
            <ClerkIcon></ClerkIcon>
          </Link>
        </div>
      </section>
      <section className=" flex flex-col gap-8 py-8 bg-accent">
        <h1 className="text-3xl text-center font-bold" id="pricing">
          Pricing
        </h1>
        <div className="card_wrapper  container grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {subscriptionTiersInOrder.map((t) => {
            return <PricingCard key={t.name} properties={t} tier={subTier.name}></PricingCard>;
          })}
        </div>
      </section>
      <footer className="py-16 bg-slate-50 flex flex-col gap-4">
        <div className=" container flex  flex-col flex-wrap gap-4">
          <Logo></Logo>
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <FooterLinks
              title="Help"
              links={[
                { label: "PPP discounts", href: "#" },
                { label: "Holiday discouts", href: "#" },
                { label: "Time based discounts", href: "#" },
                { label: "Discout Api", href: "#" },
                { label: "Contact", href: "#" },
              ]}
            ></FooterLinks>
            <FooterLinks
              title="Solutions"
              links={[
                { label: "Newsletter", href: "#" },
                { label: "SaaS Business", href: "#" },
                { label: "Online Courses", href: "#" },
                { label: "Info Products", href: "#" },
              ]}
            ></FooterLinks>
            <FooterLinks
              title="Features"
              links={[
                { label: "Holiday discounts", href: "#" },
                { label: "PPP discounts", href: "#" },
                { label: "Time based discounts", href: "#" },
                { label: "Geographical Pricing", href: "#" },
              ]}
            ></FooterLinks>
            <FooterLinks
              title="Tools"
              links={[
                { label: "Salary converter", href: "#" },
                { label: "Coupon generator", href: "#" },
                { label: "Stripe app", href: "#" },
              ]}
            ></FooterLinks>
            <FooterLinks
              title="Company"
              links={[
                { label: "Affiliate", href: "#" },
                { label: "Twitter", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Privacy", href: "#" },
              ]}
            ></FooterLinks>
            <FooterLinks
              title="Integrations"
              links={[
                { label: "Lemon Squeezy", href: "#" },
                { label: "Gumroad", href: "#" },
                { label: "Stripe", href: "#" },
                { label: "Chargebee", href: "#" },
                { label: "Whop", href: "#" },
                { label: "Paddle", href: "#" },
              ]}
            ></FooterLinks>
          </div>
        </div>
      </footer>
    </>
  );
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
  tier?: string;
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
                }   >
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

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <ul className="flex flex-col gap-2">
        {links.map((item, index) => (
          <li>
            <Link
              href={item.href}
              key={index}
              className="text-xs text-gray-600 lg:text-sm"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
