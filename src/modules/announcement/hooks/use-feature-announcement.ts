"use client";

import { useUserContext } from "@/components/user-context";
import { getUserByIdOptions } from "@/modules/user/services";
import { FEATURE_ANNOUNCEMENT_ID } from "@/shared/constants/announcement.constants";
import { UserInfoData } from "@/shared/types/user.types";
import { isFeatureAnnouncementPending } from "@/shared/utils/announcement.utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { markFeatureAnnouncementSeen } from "../actions";
import { FEATURE_ANNOUNCEMENT_DELAY_MS } from "../constants";

interface UseFeatureAnnouncementProps {
  /** Tắt ở trang học: đang xem video thì không chen hộp vào */
  isEnabled: boolean;
}

/**
 * Hộp giới thiệu tính năng mới: bật đúng một lần cho mỗi người. Ghi "đã xem"
 * lên server ngay lúc bật, nên tải lại trang hay đổi máy cũng không bật lại
 */
export function useFeatureAnnouncement({
  isEnabled,
}: UseFeatureAnnouncementProps) {
  const { userInfo } = useUserContext();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const isPending = isEnabled && isFeatureAnnouncementPending(userInfo);
  const clerkUserId = userInfo?.clerkId || "";

  useEffect(() => {
    if (!isPending) return;

    const openAnnouncementTimer = setTimeout(() => {
      setIsOpen(true);
      markFeatureAnnouncementSeen(FEATURE_ANNOUNCEMENT_ID);

      // Sửa luôn cache user: cả phiên không bật lại, khỏi chờ tải lại hồ sơ.
      // Server lỡ lỗi thì lần tải trang sau mới bật lại, chấp nhận được
      queryClient.setQueryData(
        getUserByIdOptions({ userId: clerkUserId }).queryKey,
        (previousUser: UserInfoData | null | undefined) =>
          previousUser && {
            ...previousUser,
            seenAnnouncements: [
              ...(previousUser.seenAnnouncements ?? []),
              FEATURE_ANNOUNCEMENT_ID,
            ],
          },
      );
    }, FEATURE_ANNOUNCEMENT_DELAY_MS);

    return () => clearTimeout(openAnnouncementTimer);
  }, [isPending, clerkUserId, queryClient]);

  return { isOpen, setIsOpen, username: userInfo?.username };
}
