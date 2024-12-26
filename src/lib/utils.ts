import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ConvertToK(val: number) {
  if (val > 1000) {
    return val / 1000 + "K";
  }
}

export const formSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, { message: `Can't be empty` }),
  url: z.string().url().min(1, { message: `Can't be Empty` }),
});
export const CountryGroupSchema = z.object({
  groups: z.array(
    z.object({
      id : z.string(),
      discountPercentage: z.number().min(1, "Required").max(100),
      coupon: z.string(),
    })
  ),
});

export const ProductCustomizeSchema = z.object({
  locationMessage : z.string().min(1),
  backgroundColor : z.string().min(1).max(100),
  textColor : z.string().min(1).max(100),
  fontSize : z.string().min(1).max(100),
  bannerContainer : z.string().min(1).max(100),
  classPrefix : z.string(),
  isSticky : z.boolean()

})

export function createURL(
  href: string,
  oldParams: Record<string, string>,
  newParams: Record<string, string | undefined>
) {
  const params = new URLSearchParams(oldParams)
  Object.entries(newParams).forEach(([key, value]) => {
    if (value == undefined) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  })
  return `${href}?${params.toString()}`
}


 export function fillData(period: number) {
  const today = new Date();
  const arr = [];
  for (let i = 0; i < period; i++) {
    if (period == 12) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      let r = {
        date: date.toISOString().split("T")[0].split("-").slice(0, 2).join("-"),
      };
      arr.push(r);
    } else {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      let r = { date: date.toISOString().split("T")[0] };
      arr.push(r); // Format date as YYYY-MM-DD
    }
  }

  return arr;
}