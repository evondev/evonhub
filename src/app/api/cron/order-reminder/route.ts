import { sendOrderReminders } from "@/modules/order/services/send-order-reminders.service";
import { connectToDatabase } from "@/shared/libs";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isValidCronSecret(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) return false;

  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isValidCronSecret(request)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const result = await sendOrderReminders();

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.log("[cron] order reminder error:", error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
