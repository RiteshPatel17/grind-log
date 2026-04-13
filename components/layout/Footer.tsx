// Footer for public pages
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold">
            <span className="text-[#AD49E1]">Grind</span> Log
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
            Track workouts, meals, goals, and progress in one place.
          </p>
        </div>

        <div className="text-center text-sm leading-6 text-gray-400 md:text-right">
          <p>Built for workout tracking, nutrition, and progress.</p>
          <p className="mt-2">© 2026 Grind Log. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}