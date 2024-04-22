import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="grid grid-cols-1 md:grid-cols-[300px,minmax(0,1fr)] min-h-screen">
        <Sidebar></Sidebar>
        <section className="px-5 md:px-10 pb-10">
          <Header></Header>
          {children}
        </section>
      </main>
    </>
  );
}
