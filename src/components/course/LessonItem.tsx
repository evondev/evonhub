import { cn } from "@/lib/utils";
import Link from "next/link";
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
    "mb-5 pb-5 border-b border-dashed last:pb-0 last:mb-0 last:border-b-0 font-medium flex items-center gap-2 dark:text-text5",
    isActive ? "text-primary font-bold dark:text-primary" : ""
  );
  const child = (
    <>
      <IconPlay />
      {title}
    </>
  );
  if (url)
    return (
      <Link href={`/lesson/${url}`} className={base}>
        {child}
      </Link>
    );
  return <div className={base}>{child}</div>;
};

export default LessonItem;
