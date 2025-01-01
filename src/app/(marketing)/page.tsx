import Image from "next/image";
import NavBar from "./_components/Navbar";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck } from "lucide-react";
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
import {
  cancelSession,
  createCheckoutSession,
  PaidTier,
} from "@/server/actions/stripe";
import { auth } from "@clerk/nextjs/server";
import { getUserSubTier } from "@/server/db/subscription";

export default async function Home() {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();
  const subTier = await getUserSubTier(userId);

  return (
    <>
      {/* Hero Section */}
      <section className="h-fit bg-gradient-to-t from-violet-300 via-violet-400 min-h-screen px-6 sm:px-10 text-center pt-32 sm:pt-44">
        <div className="container flex flex-col gap-4 sm:gap-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold">
            Price Smarter, Sell Bigger!
          </h1>
          <p className="text-base sm:text-lg">
            Optimize your product pricing across countries to maximize sales.
            Capture 85% of the untapped market with location-based dynamic
            pricing.
          </p>
          <SignUpButton>
            <Button className="bg-black text-white w-full sm:w-auto">
              Get Started for Free <ArrowRight />
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Trusted Companies Section */}
      <section className="bg-black flex flex-col gap-8 text-white p-8 min-h-screen">
        <div className="container">
          <h1 className="text-3xl lg:text-3xl xl:text-4xl text-center pt-8 font-bold">
            Trusted by all the Modern Companies
          </h1>
        </div>
        <div className="icons_wrapper container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(8)].map((_, i) =>
            i % 2 === 0 ? (
              <Link href={"#"} key={i}>
                <NeonIcon />
              </Link>
            ) : (
              <Link href={"#"} key={i}>
                <ClerkIcon />
              </Link>
            )
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="flex flex-col gap-8 py-8 bg-accent">
        <h1 className="text-3xl text-center font-bold" id="pricing">
          Pricing
        </h1>
        <div className="card_wrapper container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {subscriptionTiersInOrder.map((tier) => (
            <PricingCard
              key={tier.name}
              properties={tier}
              tier={subTier.name}
            />
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-16 bg-slate-50 flex flex-col gap-4">
        <div className="container flex flex-col flex-wrap gap-4">
          <Logo />
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            {footerLinks.map((section, index) => (
              <FooterLinks
                key={index}
                title={section.title}
                links={section.links}
              />
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}

// Pricing Card Component
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
    <Card>
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
            properties.name === "Free"
              ? cancelSession
              : createCheckoutSession.bind(null, properties.name as PaidTier)
          }
        >
          <Button
            className={`bg-black ${
              tier == properties.name && "bg-black/60"
            } text-white w-full`}
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

// Features Component
function Features({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row gap-2">
      <BadgeCheck color="#5d8eee" />
      <p className="text-sm">{children}</p>
    </div>
  );
}

// Footer Links Component
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
          <li key={index}>
            <Link
              href={item.href}
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

// Footer Links Data
const footerLinks = [
  {
    title: "Help",
    links: [
      { label: "PPP discounts", href: "#" },
      { label: "Holiday discounts", href: "#" },
      { label: "Time-based discounts", href: "#" },
      { label: "Discount API", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  // Add other sections here similarly
];
