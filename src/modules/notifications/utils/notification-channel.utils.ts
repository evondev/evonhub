import { NOTIFICATION_CHANNEL_PREFIX } from "../constants/notification-type.constants";

export function getNotificationChannelName(userId: string): string {
  return `${NOTIFICATION_CHANNEL_PREFIX}${userId}`;
}
