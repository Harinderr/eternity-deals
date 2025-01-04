"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReactCountryFlag from "react-country-flag";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CountryGroupSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateCountryGroupDiscounts } from "@/server/actions/products";
import { toast } from "@/hooks/use-toast";

const CountryGroupForm = ({
  productId,
  countryGroup,
}: {
  productId : string,
  countryGroup: {
    id : string,
    name: string;
    recommendedDiscountPercentage: number | null;
    countries: {
      name: string;
      code: string;
    }[]
    discount? :{
      coupon : string;
      discountPercentage : number | null;
    }
  }[];
}) => {
  const form = useForm<z.infer<typeof CountryGroupSchema>>({
    resolver: zodResolver(CountryGroupSchema),
    defaultValues: {
      groups : countryGroup.map((group)=> {
        const discount = group.discount?.discountPercentage ?? group.recommendedDiscountPercentage
        return {
          id : group.id,
         discountPercentage : discount != null ? discount : undefined,
          coupon : group.discount?.coupon ?? ""

        }
      })
    },
  });

  async function handleCountryGroup(
    values: z.infer<typeof CountryGroupSchema>
  ) {
 const res = await updateCountryGroupDiscounts(productId,values)
    if(res?.message){
      toast({
          title : res.error ? 'Error' : 'Message',
          description : res.message,
          variant : res.error ? 'destructive' : 'default'
      })
  }
  }
  return (
    <Form {...form}>
      <form action="" onSubmit={form.handleSubmit(handleCountryGroup)}>
        {countryGroup.map((val,index) => {
          return (
            <Card key={val.name}>
              <CardHeader>{val.name}</CardHeader>
              <CardContent className="flex flex-row justify-around">
                <div className="w-1/2">
                  {val.countries.map((i) => {
                    return (
                      <ReactCountryFlag
                        className="m-1"
                        key={i.code}
                        countryCode={i.code}
                        svg
                      ></ReactCountryFlag>
                    );
                  })}
                </div>
                <FormField
                  control={form.control}
                  name={`groups.${index}.discountPercentage`}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Discount</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""}
                           type="number"
                           onChange={e =>
                              field.onChange(e.target.valueAsNumber)
                            } placeholder="Enter discount..." />
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    );
                  }}
                ></FormField>
                <FormField
                  control={form.control}
                  name={`groups.${index}.coupon`}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Coupen</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter Coupen..." />
                        </FormControl>
                        <FormMessage></FormMessage>
                      </FormItem>
                    );
                  }}
                ></FormField>
              </CardContent>
            </Card>
          );
        })}
        <div className=" w-full flex justify-end mt-8 wrapper">
          <Button
            className=""
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CountryGroupForm;

// <Card>
// <CardHeader></CardHeader>
// <CardContent>
// <div className="flags">

// </div>
//
// </CardContent>
// </Card>
