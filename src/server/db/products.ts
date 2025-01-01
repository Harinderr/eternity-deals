import { db } from "@/drizzle/db";
import {
  CountryGroupDiscountTable,
  ProductCustomizationTable,
  ProductTable,
} from "@/drizzle/schema";
import {
  CACHE_TAGS,
  getIdTag,
  getUserTag,
  revalidateDbCache,
} from "@/lib/cache";
import { formSchema, ProductCustomizeSchema } from "@/lib/utils";
import { Description } from "@radix-ui/react-toast";
import { count } from "console";
import { eq, and, inArray, sql } from "drizzle-orm";
import { BatchItem } from "drizzle-orm/batch";
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

export async function getProduct(productId: string, userId?: string) {
  const cacheFc = cache(
    unstable_cache(getProductInternals, undefined, {
      tags: [getIdTag(productId, CACHE_TAGS.products), "*"],
    })
  );
  return cacheFc(productId, userId);
}
export async function getProductInternals(productId: string, userId?: string) {
  const product = await db.query.ProductTable.findFirst({
    where: ({ clerkUserId, id }, { eq, and }) => {
      const conditions = [eq(id, productId)];
      if (userId) {
        conditions.push(eq(clerkUserId, userId));
      }
      return and(...conditions);
    },
  });
  return product;
}


export async function updateProductDb(
  data: Partial<typeof ProductTable.$inferInsert>,
  { id, userId }: { id: string; userId: string }
) {
  const { rowCount } = await db
    .update(ProductTable)
    .set(data)
    .where(and(eq(ProductTable.id, id), eq(ProductTable.clerkUserId, userId)));
  if (rowCount > 0) {
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: userId,
      Id: id,
    });
  }
  return rowCount > 0;
}

export async function getCountryGroup({
  productId,
  userId,
}: {
  productId: string;
  userId: string;
}) {
  const data = await db.query.CountryGroupTable.findMany({
    with: {
      countries: {
        columns: {
          name: true,
          code: true,
        },
      },
      countryGroupDiscounts: {
        columns: {
          discountPercentage: true,
          coupon: true,
        },
        where: ({ productId: id }, { eq }) => eq(id, productId),
      },
    },
  });
  return data.map((i) => {
    return {
      id: i.id,
      name: i.name,
      recommendedDiscountPercentage: i.recommendedDiscountPercentage,
      countries: i.countries,
      discount: i.countryGroupDiscounts.at(0),
    };
  });
}

export async function updateCountryGroupDiscountsDb(
  deleteGroup: { countryGroupId: string }[],
  insertGroup: {
    countryGroupId: string;
    productId: string;
    discountPercentage: number;
    coupon: string;
  }[],
  {
    productId,
    userId,
  }: {
    productId: string;
    userId: string;
  }
) {
  const product = await getProduct(productId, userId);
  if (product == null) {
    return false;
  }
  const statements: BatchItem<"pg">[] = [];
  if (deleteGroup.length > 0) {
    statements.push(
      db.delete(CountryGroupDiscountTable).where(
        and(
          eq(CountryGroupDiscountTable.productId, productId),
          inArray(
            CountryGroupDiscountTable.countryGroupId,
            deleteGroup.map((i) => {
              return i.countryGroupId;
            })
          )
        )
      )
    );
  }
  if (insertGroup.length > 0) {
    statements.push(
      db
        .insert(CountryGroupDiscountTable)
        .values(insertGroup)
        .onConflictDoUpdate({
          target: [
            CountryGroupDiscountTable.productId,
            CountryGroupDiscountTable.countryGroupId,
          ],
          set: {
            coupon: sql.raw(
              `excluded.${CountryGroupDiscountTable.coupon.name}`
            ),
            discountPercentage: sql.raw(
              `excluded.${CountryGroupDiscountTable.discountPercentage.name}`
            ),
          },
        })
    );
  }

  if (statements.length > 0) {
    await db.batch(statements as [BatchItem<"pg">]);
  }
  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId,
    Id: productId,
  });
  return true;
}

export async function getProudctCustomization(
  userId: string,
  productId: string
) {
  const cacheFc = cache(
    unstable_cache(getProudctCustomizationInternals, undefined, {
      tags: [CACHE_TAGS.products],
    })
  );
  return cacheFc(userId, productId);
}
export async function getProudctCustomizationInternals(
  userId: string,
  productId: string
) {
  const res = await db.query.ProductTable.findFirst({
    where: ({ clerkUserId, id }, { eq, and }) => {
      return and(eq(id, productId), eq(clerkUserId, userId));
    },
    with: {
      productCustomization: true,
    },
  });

  return res?.productCustomization;
}

export async function saveCustomiztionDataToDb(
  userId: string,
  productId: string,
  data: Partial<typeof ProductCustomizationTable.$inferInsert>
) {
  const { rowCount } = await db
    .update(ProductCustomizationTable)
    .set(data)
    .where(eq(ProductCustomizationTable.productId, productId));

  revalidateDbCache({
    tag: CACHE_TAGS.products,
    userId,
    Id: productId,
  });
}


export async function getProductCount(userId:string){
  const cacheFc = cache(unstable_cache(getProductCountInternals,undefined,{
    tags :[ getUserTag(userId, CACHE_TAGS.products),'*']
  }))
  return cacheFc(userId)
}
export async function getProductCountInternals(userId: string):Promise<number> {
  const output = await db
    .select({ count : sql<number>`COUNT(*)`.as('count') })
    .from(ProductTable)
    .where(eq(ProductTable.clerkUserId, userId));
     
    return output[0]?.count
}


export async function getProductBanner(productId:string,userId:string,code:string = 'IN',requestingUrl:string) {
  //,country  group - discount and coupen, product customixation 
  const product = await db.query.ProductTable.findFirst({
    where : ({id,url}) => and(eq(id, productId),eq(url,requestingUrl)) 
  })
  if(product == null) return null
  const country = await db.query.CountryTable.findFirst({
  columns : {
    id : true,
    countryGroupId: true,
  },
   where : ({code : cncode},{and, eq}) => {
   return  eq(cncode, code)
   }
   
})

if(country == null) return  null
const countryGroup = await db.query.CountryGroupDiscountTable.findFirst({
  columns : {
    discountPercentage : true,
    coupon : true
  },
  where : ({countryGroupId},{eq}) => eq(countryGroupId,country.countryGroupId) 
})

const productCustomize = await db.query.ProductCustomizationTable.findFirst({
 columns : {
  classPrefix: true,
  productId:true,
  locationMessage: true,
  backgroundColor:true,
  textColor: true,
  fontSize: true,
  bannerContainer: true,
  isSticky: true,
 },
  where : ({productId : pId},{eq}) => eq(pId, productId)
})
if(countryGroup == null ||  productCustomize == null) return null
 return {
  country,
  countryGroup,
  productCustomize
  
 }
  
}