"use client";

import CommentForm from "@/components/comment/CommentForm";
import { CommentItemData } from "@/lib/actions/comment.action";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
              className={cn("font-bold uppercase text-gray-400", {
                underline: isShowReply,
              })}
              onClick={() => setIsShowReply(!isShowReply)}
            >
              Reply
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
