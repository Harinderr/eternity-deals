import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ConvertToK(val:number) {
  if(val > 1000){
    return val/1000 + 'K'
  }
}

export const formSchema = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string().min(1, { message: `Can't be empty` }),
  url: z.string().url().min(1, { message: `Can't be Empty` }),
});
