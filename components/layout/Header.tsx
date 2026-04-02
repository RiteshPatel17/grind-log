"use client";

import Link from "next/link";

// Header for public pages
export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/80 bg-black/85 text-white backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight text-white transition hover:text-[#AD49E1]"
        >
          <span className="text-[#AD49E1]">Grind</span> Log
        </Link>

        {/* Right side navigation */}
        <div className="flex items-center gap-3 md:gap-6">
          <nav className="flex items-center gap-4 text-sm font-medium md:gap-6 md:text-base">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-neutral-200 transition hover:bg-neutral-900 hover:text-[#2845D6]"
            >
              Home
            </Link>

            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-neutral-200 transition hover:bg-neutral-900 hover:text-[#2845D6]"
            >
              Login
            </Link>
          </nav>

          <Link
            href="/signup"
            className="inline-flex h-11 w-32 items-center justify-center rounded-xl bg-[#2845D6] text-sm font-bold text-black shadow-[0_0_20px_rgba(163,230,53,0.18)] transition duration-200 hover:scale-105 hover:bg-[#1A2CA3] md:h-12 md:w-36 md:text-base"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}