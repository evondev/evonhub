import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import type { MenuLinkItemProps, PaginationItem } from "../types";

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

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("vi-VN");
};

export const formatThoundsand = (num: number): string => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Các ô phân trang, luôn đủ 7 ô (tính cả "…") khi nhiều hơn 7 trang, để nav rộng
 * cố định, chuyển trang không xô: 1 2 3 4 5 … 435 · 1 … 11 12 13 … 435 · 1 … 431 432 433 434 435
 */
export function buildPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  const slotCount = 7;
  const edgeLength = slotCount - 2;
  const allPages = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (totalPages <= slotCount) return allPages;

  if (currentPage <= edgeLength - 1) {
    return [...allPages.slice(0, edgeLength), "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - edgeLength + 2) {
    return [1, "ellipsis", ...allPages.slice(totalPages - edgeLength)];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

/** "11 tới 20" của câu đếm dưới bảng */
export function formatPageRange(
  page: number,
  pageSize: number,
  total: number,
): string {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return `${formatThoundsand(start)} tới ${formatThoundsand(end)}`;
}

export function getTotalPages(total: number, pageSize: number): number {
  return Math.max(Math.ceil(total / pageSize), 1);
}

/** Cắt từ khoá dài bằng số ký tự, để dấu ngoặc kép dính liền từ khoá */
export function truncateKeyword(keyword: string, maxLength: number): string {
  if (keyword.length <= maxLength) return keyword;

  return `${keyword.slice(0, maxLength).trimEnd()}…`;
}

export function isMenuLinkActive(link: MenuLinkItemProps, pathname: string) {
  if (pathname === link.url) return true;

  return Boolean(
    link.activePathPrefix && pathname.startsWith(link.activePathPrefix),
  );
}
