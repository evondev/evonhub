"use client";
import { useUserContext } from "@/components/user-context";
import { Comment } from "@/shared/features/comment";
import { handleCheckMembership } from "@/shared/utils";
import { useSearchParams } from "next/navigation";
import { useQueryLessonById } from "../../services";
import { LessonContent, LessonOutline } from "./components";

export interface LessonDetailsPageProps {}

export function LessonDetailsPage(_props: LessonDetailsPageProps) {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id")?.toString() || "";
  const { data: lessonDetails, isLoading } = useQueryLessonById({
    lessonId,
    enabled: !!lessonId,
  });
  const { userInfo } = useUserContext();
  const userCourses = userInfo?.courses
    ? JSON.parse(JSON.stringify(userInfo?.courses))
    : [];
  const courseDetails = lessonDetails?.courseId;
  const isMembershipActive = handleCheckMembership({
    isMembership: userInfo?.isMembership,
    endDate: userInfo?.planEndDate || new Date().toISOString(),
  });
  const isOwnedCourse =
    (userCourses.includes(courseDetails?._id?.toString()) && userInfo?._id) ||
    isMembershipActive;

  const canAccessContent = !lessonDetails?.trial || isOwnedCourse;

  if (!lessonDetails) return null;
  return (
    <>
      <div className="flex-shrink-0 w-full flex flex-col gap-3">
        <LessonContent
          lessonId={lessonId}
          lessonDetails={lessonDetails}
          isLoading={isLoading}
          canAccessContent={canAccessContent}
        />
        {canAccessContent && <Comment lessonId={lessonId} />}
      </div>
      {canAccessContent && <LessonOutline lessonId={lessonId} />}
    </>
  );
}
