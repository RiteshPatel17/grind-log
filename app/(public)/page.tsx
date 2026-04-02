import Link from "next/link";

// Landing page for Grind Log
export default function HomePage() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-24 pb-32 text-center">
        <p className="mb-6 rounded-full border border-[#AD49E1]/40 bg-[#AD49E1]/10 px-5 py-2 text-sm font-medium text-[#AD49E1]">
          Modern fitness tracking made simple
        </p>

        <h1 className="max-w-5xl text-5xl font-extrabold leading-tight md:text-7xl">
          Track your <span className="text-[#2845D6]">workouts</span>, meals,
          and progress in one place
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-300 md:text-xl">
          Grind Log helps users manage workout logs, meal tracking, goals, and
          weight progress with a clean and modern dark-mode dashboard.
        </p>

        {/* Hero Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-5">
          <Link
            href="/signup"
            className="inline-flex h-16 min-w-[220px] items-center justify-center rounded-2xl bg-[#2845D6] px-10 text-xl font-bold text-black shadow-[0_0_30px_rgba(163,230,53,0.25)] transition duration-200 hover:scale-105 hover:bg-0F828C"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="inline-flex h-16 min-w-[220px] items-center justify-center rounded-2xl border border-neutral-600 bg-neutral-900 px-10 text-xl font-bold text-white transition duration-200 hover:scale-105 hover:border-[#2845D6] hover:text-[#2845D6]"
            >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 pb-44">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold md:text-5xl">
            Everything you need to stay consistent
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Built for workout tracking, meal tracking, goals, and progress.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-[#AD49E1]">
              Workout Logging
            </h3>
            <p className="mt-4 leading-7 text-neutral-300">
              Save exercises, sets, reps, duration, and notes in one clean
              place.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-0F828C">
              Meal Tracking
            </h3>
            <p className="mt-4 leading-7 text-neutral-300">
              Search foods and store daily nutrition records with a simple
              workflow.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-lime-400">
              Progress Charts
            </h3>
            <p className="mt-4 leading-7 text-neutral-300">
              Track calories and weight progress over time using clear visual
              charts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}