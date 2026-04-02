// Profile page
export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold">
        Your <span className="text-[#AD49E1]">Profile</span>
      </h1>
      <p className="mt-3 text-neutral-400">
        Manage your account and personal fitness details here.
      </p>

      <div className="mt-8 rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
        <p className="text-neutral-300">
          Profile details and profile form will go here.
        </p>
      </div>
    </div>
  );
}