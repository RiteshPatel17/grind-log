"use client";

import Link from "next/link";

// Signup page
export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Create your <span className="text-[#AD49E1]">Grind Log</span> account
          </h1>
          <p className="mt-3 text-sm text-neutral-400">
            Start tracking workouts, meals, goals, and progress.
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
            />
          </div>

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
              placeholder="Create a password"
              className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white outline-none transition focus:border-[#2845D6]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#2845D6] px-4 py-3 font-bold text-white transition hover:bg-[#1A2CA3]"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#AD49E1] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}