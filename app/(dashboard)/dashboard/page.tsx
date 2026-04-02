// Dashboard page
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">
        Welcome to your <span className="text-[#AD49E1]">Dashboard</span>
      </h1>
      <p className="mt-3 text-neutral-400">
        View your fitness summary, recent activity, and progress here.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-lg font-semibold text-[#2845D6]">Calories</h2>
          <p className="mt-3 text-3xl font-bold">2,150</p>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-lg font-semibold text-[#2845D6]">Weight</h2>
          <p className="mt-3 text-3xl font-bold">78.4 kg</p>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-lg font-semibold text-[#2845D6]">Workouts</h2>
          <p className="mt-3 text-3xl font-bold">5 this week</p>
        </div>
      </div>
    </div>
  );
}