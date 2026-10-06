import { VIETNAM_UTC_OFFSET_MS } from "../constants";

const DAY_MS = 24 * 60 * 60 * 1000;

const chatTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Ho_Chi_Minh",
});

/** 00:00 hôm nay theo giờ Việt Nam, bất kể server chạy múi giờ nào */
export function getVietnamStartOfDay(now: Date = new Date()): Date {
  const vietnamTime = now.getTime() + VIETNAM_UTC_OFFSET_MS;
  const vietnamDayStart = Math.floor(vietnamTime / DAY_MS) * DAY_MS;

  return new Date(vietnamDayStart - VIETNAM_UTC_OFFSET_MS);
}

/** 00:00 ngày mai theo giờ Việt Nam: lúc tin nhắn hôm nay hết hạn */
export function getNextVietnamMidnight(now: Date = new Date()): Date {
  return new Date(getVietnamStartOfDay(now).getTime() + DAY_MS);
}

export function formatChatTime(createdAt: string): string {
  return chatTimeFormatter.format(new Date(createdAt));
}

/** Số phút (làm tròn lên) còn lại tới 00:00 giờ Việt Nam */
export function getMinutesUntilMidnight(now: Date = new Date()): number {
  const remainingMs = getNextVietnamMidnight(now).getTime() - now.getTime();

  return Math.ceil(remainingMs / 60_000);
}

/** Mốc giờ "HH:mm" của hôm nay theo giờ Việt Nam, dùng dựng tin giả */
export function toVietnamTimeToday(time: string, now: Date = new Date()): Date {
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(
    getVietnamStartOfDay(now).getTime() + (hours * 60 + minutes) * 60_000,
  );
}
