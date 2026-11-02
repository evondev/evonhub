"use client";

import { useQueryCanRateCourse } from "@/modules/rating/services";
import { RATING_PROMPT_PERCENT } from "@/shared/constants/rating.constants";
import {
  hasShownRatingPrompt,
  markRatingPromptShown,
} from "@/shared/utils/rating.utils";
import { useEffect, useState } from "react";

interface UseRatingPromptProps {
  courseId: string;
  userId: string;
  progressPercent: number;
}

/**
 * Trạng thái mở hộp đánh giá. Đã mua khóa, học tới RATING_PROMPT_PERCENT mà chưa đánh giá
 * thì tự mở, mỗi khóa chỉ một lần trên máy này để không làm phiền.
 */
export function useRatingPrompt({
  courseId,
  userId,
  progressPercent,
}: UseRatingPromptProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: canRate = false } = useQueryCanRateCourse({
    courseId,
    userId,
  });
  const hasReachedPromptPercent = progressPercent >= RATING_PROMPT_PERCENT;
  const shouldPrompt = canRate && hasReachedPromptPercent;

  useEffect(() => {
    if (!shouldPrompt || hasShownRatingPrompt(userId, courseId)) return;

    markRatingPromptShown(userId, courseId);
    setIsOpen(true);
  }, [shouldPrompt, userId, courseId]);

  return { canRate, isOpen, setIsOpen };
}
