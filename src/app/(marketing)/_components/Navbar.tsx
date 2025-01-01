'use client'
import { useState } from "react";
import Link from "next/link";
import Logo from "../../../components/Logo";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-10 bg-white/95 px-10 py-4 shadow-md">
      <nav className="flex items-center justify-between sm:justify-around sm:gap-10 gap-6 container">
        {/* Logo */}
        <Link className="mr-auto" href={"/"}>
          <Logo />
        </Link>

        {/* Desktop Links */}
        <div className="links sm:w-2/5 sm:flex justify-around items-center hidden">
          <Link className="text-[1rem]" href={"/"}>
            Features
          </Link>
          <Link className="text-[1rem]" href={"#pricing"}>
            Pricing
          </Link>
          <Link className="text-[1rem]" href={"/"}>
            About
          </Link>
          <div className="text-lg">
            <SignedIn>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-white text-black border-none cursor-pointer">
                    <LayoutDashboard />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-black">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User />
                      <Link href={"dashboard"}>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut />
                      <Link href={"#"}>Logout</Link>
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

        {/* Hamburger Menu for Small Screens */}
        <button
          className="sm:hidden text-black"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu className="size-8" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-white shadow-lg">
          <div className="flex flex-col gap-4 px-6 py-4">
            <Link className="text-[1rem]" href={"/"} onClick={() => setMenuOpen(false)}>
              Features
            </Link>
            <Link className="text-[1rem]" href={"#pricing"} onClick={() => setMenuOpen(false)}>
              Pricing
            </Link>
            <Link className="text-[1rem]" href={"/"} onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <SignedIn>
              <div className="flex flex-col gap-2">
                <Link href={"dashboard"} onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href={"#"} onClick={() => setMenuOpen(false)}>
                  Logout
                </Link>
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button className="w-full">Login</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
}
