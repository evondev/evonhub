"use client";
import { Button } from "@/components/ui/button";
import { commonPath } from "@/constants";
import { menuLinks } from "@/shared/constants/common.constants";
import { useLessonDetailsPath } from "@/shared/hooks";
import { cn } from "@/shared/utils";
import { useGlobalStore } from "@/store";
import { useAuth, UserButton } from "@clerk/nextjs";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../../../components/ModeToggle";
import Notification from "./notification";

// Chỉ trang tổng quan không có đầu trang riêng nên tên nằm trên thanh header
// (là <h1>). Các trang khác tự có tiêu đề, ghi thêm ở đây sẽ bị lặp.
const HEADER_TITLE_PATHS = ["/"];

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
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface px-4 transition-[left] duration-200 ease-out motion-reduce:transition-none sm:px-6",
        !isLessonPage && isSidebarCollapsed && "lg:left-16",
        !isLessonPage && !isSidebarCollapsed && "lg:left-64",
      )}
      id="header"
    >
      <div className="flex min-w-0 items-center gap-2">
        {!isLessonPage && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={isSidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
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
          <Image
            width={32}
            height={32}
            src="/logo-main.png"
            alt=""
            className="size-8 object-contain"
          />
          <span className="text-base font-semibold text-foreground">
            EvonHub
          </span>
        </Link>
        {headerTitle && !isLessonPage && (
          <h1 className="hidden truncate text-base font-semibold text-foreground lg:block">
            {headerTitle}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        {isSignedInUser && (
          <>
            <Notification />
            <div className="grid size-9 place-items-center">
              <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
            </div>
          </>
        )}
        {!isSignedInUser && (
          <Button asChild variant="ghost" size="sm" className="text-foreground">
            <Link href={commonPath.LOGIN}>Đăng nhập</Link>
          </Button>
        )}
      </div>
    </header>
  );
};
