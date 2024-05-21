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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
const commentSchema = z.object({
  content: z.string().min(2, {
    message: "Nội dung phải có ít nhất 2 ký tự",
  }),
});
const CommentReplyForm = ({
  data,
}: {
  data: {
    courseId: string;
    lessonId: string;
    commentId: string;
    path: string;
  };
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
      await createComment({
        content: values.content,
        course: data.courseId,
        lesson: data.lessonId,
        path: data.path,
        parentId: data.commentId,
      });
      form.reset();
      toast.success("Trả lời của bạn sẽ được hiển thị sau khi được duyệt");
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-5">
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
              className={cn(primaryButtonClassName, "w-[120px] bg-secondary")}
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
