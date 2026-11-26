"use client";

import { useUserContext } from "@/components/user-context";
import { getUserByIdOptions } from "@/modules/user/services";
import { FEATURE_ANNOUNCEMENT_ID } from "@/shared/constants/announcement.constants";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { UserInfoData } from "@/shared/types/user.types";
import { isFeatureAnnouncementPending } from "@/shared/utils/announcement.utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchAnnouncedVideo, markFeatureAnnouncementSeen } from "../actions";
import { FEATURE_ANNOUNCEMENT_DELAY_MS } from "../constants";
import {
  hasSeenAnnouncementLocally,
  markAnnouncementSeenLocally,
} from "../utils";

interface UseFeatureAnnouncementProps {
  /** Tắt ở trang học: đang xem video thì không chen hộp vào */
  isEnabled: boolean;
}

/**
 * Hộp giới thiệu video mới: bật đúng một lần cho mỗi người. Ghi "đã xem" ngay
 * lúc bật (server lẫn localStorage), nên đóng, bấm "Để sau", tải lại trang hay
 * đổi máy đều không bật lại. Chỉ tải video khi người này còn chưa xem; không lấy
 * được video thì không bật và cũng không ghi "đã xem"
 */
export function useFeatureAnnouncement({
  isEnabled,
}: UseFeatureAnnouncementProps) {
  const { userInfo } = useUserContext();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const isPending = isEnabled && isFeatureAnnouncementPending(userInfo);
  const clerkUserId = userInfo?.clerkId || "";
  const { data: video } = useQuery({
    queryKey: [QUERY_KEYS.GET_ANNOUNCED_VIDEO],
    queryFn: () => fetchAnnouncedVideo(),
    enabled: isPending,
    staleTime: Infinity,
  });
  const isVideoReady = Boolean(video);

  useEffect(() => {
    if (!isPending || !isVideoReady) return;

    // localStorage đọc trong effect: server không có, đọc lúc render sẽ lệch hydrate
    if (hasSeenAnnouncementLocally(clerkUserId)) return;

    const openAnnouncementTimer = setTimeout(() => {
      setIsOpen(true);
      markAnnouncementSeenLocally(clerkUserId);
      markFeatureAnnouncementSeen(FEATURE_ANNOUNCEMENT_ID);

      // Sửa luôn cache user: cả phiên không bật lại, khỏi chờ tải lại hồ sơ
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
  }, [isPending, isVideoReady, clerkUserId, queryClient]);

  return { isOpen, setIsOpen, video };
}
