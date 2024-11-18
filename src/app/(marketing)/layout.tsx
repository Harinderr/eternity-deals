import { ReactNode } from "react";
import NavBar from "./_components/Navbar";
export default function MarketingLayout(
    {children} : {children : ReactNode}
) {
    return ( 
        <>
     <NavBar></NavBar>
        {children}
        
        </>
    )
}