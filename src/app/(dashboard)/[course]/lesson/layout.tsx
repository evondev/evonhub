import CommentLoadingSkeleton from "@/components/loading/CommentLoadingSkeleton";
import LessonContentSkeleton from "@/components/loading/LessonContentSkeleton";
import PlayerLoadingSkeleton from "@/components/loading/PlayerLoadingSkeleton";
import React, { Suspense } from "react";

const layout = ({
  player,
  rating,
  content,
  comment,
}: {
  player: React.ReactNode;
  rating: React.ReactNode;
  content: React.ReactNode;
  comment: React.ReactNode;
}) => {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 items-start transition-all"
      id="lesson-study"
    >
      <div>
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
        <div id="lesson-content-aside">{content}</div>
      </Suspense>
    </div>
  );
};

export default layout;
