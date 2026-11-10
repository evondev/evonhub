"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createFeedback } from "../actions";
import { FEEDBACK_TEXT_MAX_LENGTH } from "../constants";
import { feedbackFormSchema } from "../schemas";
import { FeedbackFormValues } from "../types";
import { FeedbackEnglishField } from "./feedback-english-field";

interface FeedbackFormProps {
  onSubmitted: () => void;
  onCancel: () => void;
}

const inputClassName =
  "mt-2 border-border-strong bg-surface px-3 text-base font-normal text-foreground placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 md:text-sm";

const labelClassName = "text-sm font-medium text-foreground";

/** Khoá học muốn học, tiếng Anh giao tiếp, tính năng muốn có. Trả lời một câu là gửi được */
export function FeedbackForm({ onSubmitted, onCancel }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      courseWish: "",
      featureWish: "",
      wantsEnglish: undefined,
    },
  });

  async function handleSubmit(values: FeedbackFormValues) {
    setIsSubmitting(true);

    try {
      const result = await createFeedback(values);

      if (!result.isSuccess) {
        toast.error(result.message || "Chưa gửi được, thử lại sau nhé");
        return;
      }

      toast.success("Cảm ơn bạn đã góp ý!");
      onSubmitted();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        autoComplete="off"
        className="mt-6 flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="courseWish"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>
                Bạn muốn học khoá gì tiếp theo?
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  maxLength={FEEDBACK_TEXT_MAX_LENGTH}
                  placeholder="Ví dụ: NestJS, Docker, làm dự án với AI…"
                  className={inputClassName}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="wantsEnglish"
          render={({ field }) => (
            <FeedbackEnglishField
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <FormField
          control={form.control}
          name="featureWish"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>
                Bạn muốn EvonHub có thêm tính năng gì?
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  maxLength={FEEDBACK_TEXT_MAX_LENGTH}
                  placeholder="Ví dụ: ghi chú trong bài học, bài tập cuối chương…"
                  className={inputClassName}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="h-11 md:h-10"
          >
            Để sau
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="h-11 md:h-10"
          >
            Gửi góp ý
          </Button>
        </div>
      </form>
    </Form>
  );
}
