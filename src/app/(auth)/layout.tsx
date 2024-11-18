import { ReactNode } from "react";

export default function AuthLayout({children}: {children: ReactNode}) {
    return (
        <div className="flex bg-slate-50 justify-center items-center pt-10">
            {children}
        </div>
    )
}