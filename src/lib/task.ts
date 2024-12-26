import { db } from "@/drizzle/db";
import countriesByDiscount from "@/data/CountryGroupDiscounts.json";
import { CountryGroupTable, CountryTable } from "@/drizzle/schema";
import { sql } from "drizzle-orm";
import { error } from "console";

const groupCount = await updateCountryGroups();
const countryCount = await updateCountries();

console.log(
  `Updated ${groupCount} country groups and ${countryCount} countries`
);

export async function updateCountryGroups() {
  const data = countriesByDiscount.map(
    ({ name, recommendedDiscountPercentage: rcp }) => {
      let recommendedDiscountPercentage = rcp == null ? 0.1 : rcp;
      return { name, recommendedDiscountPercentage };
    }
  );
  let {rowCount} = await db
    .insert(CountryGroupTable)
    .values(data)
    .onConflictDoUpdate({
      target: CountryGroupTable.name,
      set: {
        recommendedDiscountPercentage: sql.raw(
          `excluded.${CountryGroupTable.recommendedDiscountPercentage.name}`
        ),
      },
    });
    return rowCount
}

export async function updateCountries() {
  const countryGroups = await db.select({
    id : CountryGroupTable.id,
    name : CountryGroupTable.name
  }).from(CountryGroupTable)
 
  let data = countriesByDiscount.flatMap(({ countries,name }) => {
    const isValid = countryGroups.find(i => i.name == name)
    if(!isValid) {
      throw new Error('no valid group')
    }
    return countries.map((i) => {
      return { name: i.countryName, code: i.country ,countryGroupId : isValid.id};
    });
  });

 const {rowCount} =  await db
        .insert(CountryTable)
        .values(data)
        .onConflictDoUpdate({
          target : CountryTable.name,
          set : {
            name : sql.raw(`excluded.${CountryTable.name.name}`),
            countryGroupId : sql.raw(`excluded.${CountryTable.countryGroupId.name}`)
          }
        })
        return rowCount 
}
