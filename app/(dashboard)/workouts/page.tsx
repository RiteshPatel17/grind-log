// Workouts page
export default function WorkoutsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">
        Workout <span className="text-[#AD49E1]">Logs</span>
      </h1>
      <p className="mt-3 text-neutral-400">
        Add, edit, and manage your workouts here.
      </p>

      <div className="mt-8 rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
        <p className="text-neutral-300">
          Workout form and workout list will go here.
        </p>
      </div>
    </div>
  );
}