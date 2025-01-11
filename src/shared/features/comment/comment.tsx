"use client";

import { useQueryCommentsByLesson } from "@/modules/comment/services";
import CommentField from "./comment-field";
import { CommentForm } from "./comment-form";

export interface CommentProps {
  lessonId: string;
}

export function Comment({ lessonId }: CommentProps) {
  const { data: comments } = useQueryCommentsByLesson({
    lessonId,
  });
  const rootComments = comments?.filter((item) => !item.parentId);

  return (
    <div>
      <CommentForm lessonId={lessonId}></CommentForm>
      {!!rootComments && rootComments?.length > 0 && (
        <div className="mt-10 hidden lg:flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <span>Comments</span>
              <span className="flex items-center justify-center rounded-full bg-primary px-4 py-0.5 text-sm font-semibold text-white">
                {comments?.length}
              </span>
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            {rootComments?.map((item) => (
              <CommentField
                key={item._id.toString()}
                comment={item}
                comments={comments || []}
                lessonId={lessonId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
