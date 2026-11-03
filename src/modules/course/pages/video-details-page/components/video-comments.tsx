"use client";

import { commonPath } from "@/constants";
import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Link from "next/link";
import CourseSection from "../../course-details-page/components/course-section";

// Cuộn tới khu bình luận mới cần form (react-hook-form, zod, editor)
const Comment = dynamic(() =>
  import("@/shared/features/comment").then(
    (commentModule) => commentModule.Comment,
  ),
);

export interface VideoCommentsProps {
  lessonId: string;
  slug: string;
}

/** Video miễn phí ai cũng xem được, nhưng bình luận cần đăng nhập */
export function VideoComments({ lessonId, slug }: VideoCommentsProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const signInHref = `${commonPath.LOGIN}?redirect_url=${encodeURIComponent(`/video/${slug}`)}`;

  return (
    <CourseSection title="Bình luận">
      {isLoaded && isSignedIn && <Comment lessonId={lessonId} />}
      {isLoaded && !isSignedIn && (
        <p className="rounded-2xl border border-border bg-surface px-4 py-6 text-center text-sm text-muted">
          <Link
            href={signInHref}
            className="font-medium text-primary-strong underline-offset-4 hover:underline"
          >
            Đăng nhập
          </Link>{" "}
          để xem và viết bình luận
        </p>
      )}
    </CourseSection>
  );
}
