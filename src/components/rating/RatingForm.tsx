"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  baseButtonClassName,
  primaryButtonClassName,
  reactions,
} from "@/constants";
import createRating from "@/lib/actions/rating.action";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { IconStar } from "../icons";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
const ratingSchema = z.object({
  content: z.string().min(5, {
    message: "Nội dung phải có ít nhất 5 ký tự",
  }),
});
const RatingForm = ({ courseId }: { courseId: string }) => {
  const { currentUser } = useGlobalStore();
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const handleRating = (rate: number) => {
    setRating(rate);
  };
  const form = useForm<z.infer<typeof ratingSchema>>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      content: "",
    },
  });
  async function onSubmit(values: z.infer<typeof ratingSchema>) {
    if (rating < 1 || rating > 5) {
      toast.error("Vui lòng chọn số sao");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createRating({
        rate: rating,
        content: values.content,
        courseId,
        userId: currentUser?._id,
        path: `/`,
      });
      if (res?.message) {
        toast.error(res.message);
        return;
      }
      toast.success("Đánh giá thành công");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  }
  return (
    <Form {...form}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={cn(
            baseButtonClassName,
            "bg-secondary text-white gap-2 flex ml-auto  button-styles group"
          )}
          onClick={() => setOpen(true)}
        >
          <IconStar className="size-4 group-hover:animate-spin" />
          Đánh giá khóa học
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-extrabold mb-5 text-xl">
              Đánh giá
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-5">
              <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
                <div className="flex items-center gap-5 justify-between mb-5">
                  {reactions.map((reaction) => (
                    <button
                      key={reaction.value}
                      className={cn(
                        "flex flex-col gap-2 text-xs justify-center items-center group font-semibold"
                      )}
                      type="button"
                      onClick={() => setRating(reaction.rating)}
                    >
                      <span
                        className={cn(
                          "size-12 p-2 rounded-full flex items-center justify-center text-sm",
                          rating === reaction.rating
                            ? "bg-[#FEE272]"
                            : "bg-gray-200 dark:bg-gray-100 dark:bg-opacity-10"
                        )}
                      >
                        <Image
                          src={reaction.icon}
                          alt=""
                          width={40}
                          height={40}
                        />
                      </span>
                      <span
                        className={cn(
                          "grayPrimary dark:text-white transition-all group-hover:opacity-100 group-hover:visible"
                        )}
                      >
                        {reaction.value}
                      </span>
                    </button>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Cảm nhận của bạn về khóa học này"
                          className="h-[200px]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <div className="mt-5 flex justify-end">
                  <Button
                    className={cn(primaryButtonClassName, "w-full")}
                    isLoading={isSubmitting}
                  >
                    Gửi
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default RatingForm;
