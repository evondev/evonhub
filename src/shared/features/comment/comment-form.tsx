"use client";

import { createComment } from "@/lib/actions/comment.action";
import { CommentItemData } from "@/modules/comment/types";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { getQueryClient } from "@/shared/libs";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { CommentAvatar } from "./comment-avatar";

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
  comment?: CommentItemData;
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
  const isModerator =
    userInfo?.role === UserRole.Admin || userInfo?.role === UserRole.Expert;

  const commentForm = useForm<CourseCommentFormValues>({
    resolver: zodResolver(courseCommentFormSchema),
    defaultValues: { content: "" },
  });
  const [isPending, startTransition] = useTransition();
  const content = commentForm.watch("content") || "";
  const isContentEmpty = !content.trim();

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
    <Form {...commentForm}>
      <form
        autoComplete="off"
        className="flex gap-3"
        onSubmit={commentForm.handleSubmit(onSubmit)}
      >
        {/* Ô gốc có avatar từ sm; ô trả lời bỏ avatar để ô viết đủ rộng */}
        {!isReply && (
          <CommentAvatar
            name={userInfo?.name}
            avatar={userInfo?.avatar}
            className="max-sm:hidden"
          />
        )}
        <div className="min-w-0 flex-1">
          <FormField
            control={commentForm.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    aria-label={isReply ? "Trả lời bình luận" : "Bình luận"}
                    placeholder={
                      isReply
                        ? "Viết câu trả lời…"
                        : "Hỏi hoặc chia sẻ về bài này…"
                    }
                    rows={3}
                    autoFocus={isReply}
                    className="block min-h-24 resize-y border-border-strong bg-surface px-3 py-2.5 text-base font-normal !leading-6 text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 md:text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-3 flex justify-end gap-3">
            {isReply && (
              <Button
                type="button"
                variant="secondary"
                className="h-11 md:h-10"
                onClick={closeReply}
              >
                Huỷ
              </Button>
            )}
            <Button
              isLoading={isPending}
              type="submit"
              variant="primary"
              disabled={isContentEmpty}
              className="h-11 md:h-10"
            >
              {isReply ? "Trả lời" : "Đăng bình luận"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
