'use client'
import BackButton from "@/app/dashboard/_components/BackButton";
import FormComponent from "@/app/dashboard/_components/FormComponent";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/lib/utils";
import { FormInput } from "lucide-react";
import {z} from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/server/db/products";
import { ProductTable } from "@/drizzle/schema";
import { updateProduct } from "@/server/actions/products";
import { toast } from "@/hooks/use-toast";
const EditFormComponent = ({product}:{
   product? : {
    id : string,
   url : string,
   description : string | null,
   name : string
   }
}) => {  
     const form = useForm<z.infer<typeof formSchema>>({
    resolver : zodResolver(formSchema),
    defaultValues : product != null ? {...product,description : product.description ?? ""} : {
        name : "",
        description : "",
        url : ""
    }

})

async function handleFormSubmit(values : z.infer<typeof formSchema>){
    if(product != null) {
      const updateFunc =  updateProduct.bind(null, product.id)
     const data = await updateFunc(values)   

     if(data?.message){
        toast({
            title : data.error ? 'Error' : 'Message',
            description : data.message,
            variant : data.error ? 'destructive' : 'default'
        })
    }}
}
return (

<div className=" ">
 
  <Form {...form}>
    <form action="" 
    className="flex flex-col gap-4"
    onSubmit={form.handleSubmit(handleFormSubmit)}
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Product Name" />
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}
      ></FormField>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Product Name" />
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}
      ></FormField>
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Product Name" />
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}
      ></FormField>
      <Button>Edit Product</Button>
    </form>
  </Form>
</div>
);}

export default EditFormComponent