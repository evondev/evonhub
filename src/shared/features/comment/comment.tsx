"use client";

import { Button } from "@/components/ui/button";
import { useQueryCommentsByLesson } from "@/modules/comment/services";
import { RotateCw } from "lucide-react";
import CommentField from "./comment-field";
import { CommentForm } from "./comment-form";

export interface CommentProps {
  lessonId: string;
}

// Khu bình luận của bài: ô viết ở đầu, danh sách bên dưới. Số bình luận đã
// nằm trên tab nên khu này không có tiêu đề riêng.
export function Comment({ lessonId }: CommentProps) {
  const {
    data: comments = [],
    isLoading,
    isError,
    refetch,
  } = useQueryCommentsByLesson({ lessonId });
  const rootComments = comments.filter((item) => !item.parentId);
  const isEmpty = !isLoading && rootComments.length === 0;

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-10 text-center"
      >
        <p className="text-sm font-medium text-red-600">
          Không tải được bình luận
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RotateCw className="size-4" />
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <CommentForm lessonId={lessonId} />

      {isLoading && (
        <div aria-busy="true" className="mt-6 space-y-6 border-t border-border pt-6">
          <div className="flex gap-3">
            <div className="skeleton size-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="skeleton h-3 w-1/3 rounded-full" />
              <div className="skeleton h-3 w-4/5 rounded-full" />
            </div>
          </div>
          <span className="sr-only" role="status">
            Đang tải bình luận
          </span>
        </div>
      )}

      {isEmpty && (
        <p className="py-6 text-center text-sm text-muted">
          Chưa có bình luận nào
        </p>
      )}

      {rootComments.length > 0 && (
        <ul className="mt-6 space-y-6 border-t border-border pt-6">
          {rootComments.map((item) => (
            <CommentField
              key={item._id.toString()}
              comment={item}
              comments={comments}
              lessonId={lessonId}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
