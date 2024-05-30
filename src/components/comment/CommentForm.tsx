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
import { cn } from "@/lib/utils";
import { ICommentParams } from "@/types";
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
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-4 group-hover:translate-x-2 transition-all"
  >
    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
  </svg>
);
const CommentForm = ({
  courseId,
  comments,
  lessonId,
}: {
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

  return (
    <div className="mt-8">
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
                    placeholder="Chia sẻ cảm nghĩ của bạn về bài học này giúp mình nha."
                    className="resize-none min-h-[150px]"
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
                "group w-[125px] gap-2 group"
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
                    courseId,
                    lessonId,
                    userId: comment.user._id,
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
                        courseId,
                        userId: reply.user._id,
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
