import Sidebar from "@/components/layout/Sidebar";

// Layout for dashboard pages
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white md:flex">
      {/* Sidebar handles its own mobile and desktop behavior */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 p-4 sm:p-5 md:p-8">
        {children}
      </main>
    </div>
  );
}