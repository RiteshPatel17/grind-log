// Footer for public pages
export default function Footer() {
  return (
    <footer className="mt-28 border-t border-neutral-800 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold tracking-tight">
              <span className="text-[#AD49E1]">Grind</span> Log
            </h3>
            <p className="mt-3 text-sm leading-7 text-neutral-400 md:text-base">
              Track workouts, meals, goals, and progress in one place.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-neutral-400 md:items-end">
            <p>Built for workout tracking, nutrition, and progress.</p>
            <p>© 2026 Grind Log. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}