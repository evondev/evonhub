"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserContext } from "@/components/user-context";
import { markNotificationsSeen } from "@/modules/notifications/actions";
import {
  NotificationList,
  NotificationListSkeleton,
} from "@/modules/notifications/components";
import { NOTIFICATION_PANEL_SIDE_OFFSET } from "@/modules/notifications/constants";
import {
  getNotificationsByUserOptions,
  useQueryNotificationsByUser,
} from "@/modules/notifications/services/data/query-notifications-by-user";
import { isNotificationUnread } from "@/modules/notifications/utils";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, BellDot } from "lucide-react";
import { useState } from "react";

const Notification = () => {
  const { userInfo } = useUserContext();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const userId = userInfo?._id || "";

  const { data: feed, isPending } = useQueryNotificationsByUser({
    userId,
    enabled: !!userInfo?._id,
  });

  const notifications = feed?.notifications;
  const seenAt = feed?.seenAt ?? null;
  const unreadCount =
    notifications?.filter((notification) =>
      isNotificationUnread(notification.createdAt, seenAt),
    ).length ?? 0;
  // Action trả undefined khi lỗi, không ném ra, nên tải xong mà không có dữ liệu là lỗi
  const hasLoadFailed = !isPending && !feed;

  // Đóng panel mới ghi mốc đã xem: lúc đang mở vẫn thấy cái nào mới.
  // Mốc là thông báo mới nhất đang hiện, không phải giờ hiện tại.
  async function markLatestNotificationSeen() {
    const latestCreatedAt = notifications?.[0]?.createdAt;

    if (!latestCreatedAt || unreadCount === 0) return;

    const savedSeenAt = await markNotificationsSeen(latestCreatedAt);

    if (!savedSeenAt) return;

    queryClient.setQueryData(
      getNotificationsByUserOptions({ userId }).queryKey,
      (currentFeed) =>
        currentFeed ? { ...currentFeed, seenAt: savedSeenAt } : currentFeed,
    );
  }

  function handleOpenChange(isNextOpen: boolean) {
    setIsOpen(isNextOpen);

    if (isNextOpen) {
      invalidateQueriesByKeys(QUERY_KEYS.GET_NOTIFICATIONS_BY_USER);
      return;
    }

    void markLatestNotificationSeen();
  }

  function handleNavigate() {
    handleOpenChange(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            unreadCount > 0
              ? `Thông báo, ${unreadCount} chưa đọc`
              : "Thông báo"
          }
          className="size-9 rounded-xl data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground"
        >
          {/* BellDot gốc chỉ vẽ viền chấm, tô đặc cho thấy rõ ở cỡ nhỏ */}
          {unreadCount > 0 && (
            <BellDot className="size-4 [&_circle]:fill-current" />
          )}
          {unreadCount === 0 && <Bell className="size-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={NOTIFICATION_PANEL_SIDE_OFFSET}
        collisionPadding={16}
        className="w-96 max-w-[calc(100vw-2rem)] rounded-2xl border-border bg-surface p-0 text-foreground shadow-popover dark:border-border dark:bg-surface dark:text-foreground"
      >
        <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">
          Thông báo
        </h2>
        {isPending && <NotificationListSkeleton />}
        {hasLoadFailed && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            Chưa tải được thông báo, đóng rồi mở lại để thử lại
          </p>
        )}
        {notifications && notifications.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            Chưa có thông báo nào
          </p>
        )}
        {notifications && notifications.length > 0 && (
          <NotificationList
            notifications={notifications}
            seenAt={seenAt}
            onNavigate={handleNavigate}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
