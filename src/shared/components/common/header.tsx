"use client";
import { useUserContext } from "@/components/user-context";
import { commonPath } from "@/constants";
import { useLessonDetailsPath } from "@/shared/hooks";
import { cn } from "@/shared/utils";
import { useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../../../components/ModeToggle";
import Notification from "./notification";

export const Header = () => {
  const { userId, isSignedIn } = useAuth();
  const { userInfo } = useUserContext();
  const { isLessonPage } = useLessonDetailsPath();
  return (
    <div
      className={cn(
        "py-3 px-5 lg:borderDarkMode flex items-center justify-between gap-5 static xl:fixed top-[var(--sidebar-left)] right-[var(--header-right)] z-50 xl:h-16 rounded-xl dark:border-opacity-10 bg-white/50 dark:bg-grayDarker/50 backdrop-blur-md",
        {
          "left-[var(--main-padding)]": isLessonPage,
          "left-[var(--header-left)]": !isLessonPage,
        }
      )}
      id="header"
    >
      <Link
        href="/"
        scroll={false}
        className={cn("flex items-center gap-2", {
          flex: isLessonPage,
          "lg:hidden": !isLessonPage,
        })}
      >
        <div className="bg-primary p-3 rounded-full size-10 flex-shrink-0">
          <Image
            width={48}
            height={48}
            src="/logo.png"
            alt="EvonHub"
            className="object-contain max-h-full max-w-full"
          ></Image>
        </div>
        <span className="text-lg font-bold">evonHub</span>
      </Link>
      <div className="hidden lg:flex items-center gap-2 text-sm lg:text-base font-medium">
        {userInfo?.name && !isLessonPage && (
          <>
            <span>👋</span>
            <div>
              <h3 className="font-semibold text-sm">
                Welcome back, {userInfo?.name}!
              </h3>
              <div className="text-gray-500 text-xs">
                Glad to see you again.
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle />
        {userId && isSignedIn ? (
          <div className="flex items-center gap-3">
            <Notification />
            <UserButton />
          </div>
        ) : (
          <Link
            href={commonPath.LOGIN}
            className="py-3 flex items-center justify-center gap-2 lg:px-5 size-10 lg:w-auto rounded-lg bg-primary text-white font-semibold"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>
            <span className="hidden lg:inline">Đăng nhập</span>
          </Link>
        )}
      </div>
    </div>
  );
};
