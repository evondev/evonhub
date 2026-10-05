"use client";
import { Button } from "@/components/ui/button";
import { commonPath } from "@/constants";
import { ProductLogo } from "@/shared/components/product-logo";
import { menuLinks } from "@/shared/constants/common.constants";
import { useLessonDetailsPath } from "@/shared/hooks";
import { cn } from "@/shared/utils";
import { useGlobalStore } from "@/store";
import { useAuth, UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../../../components/ModeToggle";
import Notification from "./notification";

// Trang tổng quan, Khóa học, Đơn hàng không có đầu trang riêng nên tên nằm trên
// thanh header (là <h1>). Các trang khác tự có tiêu đề, ghi thêm ở đây sẽ bị lặp.
const HEADER_TITLE_PATHS = ["/", "/explore", "/my-orders"];

export const Header = () => {
  const { userId, isSignedIn } = useAuth();
  const { isLessonPage } = useLessonDetailsPath();
  const { isSidebarCollapsed = false, toggleSidebarCollapsed } =
    useGlobalStore();
  const pathname = usePathname();
  const headerTitle = HEADER_TITLE_PATHS.includes(pathname)
    ? menuLinks.find((link) => link.url === pathname)?.title
    : undefined;
  const isSignedInUser = Boolean(userId && isSignedIn);

  return (
    // Lớp ngoài là dải nền trang phủ khe phía trên thanh, để nội dung cuộn lên
    // không lộ ra giữa mép màn hình và thanh header nổi.
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[left] duration-200 ease-out motion-reduce:transition-none",
        !isLessonPage && "bg-background lg:pl-6 lg:pr-4 lg:pt-4",
        !isLessonPage && isSidebarCollapsed && "lg:left-20",
        !isLessonPage && !isSidebarCollapsed && "lg:left-[272px]",
      )}
      id="header"
    >
      <div
        className={cn(
          "flex h-16 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6",
          !isLessonPage && "lg:rounded-2xl lg:border lg:px-4",
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {!isLessonPage && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                isSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"
              }
              aria-expanded={!isSidebarCollapsed}
              onClick={toggleSidebarCollapsed}
              className="-ml-2 hidden shrink-0 lg:inline-flex"
            >
              {isSidebarCollapsed && <PanelLeftOpen className="size-4" />}
              {!isSidebarCollapsed && <PanelLeftClose className="size-4" />}
            </Button>
          )}
          <Link
            href="/"
            scroll={false}
            className={cn(
              "flex items-center gap-2.5",
              !isLessonPage && "lg:hidden",
            )}
          >
            <ProductLogo />
            <span className="text-base font-semibold text-foreground">
              EvonHub
            </span>
          </Link>
          {headerTitle && !isLessonPage && (
            // Dưới lg thanh header chỉ có logo: tên trang vẫn là <h1> cho trình
            // đọc màn hình, chỉ ẩn khỏi mắt
            <h1 className="min-w-0 text-base font-semibold text-foreground">
              <span className="sr-only lg:hidden">{headerTitle}</span>
              <span className="hidden truncate lg:block">{headerTitle}</span>
            </h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isSignedInUser && (
            <>
              <Notification />
              <div className="grid size-9 place-items-center">
                <UserButton
                  appearance={{ elements: { avatarBox: "size-8" } }}
                />
              </div>
            </>
          )}
          {!isSignedInUser && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-foreground"
            >
              <Link href={commonPath.LOGIN}>Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
