"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Workouts", href: "/workouts" },
  { name: "Meals", href: "/meals" },
  { name: "Goals", href: "/goals" },
  { name: "Progress", href: "/progress" },
  { name: "Profile", href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-neutral-800 bg-black px-4 py-3 text-white md:hidden">
        <div>
          <h2 className="text-lg font-bold text-[#AD49E1] sm:text-xl">
            Grind Log
          </h2>
          <p className="text-xs text-neutral-400">Fitness Tracker</p>
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
          className="rounded-xl border border-neutral-700 px-3 py-2 text-sm font-semibold text-white transition hover:border-[#2845D6] hover:text-[#2845D6]"
        >
          {isOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-neutral-800 bg-black p-5 text-white transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 md:p-6
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        {/* Logo — always visible inside sidebar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#AD49E1]">Grind Log</h2>
            <p className="mt-1 text-sm text-neutral-400">Fitness Tracker</p>
          </div>

          {/* Close button visible only on mobile inside sidebar */}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-neutral-400 transition hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition sm:text-base ${
                  isActive
                    ? "bg-[#2845D6] text-white"
                    : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-red-500/40 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 sm:text-base"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}