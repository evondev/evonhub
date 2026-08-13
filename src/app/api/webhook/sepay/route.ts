import { settleSepayPayment } from "@/modules/order/services/settle-payment.service";
import { SepayWebhookPayload } from "@/modules/order/types";
import { verifySepaySignature } from "@/modules/order/utils/sepay-signature";
import { connectToDatabase } from "@/shared/libs";
import { NextRequest, NextResponse } from "next/server";

/**
 * Ưu tiên HMAC-SHA256 nếu đã cấu hình secret, không thì dùng API Key.
 * Khớp với phương thức xác thực chọn bên trang webhook của SePay.
 */
function isAuthorized(request: NextRequest, rawBody: string): boolean {
  const webhookSecret = process.env.SEPAY_WEBHOOK_SECRET;

  if (webhookSecret) {
    return verifySepaySignature({
      signature: request.headers.get("x-sepay-signature"),
      timestamp: request.headers.get("x-sepay-timestamp"),
      rawBody,
      secret: webhookSecret,
    });
  }

  const webhookToken = process.env.SEPAY_WEBHOOK_TOKEN;

  if (!webhookToken) return false;

  return request.headers.get("authorization") === `Apikey ${webhookToken}`;
}

export async function POST(request: NextRequest) {
  // Phải đọc body thô: parse rồi stringify lại sẽ làm lệch chữ ký HMAC
  const rawBody = await request.text();

  if (!isAuthorized(request, rawBody)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const payload: SepayWebhookPayload = JSON.parse(rawBody);

    await connectToDatabase();

    const result = await settleSepayPayment(payload);

    // SePay chỉ dừng gửi lại khi nhận được 200 kèm success: true, nên mọi case
    // đã xử lý xong — kể cả trùng lặp — đều trả về 200.
    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    console.log("[sepay] webhook error:", error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
