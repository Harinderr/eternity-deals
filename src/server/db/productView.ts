import { db } from "@/drizzle/db";
import {
  CountryGroupTable,
  CountryTable,
  ProductTable,
  ProductViewTable,
} from "@/drizzle/schema";
import { and, count, desc, eq, gt, gte, SQL, sql, sum } from "drizzle-orm";
import { startOfDay, subDays } from "date-fns";
import { fillData } from "@/lib/utils";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS, getGlobalTag, getIdTag, getUserTag } from "@/lib/cache";

interface ViewData {
  date: string; // Assuming date is always a string (e.g., 'YYYY-MM' or 'YYYY-MM-DD')
  views: string; // Assuming views is always a number
}
export async function getProductCountryViewCount(
  productId: string | undefined,
  time: string
) {
  const cacheFc = cache(
    unstable_cache(getProductCountryViewCountInternals, undefined, {
      tags: [
        productId == null
          ? getGlobalTag(CACHE_TAGS.productViews)
          : getIdTag(productId, CACHE_TAGS.productViews),
      ],
    })
  );
 return cacheFc(productId, time);
}
export async function getCountryViewData(
  productId: string | undefined,
  time: keyof typeof CHART_INTERVALS,
  userId: string
) {
  const cacheFc = cache(
    unstable_cache(getCountryViewDataInternals, undefined, {
      tags: [
        productId == null
          ? getGlobalTag(CACHE_TAGS.productViews)
          : getIdTag(productId, CACHE_TAGS.productViews),
        getUserTag(userId, CACHE_TAGS.productViews),
      ],
    })
  );
 return cacheFc(productId, time, userId);
}
export async function getViewsByCountryGroup(
  productId: string | undefined,
  userId: string,
  time?: string
) {
  const cacheFc = cache(
    unstable_cache(getViewsByCountryGroupInternals, undefined, {
      tags: [
        productId == null
          ? getGlobalTag(CACHE_TAGS.productViews)
          : getIdTag(productId, CACHE_TAGS.productViews),
        getUserTag(userId, CACHE_TAGS.productViews),
      ],
    })
  );
 return cacheFc(productId, userId, time);
}

export async function createProductViewCount({
  productId,
  countryId,
  userId,
}: {
  productId: string;
  countryId: string;
  userId: string;
}) {
  const { rowCount } = await db.insert(ProductViewTable).values({
    productId: productId,
    countryId: countryId,
  });
  return rowCount > 0;
}

 async function getProductCountryViewCountInternals(
  productId: string | undefined,
  time: string
) {
  const arr = {
    last7Days: 7,
    last30Days: 30,
    last1Year: 12,
  };
  const list = fillData(arr[time as keyof typeof arr]);
  const date = new Date();
  let output:ViewData[];
  if (time == "last1Year") {
    const lastYearDate = new Date();
    lastYearDate.setFullYear(lastYearDate.getFullYear() - 1); // Subtract one year
    const condition = [gt(ProductViewTable.visitedAt, lastYearDate)];
    if (productId != null) {
      condition.push(eq(ProductViewTable.productId, productId));
    }
    output = await db
      .select({
        date: sql`TO_CHAR(${ProductViewTable.visitedAt}, 'YYYY-MM')`.as(
          "month"
        ), // Format: YYYY-MM
        views: sql`COUNT(*)`.as("views"),
      })
      .from(ProductViewTable)
      .where(and(...condition))
      .groupBy(sql`TO_CHAR(${ProductViewTable.visitedAt}, 'YYYY-MM')`) // Group by formatted date
      .orderBy(sql`TO_CHAR(${ProductViewTable.visitedAt}, 'YYYY-MM')`) as ViewData[]; // Sort by formatted date
  } else {
    const thirtyDaysAgo = date.setDate(date.getDate() - 30);
    const condition = [gt(ProductViewTable.visitedAt, new Date(thirtyDaysAgo))];
    if (productId != null) {
      condition.push(eq(ProductViewTable.productId, productId));
    }
    output = await db
      .select({
        date: sql`DATE(${ProductViewTable.visitedAt})`.as("date"),
        views: sql`COUNT(*)`.as("views"),
      })
      .from(ProductViewTable)
      .where(and(...condition))
      .groupBy(sql`DATE(${ProductViewTable.visitedAt})`)
      .orderBy(sql`DATE(${ProductViewTable.visitedAt})`) as ViewData[];
  }

  const modified = list.map((v) => {
    let match;
    if (list.length == 12) {
      match = output.find((i) => i.date == v.date);
    } else {
      match = output.find((i) => i.date == v.date);
    }

    if (match != null) {
      return { date: v.date, views: Number(match.views) };
    } else {
      return { date: v.date, views: 0 };
    }
  });
  return modified.reverse();
}

