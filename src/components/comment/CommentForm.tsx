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
import { useTheme } from "next-themes";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import ReactLesson from "../reaction/ReactLesson";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import CommentReplyForm from "./CommentReplyForm";
const commentSchema = z.object({
  content: z.string().min(10, {
    message: "Nội dung phải có ít nhất 10 ký tự",
  }),
});
const IconTime = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
    />
  </svg>
);
const IconReply = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
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

  async function onSubmit(values: z.infer<typeof commentSchema>) {
    setIsSubmitting(true);

    try {
      await createComment({
        content: values.content,
        user: userId,
        course: courseId,
        lesson: lessonId,
        path: `/lesson?slug=${searchParams?.get("slug")}`,
      });
      toast.success("Cám ơn bạn đã khen bài học này");
      // reset form
      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor && editor?.setContent("");
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }
  const { theme } = useTheme();
  const editorRef = useRef(null);

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
      <ReactLesson
        handleReaction={handleReaction}
        lessonId={lessonId}
        userId={userId}
      ></ReactLesson>
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
              className={cn(primaryButtonClassName, "group w-[150px]")}
            >
              Gửi lời khen
            </Button>
          </div>
        </form>
      </Form>
      <div className="mt-8">
        <div className="flex flex-col gap-8">
          {comments.map((comment) => (
            <div
              key={comment._id.toString()}
              className="flex items-start gap-3"
            >
              <Image
                src={comment.user.avatar}
                alt=""
                width={80}
                height={80}
                className="rounded-full size-10 flex-shrink-0 object-cover"
              />
              <div>
                <h3 className="font-bold mb-1 text-lg">
                  {comment.user.username}
                </h3>
                <div
                  className="mb-4"
                  dangerouslySetInnerHTML={{
                    __html: comment.content,
                  }}
                ></div>
                <div className="text-xs text-slate-600 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {IconTime}
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    {IconReply}
                    <button>Trả lời</button>
                  </div>
                </div>
                <CommentReplyForm />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
