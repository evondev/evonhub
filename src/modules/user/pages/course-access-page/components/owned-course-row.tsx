import { Button } from "@/components/ui/button";
import { ToneBadge } from "@/shared/components/common";
import { CourseCover } from "@/shared/components/course";
import { MinusCircle } from "lucide-react";
import Link from "next/link";
import { CourseAccessGrant } from "../../../types/course-access.types";
import { buildGrantMeta } from "../../../utils/course-access.utils";

interface OwnedCourseRowProps {
  grant: CourseAccessGrant;
  onRevokeClick: (grant: CourseAccessGrant) => void;
}

export function OwnedCourseRow({ grant, onRevokeClick }: OwnedCourseRowProps) {
  const { course } = grant;
  const grantMeta = buildGrantMeta(grant);
  const hasMetaLine = Boolean(grantMeta) || course.isRetired;

  return (
    <li className="flex min-w-0 items-center gap-3 rounded-xl p-2 sm:gap-4 sm:px-3">
      <CourseCover
        image={course.image}
        sizes="80px"
        className="aspect-video w-20 shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1">
        <Link
          href={`/${course.slug}`}
          className="line-clamp-3 text-pretty text-sm font-medium text-foreground underline-offset-4 hover:underline sm:line-clamp-2"
        >
          {course.title}
        </Link>
        {hasMetaLine && (
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
            {grantMeta && <span className="whitespace-nowrap">{grantMeta}</span>}
            {course.isRetired && (
              <ToneBadge tone="neutral" label="Ngừng bán" className="py-0.5" />
            )}
          </div>
        )}
      </div>
      {/* Thu hồi là cắt quyền học: nền đỏ mờ, luôn hiện. Dưới sm chỉ còn icon */}
      <Button
        type="button"
        variant="destructive"
        aria-label={`Thu hồi khóa ${course.title}`}
        onClick={() => onRevokeClick(grant)}
        className="size-11 shrink-0 px-0 sm:h-10 sm:w-auto sm:px-4"
      >
        <MinusCircle className="size-4 shrink-0" />
        <span className="hidden sm:inline">Thu hồi</span>
      </Button>
    </li>
  );
}