async function getCountryViewDataInternals(
  productId: string | undefined,
  time: keyof typeof CHART_INTERVALS,
  userId: string
) {
  const startDate = startOfDay(CHART_INTERVALS[time].startDate);
  const productsSq = db.$with("products").as(
    db
      .select()
      .from(ProductTable)
      .where(
        and(
          eq(ProductTable.clerkUserId, userId),
          productId == null ? undefined : eq(ProductTable.id, productId)
        )
      )
  );
  const data = await db
    .with(productsSq)
    .select({
      views: count(ProductViewTable.visitedAt),
      countryName: CountryTable.name,
      countryCode: CountryTable.code,
    })
    .from(ProductViewTable)
    .innerJoin(productsSq, eq(productsSq.id, ProductViewTable.productId))
    .innerJoin(CountryTable, eq(CountryTable.id, ProductViewTable.countryId))
    .where(
      gte(
        sql`${ProductViewTable.visitedAt} AT TIME ZONE ${"UTC"}`.inlineParams(),
        startDate
      )
    )
    .groupBy(({ countryCode, countryName }) => [countryCode, countryName])
    .orderBy(({ views }) => desc(views))
    .limit(25);

  return data;
}

export const CHART_INTERVALS = {
  last7Days: {
    dateFormatter: (date: Date) => dateFormatter.format(date),
    startDate: subDays(new Date(), 7),
    label: "Last 7 Days",
    sql: sql`GENERATE_SERIES(current_date - 7, current_date, '1 day'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) =>
      sql<string>`DATE(${col})`.inlineParams(),
  },
  last30Days: {
    dateFormatter: (date: Date) => dateFormatter.format(date),
    startDate: subDays(new Date(), 30),
    label: "Last 30 Days",
    sql: sql`GENERATE_SERIES(current_date - 30, current_date, '1 day'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) =>
      sql<string>`DATE(${col})`.inlineParams(),
  },
  last1Year: {
    dateFormatter: (date: Date) => monthFormatter.format(date),
    startDate: subDays(new Date(), 365),
    label: "Last 365 Days",
    sql: sql`GENERATE_SERIES(DATE_TRUNC('month', current_date - 365), DATE_TRUNC('month', current_date), '1 month'::interval) as series`,
    dateGrouper: (col: SQL | SQL.Aliased) =>
      sql<string>`DATE_TRUNC('month', ${col})`.inlineParams(),
  },
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeZone: "UTC",
});

const monthFormatter = new Intl.DateTimeFormat(undefined, {
  year: "2-digit",
  month: "short",
  timeZone: "UTC",
});

 async function getViewsByCountryGroupInternals(
  productId: string | undefined,
  userId: string,
  time?: string
) {
  try {
    const productSq = db.$with("product").as(
      db
        .select()
        .from(ProductTable)
        .where(
          and(
            eq(ProductTable.clerkUserId, userId),
            productId == null ? undefined : eq(ProductTable.id, productId)
          )
        )
    );

    const countryViewSq = db.$with("countryView").as(
      db
        .with(productSq)
        .select({
          views: count(ProductViewTable.visitedAt).as("views"),
          country: CountryTable.name,
          countryGroupId: CountryTable.countryGroupId,
        })
        .from(ProductViewTable)
        .innerJoin(productSq, eq(productSq.id, ProductViewTable.productId))
        .innerJoin(
          CountryTable,
          eq(CountryTable.id, ProductViewTable.countryId)
        )
        .groupBy(CountryTable.name, CountryTable.countryGroupId)
        .orderBy(desc(count(ProductViewTable.visitedAt)))
    );

    const data = await db
      .with(countryViewSq)
      .select({
        views: sum(countryViewSq.views) ?? "0",
        countryGroup: CountryGroupTable.name,
      })
      .from(CountryGroupTable)
      .leftJoin(
        countryViewSq,
        eq(countryViewSq.countryGroupId, CountryGroupTable.id)
      )
      .groupBy(CountryGroupTable.name)
      .orderBy(({ views }) => desc(views));

  
    return data;
  } catch (error) {
    console.error("Error fetching views by country group:", error);
    throw error;
  }
}
