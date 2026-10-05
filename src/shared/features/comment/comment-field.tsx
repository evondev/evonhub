"use client";
import { timeAgo } from "@/lib/utils";
import { CommentItemData } from "@/modules/comment/types";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { cn } from "@/shared/utils";
import { useGlobalStore } from "@/store";
import { useEffect } from "react";
import { CommentAvatar } from "./comment-avatar";
import CommentReply from "./comment-reply";

interface CommentItemProps {
  comment: CommentItemData;
  lessonId: string;
  comments: CommentItemData[];
  parentName?: string;
}

// Từ tầng 2 trở đi, màn hẹp không thụt thêm (cột chữ còn quá hẹp), thay bằng
// dòng "Trả lời <tên>" ở đầu bình luận
function getRepliesClassName(level: number) {
  return cn(
    "mt-3 ml-4 space-y-4 border-l border-border-strong pl-3",
    level >= 1 && "max-sm:ml-0 max-sm:border-l-0 max-sm:pl-0",
  );
}

const CommentField = ({
  comment,
  comments = [],
  lessonId,
  parentName,
}: CommentItemProps) => {
  const { userRole } = useGlobalStore();

  const replies = comments.filter(
    (item) => item.parentId?.toString() === comment._id.toString(),
  );
  const level = comment.level || 0;
  const isPending =
    comment.status === CommentStatus.Pending && userRole !== UserRole.Admin;
  const authorName = comment.user?.name || "Ẩn danh";
  const createdAt = new Date(comment.createdAt);

  useEffect(() => {
    const hash = window.location.hash;
    const id = hash.replace("#", "");
    if (!id) return;

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <li id={comment._id.toString()}>
      <div className={cn("flex gap-3", isPending && "opacity-60")}>
        <CommentAvatar name={comment.user?.name} avatar={comment.user?.avatar} />
        <div className="min-w-0 flex-1">
          {level >= 2 && parentName && (
            <p className="text-xs text-muted sm:hidden">
              Trả lời <span className="font-medium">{parentName}</span>
            </p>
          )}
          <p className="flex min-h-8 flex-wrap items-center gap-x-1 text-sm">
            <span className="font-medium text-foreground">{authorName}</span>
            <time
              dateTime={createdAt.toISOString()}
              title={createdAt.toLocaleString("vi-VN")}
              className="text-xs text-muted"
            >
              · {timeAgo(comment.createdAt)}
            </time>
            {isPending && (
              <span className="text-xs text-muted">· Đang chờ duyệt</span>
            )}
          </p>
          <p className="whitespace-pre-line text-pretty break-words text-sm/6 text-foreground">
            {comment.content}
          </p>
          {!isPending && <CommentReply comment={comment} lessonId={lessonId} />}
        </div>
      </div>

      {replies.length > 0 && (
        <ul className={getRepliesClassName(level)}>
          {replies.map((reply) => (
            <CommentField
              key={reply._id.toString()}
              comment={reply}
              comments={comments}
              lessonId={lessonId}
              parentName={authorName}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default CommentField;
