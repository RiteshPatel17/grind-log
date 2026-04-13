"use client";

import { useState } from "react";
import Link from "next/link";

// Header for public pages
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/80 bg-black/85 text-white backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 md:px-10">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-white transition hover:text-[#AD49E1] sm:text-3xl"
        >
          <span className="text-[#AD49E1]">Grind</span> Log
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-3 md:flex md:gap-6">
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
            className="inline-flex h-11 w-28 items-center justify-center rounded-xl bg-[#2845D6] text-sm font-bold text-white transition duration-200 hover:scale-105 hover:bg-[#1A2CA3] md:h-12 md:w-32 md:text-base"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#2845D6] hover:text-[#2845D6] md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-neutral-800 bg-black px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-neutral-200 transition hover:bg-neutral-900 hover:text-[#2845D6]"
            >
              Home
            </Link>

            <Link
              href="/login"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-neutral-200 transition hover:bg-neutral-900 hover:text-[#2845D6]"
            >
              Login
            </Link>

            <Link
              href="/signup"
              onClick={closeMenu}
              className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#2845D6] text-sm font-bold text-white transition duration-200 hover:bg-[#1A2CA3]"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}