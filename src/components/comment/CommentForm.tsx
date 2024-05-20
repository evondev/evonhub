"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { primaryButtonClassName } from "@/constants";
import { createComment } from "@/lib/actions/comment.action";
import { createReaction } from "@/lib/actions/reaction.action";
import { cn } from "@/lib/utils";
import { ICommentParams } from "@/types";
import { EReactionType } from "@/types/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import CommentItem from "./CommentItem";
const commentSchema = z.object({
  content: z.string().min(2, {
    message: "Nội dung phải có ít nhất 2 ký tự",
  }),
});

const IconSend = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-4 group-hover:translate-x-1 transition-all"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
    />
  </svg>
);
const CommentForm = ({
  userId,
  courseId,
  comments,
  lessonId,
}: {
  userId: string;
  courseId: string;
  comments: ICommentParams[];
  lessonId: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });
  const searchParams = useSearchParams();
  const path = `/lesson?slug=${searchParams?.get("slug")}`;

  async function onSubmit(values: z.infer<typeof commentSchema>) {
    setIsSubmitting(true);

    try {
      await createComment({
        content: values.content,
        user: userId,
        course: courseId,
        lesson: lessonId,
        path,
      });
      toast.success("Bình luận của bạn sẽ hiển thị sau khi được kiểm duyệt");
      // reset form
      form.reset();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleReaction = async (reaction: EReactionType) => {
    try {
      const res = await createReaction({
        type: reaction,
        userId,
        lessonId,
        path: `/lesson?slug=${searchParams?.get("slug")}`,
      });
      if (res?.type === "error") {
        return toast.error(res.message);
      }
      toast.success(`Bạn đã đánh giá ${reaction} cho bài học này`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mt-8">
      {/* <ReactLesson
        handleReaction={handleReaction}
        lessonId={lessonId}
        userId={userId}
      ></ReactLesson> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Viết bình luận của bạn..."
                    className="resize-none min-h-[200px]"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <div className="flex mt-5 justify-end">
            <Button
              isLoading={isSubmitting}
              className={cn(
                primaryButtonClassName,
                "group w-[120px] gap-2 group"
              )}
            >
              Gửi {IconSend}
            </Button>
          </div>
        </form>
      </Form>
      <div className="mt-8">
        <div className="flex flex-col gap-8">
          {comments
            .filter((c) => !c.parentId)
            .map((comment) => (
              <div key={comment._id.toString()}>
                <CommentItem
                  comment={comment}
                  data={{
                    userId,
                    courseId,
                    lessonId,
                    path,
                  }}
                ></CommentItem>
                {comments
                  .filter((c) => c.parentId === comment._id)
                  .map((reply) => (
                    <CommentItem
                      key={reply._id.toString()}
                      comment={reply}
                      data={{
                        userId,
                        courseId,
                        lessonId,
                        path,
                      }}
                      isChild
                    ></CommentItem>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
