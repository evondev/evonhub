import PageNotFound from "@/app/not-found";
import LessonDesktopAside from "@/components/lesson/LessonDesktopAside";
import LessonLayout from "@/components/lesson/LessonLayout";
import LessonToggle from "@/components/lesson/LessonToggle";
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
    <LessonLayout>
      <div className="lg:overflow-hidden lg:p-2 flex-shrink-0 w-full">
        <Suspense fallback={<PlayerLoadingSkeleton />}>{player}</Suspense>
        {/* <Suspense
          fallback={
            <div className="h-12 skeleton w-[120px] mb-8 ml-auto rounded-lg"></div>
          }
        >
          {rating}
        </Suspense> */}
        {/* <Suspense fallback={<CommentLoadingSkeleton />}>{comment}</Suspense> */}
      </div>
      <Suspense fallback={<LessonContentSkeleton />}>
        <LessonToggle></LessonToggle>
        <LessonDesktopAside>{content}</LessonDesktopAside>
      </Suspense>
    </LessonLayout>
  );
};

export default layout;
