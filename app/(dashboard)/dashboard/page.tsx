export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
            GrindLog
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-base text-gray-300">
            Welcome to your dashboard. This is where your workout stats,
            activity, goals, and progress will show up.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <p className="text-sm text-gray-400">Workouts This Week</p>
            <h2 className="mt-3 text-3xl font-semibold">0</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <p className="text-sm text-gray-400">Current Streak</p>
            <h2 className="mt-3 text-3xl font-semibold">0 days</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <p className="text-sm text-gray-400">Calories Burned</p>
            <h2 className="mt-3 text-3xl font-semibold">0</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <p className="text-sm text-gray-400">Active Goals</p>
            <h2 className="mt-3 text-3xl font-semibold">0</h2>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg lg:col-span-2">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
            <p className="mt-3 text-gray-300">
              No activity yet. Start logging workouts to see your recent
              sessions here.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <h3 className="text-xl font-semibold">Quick Actions</h3>
            <div className="mt-4 flex flex-col gap-3">
              <button className="rounded-xl bg-white px-4 py-3 font-medium text-black transition hover:opacity-90">
                Log Workout
              </button>
              <button className="rounded-xl border border-white/15 px-4 py-3 font-medium text-white transition hover:bg-white/10">
                Set Goal
              </button>
              <button className="rounded-xl border border-white/15 px-4 py-3 font-medium text-white transition hover:bg-white/10">
                View Progress
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}