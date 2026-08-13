import { createHmac, timingSafeEqual } from "crypto";

/** Chữ ký chỉ được chấp nhận trong ±5 phút để chặn replay. */
export const SEPAY_SIGNATURE_TOLERANCE_SECONDS = 300;

export interface VerifySepaySignatureProps {
  signature: string | null;
  timestamp: string | null;
  /** Body thô, không parse rồi stringify lại — làm vậy là lệch chữ ký */
  rawBody: string;
  secret: string;
  now?: Date;
}

function isSameSignature(expected: string, received: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

/**
 * Xác thực webhook SePay theo HMAC-SHA256.
 * SePay ký chuỗi `{timestamp}.{raw body}` và gửi kèm header X-SePay-Signature
 * dạng `sha256=<hex>`.
 */
export function verifySepaySignature({
  signature,
  timestamp,
  rawBody,
  secret,
  now = new Date(),
}: VerifySepaySignatureProps): boolean {
  if (!signature || !timestamp || !secret) return false;

  const signedAtSeconds = Number(timestamp);

  if (!Number.isFinite(signedAtSeconds)) return false;

  const currentSeconds = Math.floor(now.getTime() / 1000);

  if (
    Math.abs(currentSeconds - signedAtSeconds) >
    SEPAY_SIGNATURE_TOLERANCE_SECONDS
  ) {
    return false;
  }

  const expectedSignature = `sha256=${createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex")}`;

  return isSameSignature(expectedSignature, signature);
}
