"use client";
import { IconLongArrowLeft, IconLongArrowRight } from "@/shared/components";
import { cn } from "@/shared/utils";
import Link from "next/link";

export interface PlayerNavigationProps {
  action: "prev" | "next";
  lessonId: string;
}

export function PlayerNavigation({ action, lessonId }: PlayerNavigationProps) {
  return (
    <Link
      scroll={false}
      href={`?id=${lessonId}`}
      className={cn(
        "flex lg:opacity-0 lg:invisible group-hover:opacity-100 group-hover:visible size-10 rounded items-center bg-primary lg:bg-white justify-center static lg:absolute top-1/2 lg:-translate-y-1/2 z-10 hover:!bg-primary text-white lg:text-current hover:!text-white transition-all dark:bg-grayDarker",
        action === "prev" ? "left-5" : "right-5"
      )}
    >
      {action === "next" ? <IconLongArrowRight /> : <IconLongArrowLeft />}
    </Link>
  );
}
