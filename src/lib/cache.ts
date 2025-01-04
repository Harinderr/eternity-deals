import {  revalidateTag } from "next/cache";

export type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>;

export const CACHE_TAGS = {
  products: "products", 
  usersubscription : "usersubscription",
  productViews : "productViews"
  } as const;

export function getGlobalTag(tag: keyof typeof CACHE_TAGS) {
  return `global:${CACHE_TAGS[tag]}` as const;
}
export function getUserTag(userId: string, tag: keyof typeof CACHE_TAGS) {
  return `user:${userId}-${CACHE_TAGS[tag]}` as const;
}
export function getIdTag(id: string, tag: keyof typeof CACHE_TAGS) {
  return `id:${id}-${CACHE_TAGS[tag]}` as const;
}

export function clearCache() {
  revalidateTag("*");
}

export function revalidateDbCache({
  tag, userId, Id
}: {tag : keyof typeof CACHE_TAGS, userId? : string, Id?: string}){
   revalidateTag(getGlobalTag(tag))
   if(userId != null) {
    revalidateTag(getUserTag(userId,tag))
   }
   if(Id != null) {
    revalidateTag(getUserTag(Id,tag))
   }
}