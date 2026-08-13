import { settleSepayPayment } from "@/modules/order/services/settle-payment.service";
import { SepayWebhookPayload } from "@/modules/order/types";
import { connectToDatabase } from "@/shared/libs";
import { NextRequest, NextResponse } from "next/server";

function isValidWebhookToken(request: NextRequest): boolean {
  const webhookToken = process.env.SEPAY_WEBHOOK_TOKEN;

  if (!webhookToken) return false;

  return request.headers.get("authorization") === `Apikey ${webhookToken}`;
}

export async function POST(request: NextRequest) {
  if (!isValidWebhookToken(request)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const payload: SepayWebhookPayload = await request.json();

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
