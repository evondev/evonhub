"use client";

import { useUserContext } from "@/components/user-context";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FEEDBACK_PROMPT_DELAY_MS } from "../constants";
import {
  getMyFeedbackStatusOptions,
  useQueryMyFeedbackStatus,
} from "../services";
import { MyFeedbackStatus } from "../types";
import { hasShownFeedbackPrompt, markFeedbackPromptShown } from "../utils";

/**
 * Trạng thái mở hộp góp ý. Chưa góp ý lần nào thì tự bật một lần mỗi phiên
 * (mỗi tab), gửi rồi thì thôi hẳn. Nút trên header vẫn mở lại được bất cứ lúc nào.
 */
export function useFeedbackPrompt() {
  const { userInfo } = useUserContext();
  const userId = userInfo?._id ? String(userInfo._id) : "";
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { data: feedbackStatus } = useQueryMyFeedbackStatus({ userId });
  // Lỗi tải thì data là undefined: không bật, thà bỏ lỡ còn hơn bật nhầm người đã gửi
  const shouldPrompt = feedbackStatus?.hasSubmitted === false;

  useEffect(() => {
    if (!shouldPrompt || hasShownFeedbackPrompt()) return;

    const openPromptTimer = setTimeout(() => {
      markFeedbackPromptShown();
      setIsOpen(true);
    }, FEEDBACK_PROMPT_DELAY_MS);

    return () => clearTimeout(openPromptTimer);
  }, [shouldPrompt]);

  function handleSubmitted() {
    const submittedStatus: MyFeedbackStatus = { hasSubmitted: true };

    queryClient.setQueryData(
      getMyFeedbackStatusOptions({ userId }).queryKey,
      submittedStatus,
    );
    setIsOpen(false);
  }

  return { isOpen, setIsOpen, handleSubmitted };
}
