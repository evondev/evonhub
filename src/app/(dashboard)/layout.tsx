"use client";
import { useUserContext } from "@/components/user-context";
// Import thẳng từ file: barrel của chat kéo theo code của trang chat
import { ChatHostBubble } from "@/modules/chat/components/chat-host-bubble";
import { CHAT_HOST_ROLES } from "@/modules/chat/constants/chat-role.constants";
import { useChatActivity } from "@/modules/chat/hooks/use-chat-activity";
import { LessonHeaderPlaceholder } from "@/modules/lesson/components/lesson-header-placeholder";
// Import thẳng từ file: barrel common kéo cả 26 component (bảng, dialog, phân trang)
// vào layout của mọi trang
import { Header } from "@/shared/components/common/header";
import { Main } from "@/shared/components/common/main";
import { Sidebar } from "@/shared/components/common/sidebar";
import { MobileNavigation } from "@/shared/components/common/mobile-navigation";
import {
  CHAT_PATH,
  IS_CHAT_ENABLED,
} from "@/shared/constants/common.constants";
import { UserStatus } from "@/shared/constants/user.constants";
import { useLessonDetailsPath } from "@/shared/hooks/use-lesson-details-path";
import { cn } from "@/shared/utils";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Tải lười, chỉ ở client:
// - Trang khác không phải tải RatingForm, form, zod theo header trang học.
// - Header gắn vào sau khi trang học đã đổ dữ liệu prefetch từ server vào cache
//   (HydrationBoundary), nên dùng lại cache thay vì tự gọi lại khóa, bài, lịch sử.
const LessonHeader = dynamic(
  () =>
    import("@/modules/lesson/components/lesson-header").then(
      (lessonHeaderModule) => lessonHeaderModule.LessonHeader,
    ),
  { ssr: false, loading: () => <LessonHeaderPlaceholder /> },
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userInfo } = useUserContext();
  const { isLessonPage } = useLessonDetailsPath();
  const pathname = usePathname();
  // Gọi một lần ở đây cho cả sidebar lẫn thanh dưới: hai nơi tự gọi thì hỏi
  // server gấp đôi. Trang học không có menu nên tắt; chat đang tạm tắt cũng vậy
  const { menuSignal: chatSignal, host: chatHost } = useChatActivity({
    userId: userInfo?._id ? String(userInfo._id) : "",
    isOnChatPage: pathname === CHAT_PATH,
    isEnabled: IS_CHAT_ENABLED && !isLessonPage,
  });
  // Admin không cần lời mời vào phòng của chính mình
  const isChatHostViewer = CHAT_HOST_ROLES.includes(userInfo?.role || "");

  if (userInfo?.status === UserStatus.Inactive) return null;

  return (
    <>
      {isLessonPage && <LessonHeader />}
      {!isLessonPage && <Header />}
      <Main>
        <Sidebar role={userInfo?.role} chatSignal={chatSignal} />
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
          {!isLessonPage && (
            <MobileNavigation
              role={userInfo?.role || ""}
              chatSignal={chatSignal}
            />
          )}
          {IS_CHAT_ENABLED && chatHost && !isChatHostViewer && (
            <ChatHostBubble host={chatHost} />
          )}
        </section>
      </Main>
    </>
  );
}
