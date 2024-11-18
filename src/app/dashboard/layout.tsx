import { ReactNode } from "react";
import Navbar from "./_components/Navbar";

export default function AuthLayout({children}: {children: ReactNode}) {
    return (
        <>
        <div className="flex bg-slate-50 justify-between items-center pt-10">
        <Navbar></Navbar>
            {children}
        </div>
        </>
    )
}