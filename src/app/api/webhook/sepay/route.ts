import OrderModel from "@/modules/order/models";
import { grantOrderToUser } from "@/modules/order/services/grant-order.service";
import { SepayWebhookPayload } from "@/modules/order/types";
import { extractOrderCode } from "@/modules/order/utils";
import { OrderStatus } from "@/shared/constants/order.constants";
import { bankAccountInfo } from "@/shared/constants/payment.constants";
import { connectToDatabase } from "@/shared/libs";
import { NextRequest, NextResponse } from "next/server";

function isValidApiKey(request: NextRequest): boolean {
  const apiKey = process.env.SEPAY_API_KEY;

  if (!apiKey) return false;

  const authorization = request.headers.get("authorization") || "";

  return authorization === `Apikey ${apiKey}`;
}

export async function POST(request: NextRequest) {
  if (!isValidApiKey(request)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const payload: SepayWebhookPayload = await request.json();

    // Chỉ quan tâm tiền vào đúng tài khoản nhận thanh toán
    if (payload.transferType !== "in") {
      return NextResponse.json({ success: true, message: "Bỏ qua tiền ra" });
    }

    if (
      payload.accountNumber &&
      payload.accountNumber !== bankAccountInfo.accountNumber
    ) {
      return NextResponse.json({ success: true, message: "Sai tài khoản" });
    }

    const orderCode = extractOrderCode(
      payload.code,
      payload.content,
      payload.description
    );

    if (!orderCode) {
      return NextResponse.json({
        success: true,
        message: "Không tìm thấy mã đơn hàng",
      });
    }

    await connectToDatabase();

    const reference = String(payload.id);

    // Cộng tiền và ghi nhận giao dịch trong một thao tác: webhook gọi lại
    // nhiều lần cùng một id sẽ không khớp filter nên không bị cộng trùng.
    const paidOrder = await OrderModel.findOneAndUpdate(
      {
        code: orderCode,
        status: OrderStatus.Pending,
        paymentReferences: { $ne: reference },
      },
      {
        $inc: { paidAmount: payload.transferAmount },
        $set: { paidAt: new Date() },
        $addToSet: { paymentReferences: reference },
      },
      { new: true }
    );

    if (!paidOrder) {
      return NextResponse.json({
        success: true,
        message: "Đơn hàng không tồn tại, đã xử lý hoặc giao dịch đã ghi nhận",
      });
    }

    if (paidOrder.paidAmount !== paidOrder.total) {
      const isNotEnough = paidOrder.paidAmount < paidOrder.total;

      paidOrder.paymentNote = isNotEnough
        ? `Khách chuyển thiếu: đã nhận ${paidOrder.paidAmount}/${paidOrder.total}`
        : `Khách chuyển dư: đã nhận ${paidOrder.paidAmount}/${paidOrder.total}`;
      await paidOrder.save();

      return NextResponse.json({
        success: true,
        message: "Số tiền chưa khớp, chờ admin duyệt",
      });
    }

    paidOrder.status = OrderStatus.Approved;
    paidOrder.paymentNote = "Tự động duyệt qua SePay";
    await paidOrder.save();
    await grantOrderToUser(paidOrder);

    return NextResponse.json({ success: true, message: "Đã duyệt đơn hàng" });
  } catch (error) {
    console.log("sepay webhook error:", error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
