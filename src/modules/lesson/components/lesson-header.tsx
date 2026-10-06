"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { commonPath } from "@/constants";
import { useCourseProgress } from "@/modules/lesson/hooks";
import Notification from "@/shared/components/common/notification";
import { ProductLogo } from "@/shared/components/product-logo";
import { RatingForm } from "@/shared/features/rating";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LessonProgress } from "./lesson-progress";

export interface LessonHeaderProps {}

// Header riêng của trang học bài: thay header chung, nói đang học khóa nào và
// đã học tới đâu. Cố định trên cùng như header chung (wrapper đã chừa 64px).
export function LessonHeader(_props: LessonHeaderProps) {
  const params = useParams();
  const { userId, isSignedIn } = useAuth();
  const isSignedInUser = Boolean(userId && isSignedIn);
  const courseSlug = params.course?.toString() || "";
  const { courseDetails, completedCount, totalCount, percent } =
    useCourseProgress(courseSlug);
  // Khách học thử chưa đăng nhập: không có tiến độ, không đánh giá được
  const hasProgress = isSignedInUser && totalCount > 0;

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <Link
        href="/"
        aria-label="EvonHub, về trang chủ"
        className="flex shrink-0 items-center"
      >
        <ProductLogo />
      </Link>
      <span
        aria-hidden="true"
        className="hidden h-5 w-px shrink-0 bg-border-strong sm:block"
      />
      <div className="min-w-0 flex-1">
        {courseDetails && (
          <Link
            href={`/course/${courseSlug}`}
            className="block truncate py-2 text-sm font-semibold text-foreground hover:underline sm:text-base"
          >
            {courseDetails.title}
          </Link>
        )}
        {!courseDetails && (
          <div className="h-3 w-48 animate-pulse rounded-full bg-foreground/5 motion-reduce:animate-none" />
        )}
      </div>

      {hasProgress && (
        <LessonProgress
          completedCount={completedCount}
          totalCount={totalCount}
          percent={percent}
          variant="inline"
          className="hidden shrink-0 lg:flex"
        />
      )}

      <div className="flex shrink-0 items-center gap-1.5">
        {isSignedInUser && courseDetails?._id && (
          <RatingForm
            courseId={courseDetails._id.toString()}
            courseTitle={courseDetails.title}
          />
        )}
        <div className="hidden sm:block">
          <ModeToggle />
        </div>
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
}
