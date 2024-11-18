import { db } from "@/drizzle/db";
import { ProductCustomizationTable, ProductTable } from "@/drizzle/schema";
import { CACHE_TAGS, getIdTag, getUserTag, revalidateDbCache } from "@/lib/cache";
import { formSchema } from "@/lib/utils";
import { Description } from "@radix-ui/react-toast";
import { eq ,and} from "drizzle-orm";
import { Tags } from "lucide-react";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { number, z } from "zod";

export async function getProducts(userId: string) {
  const cacheFc = cache(
    unstable_cache(getProductsInternals, undefined, {
      tags: [getUserTag(userId, CACHE_TAGS.products), "*"],
    })
  );
  return cacheFc(userId);
}

export async function createProductInDb(
  data: typeof ProductTable.$inferInsert
) {
  const [product] = await db
    .insert(ProductTable)
    .values(data)
    .returning({ id: ProductTable.id, userId: ProductTable.clerkUserId });
  try {
    await db
      .insert(ProductCustomizationTable)
      .values({ productId: product.id })
      .onConflictDoNothing({
        target: ProductCustomizationTable.productId,
      });
  } catch (error) {
    await db.delete(ProductTable).where(eq(ProductTable.id, product.id));
  }
  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId: product.userId,
    Id: product.id,
  });
  return product;
}

export async function deleteProductFromDB(Id: string, userId: string) {
  const { rowCount } = await db
    .delete(ProductTable)
    .where(eq(ProductTable.id, Id));

  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId,
      Id,
    });
  }
  return rowCount > 0;
}

export async function getProductsInternals(userId: string) {
  return db.query.ProductTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => desc(createdAt),
  });
}

export async function getProduct(productId: string, userId: string) {
  const cacheFc = cache(
    unstable_cache(getProductInternals, undefined, {
      tags: [getIdTag(productId, CACHE_TAGS.products), "*"],
    })
  );
  return cacheFc(productId, userId);
}
export async function getProductInternals(productId: string, userId: string) {
  const product = await db.query.ProductTable.findFirst({
    where: ({ clerkUserId, id }, { eq, and }) =>
      and(eq(clerkUserId, userId), eq(id, productId)),
  });
  return product;
}


export async function updateProductDb(
  data: Partial<typeof ProductTable.$inferInsert>,
  { id, userId }: { id: string; userId: string }
) {
  const {rowCount} = await db
    .update(ProductTable)
    .set(data)
    .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)));
  if(rowCount > 0) {
    revalidateDbCache({
     tag : CACHE_TAGS.products,
     userId : userId,
     Id :  id,
    })
  }
    return rowCount > 0
  
  }
