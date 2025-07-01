"use client";
import { useUserContext } from "@/components/user-context";
import { Header, Main, Sidebar } from "@/shared/components/common";
import { MobileNavigation } from "@/shared/components/common/mobile-navigation";
import { UserStatus } from "@/shared/constants/user.constants";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo } = useUserContext();

  if (userInfo?.status === UserStatus.Inactive) return null;

  return (
    <>
      <Header />
      <Main>
        <Sidebar role={userInfo?.role} />
        <section className="px-5 lg:px-8 pb-10 max-w-screen-2xl mx-auto w-full">
          {children}
          <MobileNavigation role={userInfo?.role || ""} />
        </section>
      </Main>
    </>
  );
}
