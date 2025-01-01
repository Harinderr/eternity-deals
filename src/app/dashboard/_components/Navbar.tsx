'use client'
import Logo from "@/components/Logo";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-10 bg-white/95 px-6 py-4 shadow-md">
      <nav className="flex items-center justify-between container">
        {/* Logo */}
        <Link href={"/"}>
          <Logo />
        </Link>

        {/* Hamburger Menu for Small Screens */}
        <button
          className="sm:hidden text-black"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div
          className={`sm:flex items-center gap-6 ${
            menuOpen
              ? "absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col py-4"
              : "hidden"
          }`}
        >
          <Link
            className="text-lg px-4 py-2 sm:p-0 hover:bg-gray-100 sm:hover:bg-transparent"
            href={"/dashboard"}
            onClick={() => setMenuOpen(false)}
          >
            Products
          </Link>
          <Link
            className="text-lg px-4 py-2 sm:p-0 hover:bg-gray-100 sm:hover:bg-transparent"
            href={`/dashboard/analytics?product=AllProducts&time=last7Days`}
            onClick={() => setMenuOpen(false)}
          >
            Analytics
          </Link>
          <Link
            className="text-lg px-4 py-2 sm:p-0 hover:bg-gray-100 sm:hover:bg-transparent"
            href={"/dashboard/subscriptions"}
            onClick={() => setMenuOpen(false)}
          >
            Subscriptions
          </Link>
          <div className="px-4 py-2">
            <UserButton />
          </div>
        </div>

     
      </nav>
    </header>
  );
}
