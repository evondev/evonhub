import PageNotFound from "@/app/not-found";
import CommentLoadingSkeleton from "@/components/loading/CommentLoadingSkeleton";
import LessonContentSkeleton from "@/components/loading/LessonContentSkeleton";
import PlayerLoadingSkeleton from "@/components/loading/PlayerLoadingSkeleton";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import React, { Suspense } from "react";
export const maxDuration = 60;

const layout = async ({
  player,
  rating,
  content,
  comment,
  params,
}: {
  player: React.ReactNode;
  rating: React.ReactNode;
  content: React.ReactNode;
  comment: React.ReactNode;
  params: {
    course: string;
  };
}) => {
  const { userId } = auth();
  if (!userId) return <PageNotFound />;
  const findUser = await getUserById({ userId });
  if (!findUser) return <PageNotFound />;
  if (
    findUser &&
    !findUser.courses.map((course: any) => course.slug).includes(params.course)
  )
    return <PageNotFound />;
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,400px)] gap-0 lg:gap-8 items-start transition-all relative"
      id="lesson-study"
    >
      <div className="lg:overflow-hidden lg:p-2">
        <Suspense fallback={<PlayerLoadingSkeleton />}>{player}</Suspense>
        <Suspense
          fallback={
            <div className="h-12 skeleton w-[120px] mb-8 ml-auto rounded-lg"></div>
          }
        >
          {rating}
        </Suspense>
        <Suspense fallback={<CommentLoadingSkeleton />}>{comment}</Suspense>
      </div>
      <Suspense fallback={<LessonContentSkeleton />}>
        <div
          id="lesson-content-aside"
          className="mt-2 sticky top-10 xl:top-[112px] right-0"
        >
          {content}
        </div>
      </Suspense>
    </div>
  );
};

export default layout;
