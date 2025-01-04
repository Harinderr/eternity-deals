'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import AddToSiteCpt from "./AddToSiteCpt";
import DeleteModel from "./DeleteModel";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function ProductList({
  value,
}: {
  value: {
    id: string;
    name: string;
    url: string;
    description: string | null;
  };
}) {
  return (
    <>
      <Card className="relative overflow-hidden">
        {/* Dropdown for settings */}
        <Dialog>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full absolute top-2 right-2" variant={'link'} size={'sm'}>
                  <EllipsisVertical size={'24px'} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-white">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuItem asChild className="hover:bg-slate-200">
                  <Link href={`/dashboard/products/${value.id}/edit`}>Edit</Link>
                </DropdownMenuItem>
                <DialogTrigger className="w-full">
                  <DropdownMenuItem className="hover:bg-slate-200">
                    Add to Site
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuSeparator />
                <AlertDialogTrigger className="w-full">
                  <DropdownMenuItem className="hover:bg-slate-200">
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DeleteModel id={value.id} />
          </AlertDialog>

          <AddToSiteCpt id={value.id} />
        </Dialog>
        <div className="">
          <CardHeader>
            <CardTitle>{value.name}</CardTitle>
            <CardDescription>
              {value.description?.substring(0, 40).concat('...')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link className="text-blue-500 truncate" href={value.url}>
              {value.url}
            </Link>
            </CardContent>
        </div>

      
      </Card>
    </>
  );
}
