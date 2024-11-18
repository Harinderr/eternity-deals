import Logo from "@/components/Logo";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar () {
return (
    <header className="fixed top-0 w-full z-10 bg-white/95  px-10 py-4 shadow-md">
            <nav className="flex items-center sm:gap-10 gap-6 container">
               <Link className="mr-auto" href={'/'}>
                <Logo></Logo>
               </Link>
             <Link className="text-lg" href={'/'}> Products</Link>
                <Link className="text-lg" href={'/'}> Analytics</Link>
                <Link className="text-lg" href={'/'}> Subscriptions</Link>
            <UserButton></UserButton>
            </nav>
        </header>
)
}