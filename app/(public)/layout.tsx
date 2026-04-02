import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Public layout for landing page and other public pages
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}