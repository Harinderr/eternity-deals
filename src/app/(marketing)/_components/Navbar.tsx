import Link from "next/link";
import Logo from "../../../components/Logo";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function NavBar() {
    return (
        <header className="fixed top-0 w-full z-10 bg-white/95  px-10 py-4 shadow-md">
            <nav className="flex items-center sm:gap-10 gap-6 container">
               <Link className="mr-auto" href={'/'}>
                <Logo></Logo>
               </Link>
             <Link className="text-lg" href={'/'}> Features</Link>
                <Link className="text-lg" href={'/'}> Pricing</Link>
                <Link className="text-lg" href={'/'}> About</Link>
            <span className="texl-lg">
                <SignedIn>
                    <Link href={'dashboard'} className="text-lg">DashBoard</Link>
                </SignedIn>
                <SignedOut>
                   <SignInButton>Login</SignInButton>
                </SignedOut>
            </span>
            </nav>
        </header>
    )
}