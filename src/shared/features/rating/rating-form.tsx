"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { reactions } from "@/constants";
import createRating from "@/lib/actions/rating.action";
import {
  DEFAULT_RATING,
  reactionLabels,
} from "@/shared/constants/rating.constants";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { cn } from "@/shared/utils";
import { toggleRatingSuggestion } from "@/shared/utils/rating.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Textarea } from "../../../components/ui/textarea";
import { RatingSuggestionTags } from "./rating-suggestion-tags";
import { useRatingPrompt } from "./use-rating-prompt";

const ratingSchema = z.object({
  content: z.string().min(5, {
    message: "Nội dung phải có ít nhất 5 ký tự",
  }),
});

export interface RatingFormProps {
  courseId: string;
  courseTitle?: string;
  userId: string;
  /** Tiến độ học (%) để tự mở hộp đánh giá khi đủ ngưỡng */
  progressPercent: number;
  /** Gọi tên thứ được đánh giá trong nút và hộp: "khóa học", "video" */
  subjectLabel?: string;
}

function getReactionOptionClassName(isSelected: boolean) {
  return cn(
    "flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-1 py-3 text-center transition-colors",
    // Đang chọn: viền nhấn + ring mờ, như ô nhập đang focus
    isSelected && "border-primary ring-2 ring-primary/10",
    !isSelected && "border-border-strong hover:bg-button-hover",
  );
}

// Còn đánh giá được thì nút nổi bật để mời, đánh giá rồi thì về dạng viền
function getTriggerClassName(canRate: boolean) {
  return cn(
    "h-9 rounded-xl px-3 max-md:w-9 max-md:px-0",
    canRate && "shadow-sm shadow-primary/30",
  );
}

export function RatingForm({
  courseId,
  courseTitle,
  userId,
  progressPercent,
  subjectLabel = "khóa học",
}: RatingFormProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(DEFAULT_RATING);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { canRate, isOpen, setIsOpen } = useRatingPrompt({
    courseId,
    userId,
    progressPercent,
  });

  const form = useForm<z.infer<typeof ratingSchema>>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      content: "",
    },
  });
  const content = form.watch("content");

  function handleToggleSuggestion(suggestion: string) {
    form.setValue("content", toggleRatingSuggestion(content, suggestion), {
      shouldValidate: form.formState.isSubmitted,
    });
  }

  async function onSubmit(values: z.infer<typeof ratingSchema>) {
    if (rating < 1 || rating > 5) {
      toast.error(`Vui lòng chọn mức đánh giá cho ${subjectLabel}`);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createRating({
        rate: rating,
        content: values.content,
        courseId,
        path: `/`,
      });
      if (response?.message) {
        toast.error(response.message);
        return;
      }
      toast.success(`Cám ơn bạn đã đánh giá ${subjectLabel}!`);
      form.reset();
      setRating(DEFAULT_RATING);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CAN_RATE_COURSE, courseId],
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={canRate ? "primary" : "outline"}
          title={`Đánh giá ${subjectLabel}`}
          className={getTriggerClassName(canRate)}
        >
          <Star
            className={cn(
              "size-4 shrink-0",
              canRate && "fill-amber-300 text-amber-300",
            )}
          />
          <span className="max-md:sr-only">Đánh giá {subjectLabel}</span>
        </Button>
      </DialogTrigger>
      {/* Neo đỉnh, không căn giữa dọc. Có ô nhập nên bấm ra ngoài không đóng */}
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="top-16 w-[calc(100%-2rem)] translate-y-0 gap-0 rounded-2xl border-border bg-surface p-6 sm:top-[8vh] sm:rounded-2xl"
      >
        <DialogHeader className="pr-10 text-left">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Đánh giá {subjectLabel}
          </DialogTitle>
          {courseTitle && (
            <DialogDescription className="mt-2 text-pretty text-sm/6 text-muted">
              {courseTitle}
            </DialogDescription>
          )}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            autoComplete="off"
            className="mt-6 flex flex-col gap-6"
          >
            <fieldset>
              <legend className="text-sm font-medium text-foreground">
                Bạn thấy {subjectLabel} thế nào?
              </legend>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {reactions.map((reaction) => (
                  <label
                    key={reaction.value}
                    className={getReactionOptionClassName(
                      rating === reaction.rating,
                    )}
                  >
                    <input
                      type="radio"
                      name="rating"
                      value={reaction.rating}
                      checked={rating === reaction.rating}
                      onChange={() => setRating(reaction.rating)}
                      className="sr-only"
                    />
                    <Image
                      src={reaction.icon}
                      alt=""
                      width={36}
                      height={36}
                      className="size-9 object-contain"
                    />
                    <span className="text-xs/4 font-medium text-foreground">
                      {reactionLabels[reaction.value]}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Cảm nhận của bạn
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Điều bạn thích, điều nên làm tốt hơn…"
                      className="mt-2 block min-h-28 resize-y border-border-strong bg-surface px-3 py-2.5 text-base font-normal !leading-6 text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 md:text-sm"
                    />
                  </FormControl>
                  <RatingSuggestionTags
                    rating={rating}
                    content={content}
                    onToggle={handleToggleSuggestion}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="h-11 md:h-10">
                  Huỷ
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="h-11 md:h-10"
              >
                Gửi đánh giá
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
