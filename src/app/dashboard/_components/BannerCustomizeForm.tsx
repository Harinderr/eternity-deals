"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/data/env/client";
import {
  subscriptionTiers,
  subscriptionTiersInOrder,
  TierNames,
} from "@/data/subTier";
import { ProductCustomizationTable } from "@/drizzle/schema";
import { toast, useToast } from "@/hooks/use-toast";
import { formSchema, ProductCustomizeSchema } from "@/lib/utils";
import { saveCustomiztionData } from "@/server/actions/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { subtle } from "crypto";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UpgradeAccount from "../../../components/UpgradeAccount";
import Banner from "@/components/Banner";

const BannerCustomizeForm = ({
  subTier,productCustomization
}: {
  subTier: (typeof subscriptionTiers)[TierNames],
  productCustomization : {
  productId: string
  locationMessage: string
  backgroundColor: string
  textColor: string
  fontSize: string
  bannerContainer: string
  isSticky: boolean
  classPrefix: string | null

  }
}) => {
  const txt = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero saepe ad sequi rem quo, repellendus odit exercitationem ullam cumque autem velit quis, nostrum voluptates illo voluptatibus quisquam voluptatum, dignissimos non."
  const form = useForm<z.infer<typeof ProductCustomizeSchema>>({
    resolver: zodResolver(ProductCustomizeSchema),
    defaultValues: {...productCustomization, classPrefix : productCustomization.classPrefix ?? ""},
  });
  const watchedValues = form.watch();
  if (subTier == null) throw new Error('subtier error')

  async function saveForm(values : z.infer<typeof ProductCustomizeSchema>) {
     const res = await saveCustomiztionData(values,productCustomization.productId)
     if(res?.message){
      toast({
        title : res.error ? 'Error' : 'Message',
          description : res.message,
          variant : res.error ? 'destructive' : 'default'
      })
     }
    }
const BannerInfo = {country : 'IN',coupon : 'half', discount : 40 }

  return (
    <>
      <Banner data={watchedValues} BannerInfo={BannerInfo}></Banner>
      { !subTier.canCustomizeBanner &&   <UpgradeAccount></UpgradeAccount>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(saveForm)} className="grid grid-cols-2 md:grid-cols-1 gap-2" action="">
       
          <FormField
            name="locationMessage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Message</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={!subTier.canCustomizeBanner}
                    {...field}
                    placeholder="Enter Location message"
                  />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
          <FormField
            name="backgroundColor"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <Input
                    disabled={!subTier?.canCustomizeBanner}
                    {...field}
                    placeholder="eg. #dhhkdk"
                  />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
          <FormField
            name="textColor"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Color</FormLabel>
                <FormControl>
                  <Input
                    disabled={!subTier.canCustomizeBanner}
                    {...field}
                    placeholder="e.g. #ffffff"
                  />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
          <FormField
            name="fontSize"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font Size</FormLabel>
                <FormControl>
                  <Input disabled={!subTier.canCustomizeBanner} {...field} placeholder="e.g. 1rem" />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
          <FormField
            name="classPrefix"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Prefix</FormLabel>
                <FormControl>
                  <Input disabled={!subTier.canCustomizeBanner} {...field} placeholder="classForm" />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
           <FormField
                control={form.control}
                name="bannerContainer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Banner container
                      
                    </FormLabel>
                    <FormControl>
                      <Input disabled={!subTier.canCustomizeBanner} {...field} />
                    </FormControl>
                    <FormDescription>
                      HTML container selector where you want to place the
                      banner. Ex: #container, .container, body
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          <FormField
            name="isSticky"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>IsSticky</FormLabel>
                <FormControl>
                  <Switch
                    disabled={!subTier.canCustomizeBanner}
                    id="sticky"
                    className=""
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  ></Switch>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
          <div className="">
            <Button
            disabled={form.formState.isSubmitting || !subTier.canCustomizeBanner}
            type="submit" >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default BannerCustomizeForm;





