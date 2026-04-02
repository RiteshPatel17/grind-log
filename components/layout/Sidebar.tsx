"use client";

import Link from "next/link";

// Sidebar for dashboard pages
export default function Sidebar() {
  return (
    <aside className="min-h-screen w-72 border-r border-neutral-800 bg-neutral-950 p-6 text-white">
      <div className="mb-10">
        <h2 className="text-3xl font-bold">
          <span className="text-[#AD49E1]">Grind</span> Log
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Your personal fitness dashboard
        </p>
      </div>

      <nav className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="rounded-xl px-4 py-3 transition hover:bg-neutral-900 hover:text-[#2845D6]"
        >
          Dashboard
        </Link>
        <Link
          href="/workouts"
          className="rounded-xl px-4 py-3 transition hover:bg-neutral-900 hover:text-[#2845D6]"
        >
          Workouts
        </Link>
        <Link
          href="/meals"
          className="rounded-xl px-4 py-3 transition hover:bg-neutral-900 hover:text-[#2845D6]"
        >
          Meals
        </Link>
        <Link
          href="/goals"
          className="rounded-xl px-4 py-3 transition hover:bg-neutral-900 hover:text-[#2845D6]"
        >
          Goals
        </Link>
        <Link
          href="/progress"
          className="rounded-xl px-4 py-3 transition hover:bg-neutral-900 hover:text-[#2845D6]"
        >
          Progress
        </Link>
        <Link
          href="/profile"
          className="rounded-xl px-4 py-3 transition hover:bg-neutral-900 hover:text-[#2845D6]"
        >
          Profile
        </Link>
      </nav>
    </aside>
  );
}