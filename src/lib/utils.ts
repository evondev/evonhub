import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const timeAgo = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years) return `${years} năm trước`;
  if (months) return `${months} tháng trước`;
  if (days) return `${days} ngày trước`;
  if (hours) return `${hours} giờ trước`;
  if (minutes) return `${minutes} phút trước`;

  return `${seconds} giây trước`;
};
export const extractDriveId = (input: string) => {
  const regexIdParam = /[?&]id=([^&]+)/;

  const regexFilePath = /\/d\/([^/]+)/;

  if (/^[a-zA-Z0-9_-]+$/.test(input)) {
    return input;
  }

  const idParamMatch = input.match(regexIdParam);
  if (idParamMatch) {
    return idParamMatch[1];
  }

  const filePathMatch = input.match(regexFilePath);
  if (filePathMatch) {
    return filePathMatch[1];
  }

  return null;
};
