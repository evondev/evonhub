import AuthProvider from "@/components/AuthProvider";
import EmptyData from "@/components/EmptyData";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { getNotificationByUser } from "@/lib/actions/notification.action";
import { getUserById } from "@/lib/actions/user.action";
import { EUserStatus } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId: userId || "" });
  const notifications = await getNotificationByUser(mongoUser?._id.toString());

  const role = mongoUser?.role;
  if (mongoUser?.status === EUserStatus.INACTIVE)
    return (
      <EmptyData
        text="Your account is inactive. Please contact the administrator to activate your account."
        url="https://fb.com/tuan.trananh.0509"
      />
    );
  return (
    <AuthProvider
      initialUser={mongoUser ? JSON.parse(JSON.stringify(mongoUser)) : {}}
    >
      <>
        <Header
          notifications={
            notifications ? JSON.parse(JSON.stringify(notifications)) : []
          }
        ></Header>
        <main className="grid grid-cols-1 pt-8 xl:pt-0 xl:w-[calc(100%-300px)] ml-auto lg:min-h-screen relative items-start">
          <Sidebar role={role}></Sidebar>
          <section className="px-5 lg:px-8 pb-5 lg:pb-10">
            {children}
            <Navigation role={role}></Navigation>
          </section>
        </main>
      </>
    </AuthProvider>
  );
}
