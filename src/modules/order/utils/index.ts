import { PENDING_ORDER_TTL_MS } from "@/shared/constants/order.constants";
import {
  bankAccountInfo,
  ORDER_CODE_PATTERN,
} from "@/shared/constants/payment.constants";

/** Mốc thời gian mà đơn PENDING tạo trước đó bị coi là hết hạn. */
export function getPendingOrderExpiryDate(now: Date = new Date()): Date {
  return new Date(now.getTime() - PENDING_ORDER_TTL_MS);
}

export function isPendingOrderExpired(
  createdAt: Date,
  now: Date = new Date()
): boolean {
  return createdAt.getTime() <= getPendingOrderExpiryDate(now).getTime();
}

/**
 * Thời hạn còn lại của đơn PENDING, dạng chữ để ghép vào thông báo cho khách.
 * Ví dụ: "18 giờ", "45 phút".
 */
export function formatRemainingPendingTime(
  createdAt: Date,
  now: Date = new Date()
): string {
  const remainingMs =
    createdAt.getTime() + PENDING_ORDER_TTL_MS - now.getTime();

  if (remainingMs <= 0) return "";

  const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));

  if (remainingMinutes < 60) return `${remainingMinutes} phút`;

  return `${Math.ceil(remainingMinutes / 60)} giờ`;
}

/**
 * Ảnh QR chuyển khoản của SePay. Nội dung chuyển khoản là mã đơn hàng nên
 * webhook đối soát được ngay khi khách quét QR trả tiền.
 */
export function getPaymentQrUrl(orderCode: string, amount: number): string {
  const params = new URLSearchParams({
    acc: bankAccountInfo.accountNumber,
    bank: bankAccountInfo.bankCode,
    amount: String(amount),
    des: orderCode,
  });

  return `https://qr.sepay.vn/img?${params.toString()}`;
}

/** Tách mã đơn hàng ra khỏi nội dung chuyển khoản do ngân hàng gửi về. */
export function extractOrderCode(...contents: (string | null)[]): string {
  for (const content of contents) {
    const matched = content?.match(ORDER_CODE_PATTERN);

    if (matched) return matched[0].toUpperCase();
  }

  return "";
}
