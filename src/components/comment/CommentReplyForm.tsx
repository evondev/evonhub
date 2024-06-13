"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { primaryButtonClassName } from "@/constants";
import { replyComment } from "@/lib/actions/comment.action";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
const commentSchema = z.object({
  content: z.string().min(5, {
    message: "Nội dung phải có ít nhất 5 ký tự",
  }),
});
const CommentReplyForm = ({
  data,
  closeForm,
}: {
  data: {
    courseId: string;
    lessonId: string;
    commentId: string;
    path: string;
    userId: string;
  };
  closeForm: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof commentSchema>) {
    setIsSubmitting(true);
    try {
      await replyComment({
        commentId: data.commentId,
        user: {
          userId: data.userId,
          content: values.content,
          courseId: data.courseId,
          lessonId: data.lessonId,
          path: data.path,
        },
      });
      form.reset();
      toast.success("Trả lời của bạn đang được xử lý!");
    } catch (error) {
    } finally {
      setIsSubmitting(false);
      closeForm();
    }
  }

  return (
    <div className="mt-5 pl-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Nhập trả lời của bạn" {...field} />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <div className="flex mt-5 justify-end">
            <Button
              isLoading={isSubmitting}
              className={cn(primaryButtonClassName, "w-[130px] bg-primary")}
            >
              Trả lời
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CommentReplyForm;
