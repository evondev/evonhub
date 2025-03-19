"use client";
import { cn, timeAgo } from "@/lib/utils";
import { CommentItemData } from "@/modules/comment/types";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { ObjectId } from "mongoose";
import { useEffect } from "react";
import CommentReply from "./comment-reply";

interface CommentItemProps {
  comment: CommentItemData;
  lessonId: string;
  comments: CommentItemData[];
}

const CommentField = ({
  comment,
  comments = [],
  lessonId,
}: CommentItemProps) => {
  const getRepliesComment = (
    comments: CommentItemData[],
    parentId: string | ObjectId
  ) => {
    return comments.filter(
      (item) => item.parentId?.toString() === parentId.toString()
    );
  };

  const replies = getRepliesComment(comments, comment._id);
  const level = comment.level || 0;
  const COMMENT_SPACING = 55;
  const isPending = comment.status === CommentStatus.Pending;

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
    <>
      <div
        id={comment._id.toString()}
        className={cn("ml-auto flex items-start gap-3 dark:border-opacity-50", {
          "pointer-events-none opacity-50": isPending,
          "mt-5 first:mt-0": level === 0,
        })}
        style={{
          width: `calc(100% - ${level * COMMENT_SPACING}px)`,
        }}
      >
        <div className="borderDarkMode bgDarkMode size-10 shrink-0 rounded-full border">
          <img
            alt={comment.user?.name}
            className="size-full rounded-full object-cover"
            height={40}
            width={40}
            src={
              comment.user?.avatar ||
              "https://images.unsplash.com/photo-1487139975590-b4f1dce9b035?q=80&w=4912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          />
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="mb-1 flex items-center gap-2">
            <h4 className="text-sm font-medium">
              {comment.user?.name || "Anonymous"}
            </h4>
            <span className="size-1 rounded-full bg-gray-500" />
            <span className="text-xs font-medium text-gray-500">
              {timeAgo(comment.createdAt)}
            </span>
          </div>
          <div className="borderDarkMode bgDarkMode rounded-lg border p-5">
            <p className="mb-3 text-sm font-medium leading-relaxed text-gray-600 dark:text-white">
              {comment.content}
            </p>
            {!isPending && (
              <CommentReply comment={comment} lessonId={lessonId} />
            )}
          </div>
        </div>
      </div>
      {replies.length > 0 &&
        replies.map((reply) => (
          <CommentField
            key={reply._id.toString()}
            comment={reply}
            comments={comments}
            lessonId={lessonId}
          />
        ))}
    </>
  );
};

export default CommentField;
