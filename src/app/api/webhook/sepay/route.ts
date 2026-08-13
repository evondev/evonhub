import { settleSepayPayment } from "@/modules/order/services/settle-payment.service";
import { SepayWebhookPayload } from "@/modules/order/types";
import { connectToDatabase } from "@/shared/libs";
import { NextRequest, NextResponse } from "next/server";

function isValidApiKey(request: NextRequest): boolean {
  const apiKey = process.env.SEPAY_API_KEY;

  if (!apiKey) return false;

  return request.headers.get("authorization") === `Apikey ${apiKey}`;
}

export async function POST(request: NextRequest) {
  if (!isValidApiKey(request)) {
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
