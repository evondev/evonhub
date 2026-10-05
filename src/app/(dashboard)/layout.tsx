"use client";
import { useUserContext } from "@/components/user-context";
import { LessonHeader } from "@/modules/lesson/components";
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
      {isLessonPage && <LessonHeader />}
      {!isLessonPage && <Header />}
      <Main>
        <Sidebar role={userInfo?.role} />
        <section
          className={cn(
            "w-full",
            // Trang học bài: video sát mép ở mobile, từ lg mới có lề
            isLessonPage && "mx-auto max-w-screen-2xl pb-10 lg:px-6 lg:pt-6",
            // Từ lg: khe với sidebar 24px (header cũng lùi 24px cho thẳng mép), mép
            // phải 16px như mép màn hình. Wrapper đã chừa 64px, header nổi thì đáy ở
            // 80px nên thêm 16 + 16
            !isLessonPage &&
              "max-w-[1600px] p-4 sm:p-6 lg:pb-4 lg:pl-6 lg:pr-4 lg:pt-8",
          )}
        >
          {children}
          {/* Trang học bài thoát bằng logo trên header, không cần thanh dưới */}
          {!isLessonPage && <MobileNavigation role={userInfo?.role || ""} />}
        </section>
      </Main>
    </>
  );
}
