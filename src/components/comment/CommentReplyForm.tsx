"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { baseButtonClassName } from "@/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
const commentSchema = z.object({
  content: z.string().min(10, {
    message: "Nội dung phải có ít nhất 10 ký tự",
  }),
});
const CommentReplyForm = () => {
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
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-5 hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Nhập bình luận của bạn" {...field} />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <div className="flex mt-5 justify-end">
            <Button
              isLoading={isSubmitting}
              className={cn(
                baseButtonClassName,
                "text-primary bg-white dark:bg-grayDarker"
              )}
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
