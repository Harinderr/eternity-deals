import Banner from "@/components/Banner"
import { env } from "@/data/env/client";
import { getProduct, getProductBanner } from "@/server/db/products";
import { createProductViewCount } from "@/server/db/productView";
import { auth, getAuth } from "@clerk/nextjs/server";
import { request } from "http";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { createElement } from "react";


interface BannerInfo {
  countryGroup: { discountPercentage: number; coupon: string };
  productCustomize: {
    classPrefix: string | null;
    productId: string;
    locationMessage: string;
    backgroundColor: string;
    textColor: string;
    fontSize: string;
    bannerContainer: string;
    isSticky: boolean;
  };
}
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      productId: string;
    };
  }
) {
  const headersMap = headers();
  const requestingUrl = headersMap.get("referer") || headersMap.get("origin");
  const product = await getProduct(params.productId);
  if (product == null) return notFound()
  const countryCode = getCountryCode(req)
  const getBannerinfo = await getProductBanner(
    product.id,
    product.clerkUserId,
    countryCode
  );
  if (getBannerinfo == null) return notFound();
  let out = await makeHtmlcontent(getBannerinfo);
  if (countryCode == null) return notFound()
    await createProductViewCount({productId :product.id,countryId:getBannerinfo.country.id,userId :product.clerkUserId})
  return new Response(out, { headers: { "content-type": "text/javascript" } });
}

async function makeHtmlcontent(BannerInfo: BannerInfo) {
  const { renderToStaticMarkup } = await import("react-dom/server")
  console.log('process start');
  
  return `
  const banner = document.createElement('div');
  banner.innerHTML = '${renderToStaticMarkup(
    createElement(Banner,{
      data : {
        locationMessage: BannerInfo.productCustomize.locationMessage,
        backgroundColor: BannerInfo.productCustomize.backgroundColor,
        textColor: BannerInfo.productCustomize.textColor,
        fontSize: BannerInfo.productCustomize.fontSize,
        bannerContainer: BannerInfo.productCustomize.bannerContainer,
        classPrefix: BannerInfo.productCustomize.classPrefix,
        isSticky: BannerInfo.productCustomize.isSticky,
      },
      BannerInfo : {
        country : 'IN',
        coupon : 'half',
        discount : 40
      }
    })
  )}';
   document.querySelector('${
      BannerInfo.productCustomize.bannerContainer
    }').prepend(...banner.children)`.replace(/(\r\n|\n|\r)/g, '')
    
}


function getCountryCode(request: NextRequest) {
  if (request.geo?.country != null) return request.geo.country
  if (process.env.NODE_ENV === "development") {
    return process.env.COUNTRY_CODE
  }
}