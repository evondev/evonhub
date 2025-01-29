"use client";

import { createComment } from "@/lib/actions/comment.action";
import { cn } from "@/lib/utils";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { getQueryClient } from "@/shared/libs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import { Textarea } from "../../../components/ui/textarea";
import { useUserContext } from "../../../components/user-context";

const courseCommentFormSchema = z.object({
  content: z
    .string({
      message: "Vui lòng nhập bình luận",
    })
    .min(10, { message: "Nhập tối thiểu 10 kí tự" })
    .max(250, { message: "Nhập tối đa 250 kí tự" }),
});
type CourseCommentFormValues = z.infer<typeof courseCommentFormSchema>;

interface CommentFormProps {
  lessonId: string;
  comment?: any;
  isReply?: boolean;
  closeReply?: () => void;
}
export function CommentForm({
  closeReply,
  comment,
  isReply,
  lessonId,
}: CommentFormProps) {
  const { userInfo } = useUserContext();
  const userId = userInfo?._id.toString() || "";
  const isModerator = userInfo?.role === UserRole.Admin || UserRole.Expert;

  const commentForm = useForm<CourseCommentFormValues>({
    resolver: zodResolver(courseCommentFormSchema),
    defaultValues: {},
  });
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const id = useSearchParams().get("id");
  const path = `${pathname}?id=${id}`;

  const queryClient = getQueryClient();
  async function onSubmit(values: CourseCommentFormValues) {
    const hasComment = await createComment({
      content: values.content,
      lesson: lessonId,
      user: userId,
      level: comment && comment?.level >= 0 ? comment?.level + 1 : 0,
      parentId: comment?._id,
      status: isModerator ? CommentStatus.Approved : CommentStatus.Pending,
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
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.GET_COMMENTS_BY_LESSON, lessonId],
    });
  }

  return (
    <div className="hidden lg:block">
      <Form {...commentForm}>
        <form
          autoComplete="off"
          className="relative flex flex-col gap-5 p-3 lg:p-0"
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
            className={cn("ml-auto h-12 w-[140px] rounded-lg", {
              "w-24": isReply,
            })}
          >
            {isReply ? "Trả lời" : "Đăng bình luận"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
