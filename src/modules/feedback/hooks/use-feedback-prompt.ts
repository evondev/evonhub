"use client";

import { useUserContext } from "@/components/user-context";
import { isFeatureAnnouncementPending } from "@/shared/utils/announcement.utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  FEEDBACK_PROMPT_DELAY_MS,
  IS_FEEDBACK_AUTO_PROMPT_ENABLED,
} from "../constants";
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
  // Hộp giới thiệu tính năng mới sắp bật: nhường cả phiên này, không bật hai
  // hộp liền nhau. Phiên sau (tab mới) mới hỏi góp ý
  const isAnnouncementPending = isFeatureAnnouncementPending(userInfo);

  useEffect(() => {
    if (!IS_FEEDBACK_AUTO_PROMPT_ENABLED) return;

    if (!shouldPrompt || hasShownFeedbackPrompt()) return;

    if (isAnnouncementPending) {
      markFeedbackPromptShown();
      return;
    }

    const openPromptTimer = setTimeout(() => {
      markFeedbackPromptShown();
      setIsOpen(true);
    }, FEEDBACK_PROMPT_DELAY_MS);

    return () => clearTimeout(openPromptTimer);
  }, [shouldPrompt, isAnnouncementPending]);

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
