import Link from "next/link";
import Logo from "../../../components/Logo";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function NavBar() {
    return (
        <header className="fixed top-0 w-full z-10 bg-white/95  px-10 py-4 shadow-md">
            <nav className="flex  items-center justify-around sm:gap-10 gap-6 container">
               <Link className="mr-auto" href={'/'}>
                <Logo></Logo>
               </Link>
               <div className="links sm:w-2/5 sm:flex justify-around items-center hidden">
             <Link className="text-[1rem]" href={'/'}> Features</Link>
                <Link className="text-[1rem]" href={'#pricing'}> Pricing</Link>
                <Link className="text-[1rem]" href={'/'}> About</Link>
                
            <div className="texl-lg">
                <SignedIn>
                    <DropdownMenu>
                        
                        <DropdownMenuTrigger asChild>
                        <div className="bg-white text-black border-none cursor-pointer"><LayoutDashboard /></div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white text-black">
                        <DropdownMenuLabel>
                            Account 
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                            <User /> <Link href={'dashboard'} >Dashboard</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                            <LogOut /> <Link  href={'#'}>Logout</Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        </DropdownMenuContent>
                     
                    </DropdownMenu>
                    
                </SignedIn>
                <SignedOut>
                   <SignInButton>Login</SignInButton>
                </SignedOut>
            </div>
            </div>
            </nav>
        </header>
    )
}

