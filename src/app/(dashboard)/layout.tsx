"use client";
import { useUserContext } from "@/components/user-context";
import { Header, Main, Sidebar } from "@/shared/components/common";
import { MobileNavigation } from "@/shared/components/common/mobile-navigation";
import { UserStatus } from "@/shared/constants/user.constants";
import { useLessonDetailsPath } from "@/shared/hooks";
import { cn } from "@/shared/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo } = useUserContext();
  const { isLessonPage } = useLessonDetailsPath();

  if (userInfo?.status === UserStatus.Inactive) return null;

  return (
    <>
      <Header />
      <Main>
        <Sidebar role={userInfo?.role} />
        <section
          className={cn(
            "w-full",
            isLessonPage && "mx-auto max-w-screen-2xl px-5 pb-10 pt-6 lg:px-6",
            // Từ lg: lề 16px, khớp khe giữa sidebar, header và mép màn hình. Wrapper
            // đã chừa 64px, header nổi thì đáy ở 80px nên thêm 16 + 16
            !isLessonPage && "max-w-[1600px] p-4 sm:p-6 lg:p-4 lg:pt-8",
          )}
        >
          {children}
          <MobileNavigation role={userInfo?.role || ""} />
        </section>
      </Main>
    </>
  );
}
