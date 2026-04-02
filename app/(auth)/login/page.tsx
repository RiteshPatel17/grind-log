"use client";

import Link from "next/link";

// Login page
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Welcome Back to <span className="text-[#AD49E1]">Grind Log</span>
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            Login to continue your fitness journey.
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#2845D6] px-4 py-3 font-bold text-white transition hover:bg-[#1A2CA3]"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#AD49E1] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}