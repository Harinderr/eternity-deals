import { env } from "@/data/env/client";

export default function Banner({
    data, BannerInfo
  }: {
    data: {
      locationMessage: string;
      backgroundColor: string;
      textColor: string;
      fontSize: string;
      bannerContainer: string;
      classPrefix: string | null;
      isSticky: boolean;
    },
    BannerInfo : {
      country : string,
      coupon : string,
      discount : number
    }
  }) {
    const Prefix = data.classPrefix == null ? '' : data.classPrefix
    const msg = data.locationMessage
    const message = Object.entries(BannerInfo).reduce(
     ( updatedMessage, [key,value]) => {
      return updatedMessage.replace( new RegExp(`{${key}}`, 'g'),value.toString())
     },
     msg
    )
    
        
  
    return (
      <>
        <style type='text/css'>
          {`
            .${Prefix}easy-ppp-container {
              all: revert;
              display: flex;
              flex-direction: column;
              gap: .5em;
              background-color: ${data?.backgroundColor};
              color: ${data?.textColor};
              font-size: ${data?.fontSize};
              font-family: inherit;
              padding: 1rem;
              ${data?.isSticky ? "position: sticky;" : ""}
              left: 0;
              right: 0;
              top: 0;
              z-index : 100;
              text-wrap: balance;
              text-align: center;
            }
  
            .${Prefix}easy-ppp-branding {
              color: inherit;
              font-size: inherit;
              display: inline-block;
              text-decoration: underline;
            }
          `}
        </style>
  
        <div className={`${data.classPrefix}easy-ppp-container p-4 m-4 bg-gray-200`}>
          <p
            dangerouslySetInnerHTML={{
              __html: message,
            }}
          ></p>
  
          <a
            className={`${data.classPrefix}easy-ppp-branding `}
            href={`${env.NEXT_PUBLIC_SERVER_URL}`}
          >
            Powered by Easy PPP
          </a>
        </div>
      </>
    );
  }