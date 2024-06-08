"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import ButtonGradient from "./button/ButtonGradient";
import Notification from "./noti/Notification";

const IconSearch = (
  <svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx={11}
      cy="10.5"
      r="8.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 17L19.5 20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Header = ({ notifications }: { notifications: any[] }) => {
  const auth = useAuth();
  return (
    <div className="top py-3 px-5 bg-white dark:bg-grayDarker flex items-center justify-between gap-5 static xl:fixed top-0 left-[300px] right-0 z-50 xl:h-16">
      <Link href="/" className="flex items-center gap-2 lg:hidden">
        <ButtonGradient
          className={{
            wrapper: "rounded-full size-12 flex-shrink-0",
            main: "p-3.5",
          }}
        >
          <Image
            width={40}
            height={40}
            src="/logo.png"
            alt="EvonHub"
            className="object-contain max-w-full brightness-0 dark:brightness-100"
          ></Image>
        </ButtonGradient>
        <span className="text-lg font-bold">evonHub</span>
      </Link>
      <div className="rounded-full gap-4 h-10 px-5 bg-white dark:bg-grayDark w-[min(100%,390px)] items-center lg:flex hidden border border-gray-200 dark:border-opacity-10">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent w-full text-sm dark:text-white"
        />
        <button className="text-grayb2">{IconSearch}</button>
      </div>
      <div className="flex items-center gap-3">
        <ModeToggle></ModeToggle>
        {auth?.userId ? (
          <div className="flex items-center gap-3">
            <Notification notifications={notifications}></Notification>

            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <Link
            href="/sign-in"
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

export default Header;
