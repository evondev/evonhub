"use client";

import { cn } from "@/lib/utils";
import { CommentItemData } from "@/modules/comment/types";
import { useState } from "react";
import { CommentForm } from "./comment-form";

interface CommentReplyProps {
  comment: CommentItemData;
  lessonId: string;
}

const CommentReply = ({ comment, lessonId }: CommentReplyProps) => {
  const [isShowReply, setIsShowReply] = useState(false);

  return (
    <>
      <div className="flex items-center gap-5 text-sm font-medium text-gray-400">
        {comment.level <= 3 && (
          <>
            <button
              type="button"
              className={cn("font-bold text-gray-400", {
                underline: isShowReply,
              })}
              onClick={() => setIsShowReply(!isShowReply)}
            >
              Trả lời
            </button>
          </>
        )}
      </div>
      {!!isShowReply && (
        <div className="mt-3">
          <CommentForm
            isReply
            closeReply={() => setIsShowReply(false)}
            comment={comment}
            lessonId={lessonId}
          />
        </div>
      )}
    </>
  );
};

export default CommentReply;
