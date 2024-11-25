"use client";

import { createComment } from "@/lib/actions/comment.action";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useUserContext } from "../user-context";

const courseCommentFormSchema = z.object({
  content: z
    .string({
      message: "Vui lòng nhập chuỗi",
    })
    .min(10, { message: "Nhập tối thiểu 10 kí tự" }),
});
type CourseCommentFormValues = z.infer<typeof courseCommentFormSchema>;

interface CommentFormProps {
  lessonId: string;
  comment?: any;
  isReply?: boolean;
  closeReply?: () => void;
}
const CommentForm = ({
  closeReply,
  comment,
  isReply,
  lessonId,
}: CommentFormProps) => {
  const { userInfo } = useUserContext();
  const userId = userInfo?._id.toString() || "";

  const commentForm = useForm<CourseCommentFormValues>({
    resolver: zodResolver(courseCommentFormSchema),
    defaultValues: {},
  });
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const slug = useSearchParams().get("slug");
  const path = `${pathname}?slug=${slug}`;

  async function onSubmit(values: CourseCommentFormValues) {
    const hasComment = await createComment({
      content: values.content,
      lesson: lessonId,
      user: userId,
      level: comment && comment?.level >= 0 ? comment?.level + 1 : 0,
      parentId: comment?._id,
      path,
    });

    startTransition(() => {
      if (!hasComment) {
        toast.error("Vui lòng thử lại sau!");

        return;
      }
      toast.success("Đăng bình luận thành công");
      commentForm.setValue("content", "");
      closeReply?.();
    });
  }

  return (
    <>
      <Form {...commentForm}>
        <form
          autoComplete="off"
          className="relative flex flex-col gap-5"
          onSubmit={commentForm.handleSubmit(onSubmit)}
        >
          <FormField
            control={commentForm.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Nhập bình luận..."
                    className={cn("min-h-[150px]", {
                      "bg-gray-50": isReply,
                    })}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            isLoading={isPending}
            type="submit"
            variant="primary"
            className={cn("ml-auto h-10 w-[140px] rounded-lg", {
              "w-24": isReply,
            })}
          >
            {isReply ? "Trả lời" : "Đăng bình luận"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CommentForm;
