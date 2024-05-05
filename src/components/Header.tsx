"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

const Header = () => {
  const auth = useAuth();
  return (
    <div className="top py-8 mb-5 flex items-center justify-between gap-5">
      <div className="rounded-full gap-4 h-12 px-5 bg-white dark:bg-grayDark w-[min(100%,390px)] flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent w-full text-sm dark:text-white"
        />
        <button className="text-grayb2">
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
        </button>
      </div>
      <div className="flex items-center gap-5">
        <ModeToggle></ModeToggle>
        {auth?.userId ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <Link
            href="/sign-in"
            className="py-3 flex items-center justify-center gap-2 px-5 h-12 rounded-lg bg-primary text-white font-semibold"
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
            Đăng nhập
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
