import Sidebar from "@/components/layout/Sidebar";

// Dashboard layout for protected pages
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}