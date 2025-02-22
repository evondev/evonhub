"use client";
import PageNotFound from "@/app/not-found";
import { useUserContext } from "@/components/user-context";
import { useQueryCourseBySlug } from "@/modules/course/services";
import { UserRole } from "@/shared/constants/user.constants";
import { cn, handleCheckMembership } from "@/shared/utils";
import { useGlobalStore } from "@/store";
import { useParams, useSearchParams } from "next/navigation";
import { useQueryLessonById } from "../../services";
import { LoadingLessonDetails } from "./components";

export interface DetailsPageLayoutProps {
  children: React.ReactNode;
}

export function DetailsPageLayout({ children }: DetailsPageLayoutProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const { isExpanded } = useGlobalStore();
  const { userInfo } = useUserContext();
  const userCourses = userInfo?.courses
    ? JSON.parse(JSON.stringify(userInfo?.courses))
    : [];
  const { data: courseDetails } = useQueryCourseBySlug({
    courseSlug: params.course as string,
  });
  const courseId = courseDetails?._id?.toString();
  const isOwnedCourse = userCourses.includes(courseId) && userInfo?._id;
  const lessonId = searchParams.get("id")?.toString() || "";
  const { data: lessonDetails, isLoading } = useQueryLessonById({
    lessonId,
    enabled: !!isOwnedCourse && !!lessonId,
  });
  const isMembership = handleCheckMembership({
    isMembership: userInfo?.isMembership,
    endDate: userInfo?.planEndDate || new Date().toISOString(),
  });
  if (isLoading) return <LoadingLessonDetails />;
  if (!lessonDetails) return <PageNotFound />;

  if (!isOwnedCourse && userInfo?.role !== UserRole.Admin && !isMembership)
    return <LoadingLessonDetails />;
  return (
    <div
      className={cn(
        "-mt-8 lg:mt-0 flex flex-col lg:grid overflow-hidden lg:overflow-visible h-[calc(100svh-140px)] sm:h-auto grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,400px)] gap-0 lg:gap-8 items-start transition-all relative -mx-5 -mb-7 lg:mb-0 lg:mx-0",
        isExpanded ? "!flex !gap-5" : "lg:grid"
      )}
    >
      {children}
    </div>
  );
}
