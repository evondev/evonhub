import { BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function CourseOwnedNotice() {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-strong">
        <BadgeCheck className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-base font-semibold text-foreground">
          Bạn đã sở hữu khóa học này
        </p>
        <p className="mt-0.5 text-sm text-muted">
          Xem mọi khóa của bạn ở{" "}
          <Link
            href="/study"
            className="font-medium text-primary-strong underline-offset-4 hover:underline"
          >
            Khu vực học tập
          </Link>
        </p>
      </div>
    </div>
  );
}
