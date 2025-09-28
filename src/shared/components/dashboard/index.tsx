"use client";

import { useUserContext } from "@/components/user-context";
import { CourseItem } from "@/modules/course/components";
import { useQueryCourses } from "@/modules/course/services";
import { useQueryLeaderboard } from "@/modules/score/services/data/query-leaderboard.data";
import { useQueryUserCourseContinue } from "@/modules/user/services";
import { CourseStatus } from "@/shared/constants/course.constants";
import Link from "next/link";
import { LeaderboardItem } from "../common";
import { CourseItemResume } from "../course";
import { CourseList } from "../course-list";
import { CourseResumeList } from "../course/course-resume-list";
import { IconLongArrowRight } from "../icons";
import { LeaderboardItemLoading } from "../loading";

export interface DashboardPageProps {}

export default function DashboardPage(_props: DashboardPageProps) {
  const { userInfo, isFetchingUser } = useUserContext();
  const userId = userInfo?.clerkId.toString() || "";
  const { data: dataCourse, isFetching: isFetchingUserCourses } =
    useQueryUserCourseContinue({
      userId,
    });

  const userCourses = dataCourse?.courses || [];
  const userLessons = dataCourse?.lessons || [];

  const { data: courses, isFetching } = useQueryCourses({
    status: CourseStatus.Approved,
    limit: 4,
    isFree: false,
    isAll: false,
    shouldFilterEnrolled: true,
  });

  const { data: leaderboardData, isFetching: isFetchingLeaderboard } =
    useQueryLeaderboard({ limit: 5 });

  if (isFetchingUser)
    return (
      <div className="h-full flex items-center justify-center">
        <div className="size-10 border-4 border-primary animate-spin border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="flex flex-col xl:grid grid-cols-[minmax(0,1fr),300px] gap-8">
      <div className="flex flex-col gap-8">
        <section className="p-5 rounded-xl bg-primary text-white">
          <h1 className="font-bold lg:text-2xl">
            {userInfo?.name && (
              <>Chào mừng đã quay trở lại, {userInfo?.name} 👋</>
            )}
            {!userInfo?.name && <>Welcome to EvonHub 👋</>}
          </h1>
        </section>
        <section>
          <div className="flex items-center gap-3 justify-between mb-5">
            <h2 className="font-bold text-lg lg:text-2xl">Khóa học</h2>
            <Link
              href="/study"
              className="font-bold text-primary capitalize text-sm lg:text-base"
            >
              Xem tất cả
            </Link>
          </div>
          {userCourses.length === 0 && !isFetchingUserCourses && (
            <div className="flex items-center flex-col gap-2">
              <h2 className="text-3xl">🫠</h2>
              <h2 className="font-extrabold text-xl lg:text-3xl">404</h2>
              <div className="font-medium">Not found any courses</div>
            </div>
          )}
          <CourseResumeList isLoading={isFetchingUserCourses}>
            {userCourses?.map((course, index) => (
              <CourseItemResume
                key={course._id}
                image={course.image}
                title={course.title}
                courseId={course._id}
                slug={course.slug}
                lesson={userLessons[index]}
              />
            ))}
          </CourseResumeList>
        </section>
        <section>
          <div className="flex items-center gap-3 justify-between mb-5">
            <h2 className="font-bold text-lg lg:text-2xl">Đề xuất</h2>
            <Link
              href="/explore"
              className="font-bold text-primary capitalize text-sm lg:text-base"
            >
              Xem tất cả
            </Link>
          </div>
          <CourseList isLoading={isFetching}>
            {courses?.map((course, index) => (
              <CourseItem key={index} data={course}></CourseItem>
            ))}
          </CourseList>
        </section>
      </div>
      <div className="flex flex-col gap-8">
        <div className="p-5 rounded-xl bgDarkMode flex flex-col gap-5">
          <h3 className="font-bold text-base lg:text-lg">Leaderboard</h3>
          <div className="flex flex-col gap-5">
            {isFetchingLeaderboard && (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <LeaderboardItemLoading key={index} />
                ))}
              </>
            )}
            {!isFetchingLeaderboard &&
              leaderboardData?.map((board, index) => (
                <LeaderboardItem
                  key={board.user._id}
                  user={board.user}
                  score={board.score}
                  index={index}
                  rank={index + 1}
                />
              ))}
          </div>
          <Link
            href="/leaderboard"
            className="font-bold text-primary inline-flex items-center gap-2"
          >
            <span>Xem tất cả</span>
            <IconLongArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
