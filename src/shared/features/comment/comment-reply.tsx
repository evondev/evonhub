"use client";

import { Button } from "@/components/ui/button";
import { CommentItemData } from "@/modules/comment/types";
import { MAX_REPLY_LEVEL } from "@/shared/constants/comment.constants";
import { Reply } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "./comment-form";

interface CommentReplyProps {
  comment: CommentItemData;
  lessonId: string;
}

const CommentReply = ({ comment, lessonId }: CommentReplyProps) => {
  const [isShowReply, setIsShowReply] = useState(false);
  const canReply = comment.level <= MAX_REPLY_LEVEL;

  if (!canReply) return null;

  return (
    <>
      {/* -ml-2: nút ghost đứng đầu hàng giữa cột chữ, bù padding để chữ
          "Trả lời" thẳng cột với nội dung bình luận phía trên */}
      <Button
        type="button"
        variant="ghost"
        aria-expanded={isShowReply}
        className="-ml-2 mt-1 h-8 gap-1.5 rounded-lg px-2"
        onClick={() => setIsShowReply(!isShowReply)}
      >
        <Reply className="size-4" />
        Trả lời
      </Button>
      {isShowReply && (
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
