"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formSchema } from "@/lib/utils";
import { createProduct } from "@/server/actions/products";
import { useToast } from "@/hooks/use-toast";


export default function FormComponent({formType}:{formType: string}) {
    const {toast} = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
    },
  });
  async function submitHandler(values: z.infer<typeof formSchema>) {
    const data = await createProduct(values)
    if(data?.message){
        toast({
            title : data.error ? 'Error' : 'Message',
            description : data.message,
            variant : data.error ? 'destructive' : 'default'
        })
    }
    console.log(values);
  }
  return (
    <Card className="sm:p-16 p-6">
      <CardHeader>
        <h2 className="text-xl font-semibold ">{formType != null && 'Product Detail'}</h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            action=""
            onSubmit={form.handleSubmit(submitHandler)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=""> Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Description</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" placeholder="Enter your description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Website Url</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter website URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button disabled={form.formState.isSubmitting} type="submit">Create Product</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
