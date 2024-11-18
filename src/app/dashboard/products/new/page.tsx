import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import FormComponent from "../../_components/FormComponent";
import Link from "next/link";
import BackButton from "../../_components/BackButton";

export default function CreateNewProduct() {
return (
    <div className="mt-20 container flex flex-col gap-8 ">
        <div className=" flex justify-start gap-4 items-center">
         <BackButton></BackButton>
        <h1 className="text-3xl font-bold"> Create Product</h1>
        </div>
        <FormComponent formType="Create Product"/>
    </div>
)
}