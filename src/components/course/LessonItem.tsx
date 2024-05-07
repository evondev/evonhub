"use client";
import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { IconPlay } from "../icons";

const LessonItem = ({
  title,
  url,
  isActive,
}: {
  title: string;
  url?: string;
  isActive?: boolean;
}) => {
  const base = cn(
    "mb-5 pb-5 border-b border-dashed dark:border-b-slate-500 last:pb-0 last:mb-0 last:border-b-0 flex items-center gap-2 dark:text-text5 cursor-pointer",
    isActive ? "text-primary font-bold dark:text-primary" : "font-medium"
  );
  const child = (
    <>
      <IconPlay />
      {title}
    </>
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleChangeLesson = () => {
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "slug",
      value: url || "",
    });
    router.push(newUrl);
  };
  if (url)
    return (
      <div onClick={handleChangeLesson} className={base}>
        {child}
      </div>
    );
  return <div className={base}>{child}</div>;
};

export default LessonItem;
