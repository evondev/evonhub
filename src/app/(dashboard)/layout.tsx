import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId });
  const role = mongoUser?.role;
  return (
    <>
      <main className="grid grid-cols-1 md:grid-cols-[300px,minmax(0,1fr)] min-h-screen">
        <Sidebar role={role}></Sidebar>
        <section className="px-5 md:px-10 pb-10">
          <Header></Header>
          {children}
        </section>
      </main>
    </>
  );
}
