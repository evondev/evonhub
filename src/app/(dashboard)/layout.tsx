import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  // if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId: userId || "" });
  const role = mongoUser?.role;
  return (
    <AuthProvider
      initialUser={mongoUser ? JSON.parse(JSON.stringify(mongoUser)) : {}}
    >
      <main className="grid grid-cols-1 xl:w-[calc(100%-300px)] overflow-hidden ml-auto min-h-screen relative items-start">
        <Sidebar role={role}></Sidebar>
        <section className="px-5 lg:px-8 pb-10">
          <Header></Header>
          {children}
          <Navigation role={role}></Navigation>
        </section>
      </main>
    </AuthProvider>
  );
}
