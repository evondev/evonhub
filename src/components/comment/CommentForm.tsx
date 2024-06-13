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
  content: z.string().min(5, {
    message: "Nội dung phải có ít nhất 5 ký tự",
  }),
});

const CommentForm = ({
  course,
  comments,
  lessonId,
}: {
  course: {
    _id: string;
    slug: string;
  };
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
        course: course._id,
        lesson: lessonId,
        path,
      });
      toast.success("Bình luận của bạn đang được xử lý!");
      // reset form
      form.reset();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-8 hidden lg:block">
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
                "group w-[130px] gap-2 group"
              )}
            >
              Đăng bình luận
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
                    courseId: course._id,
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
                        courseId: course._id,
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
