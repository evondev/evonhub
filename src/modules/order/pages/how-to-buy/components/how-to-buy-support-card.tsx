import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import {
  ORDER_SUPPORT_NAME,
  ORDER_SUPPORT_URL,
} from "../../../constants/order-details.constants";

/** Cột phụ: tìm lại đơn chưa trả và kênh hỏi khi kẹt. Từ xl đứng yên khi cuộn */
export function HowToBuySupportCard() {
  return (
    <aside className="rounded-2xl border border-border bg-surface xl:sticky xl:top-24">
      <div className="p-4 sm:p-5">
        <h2 className="text-base font-semibold text-foreground">
          Tìm lại đơn chưa trả
        </h2>
        <p className="mt-1 text-pretty text-sm text-muted">
          Đơn đang chờ thanh toán nằm ở đầu trang Đơn hàng của tôi, mở ra là
          thấy lại thông tin chuyển khoản.
        </p>
        <Button asChild variant="outline" className="mt-4 w-full">
          <Link href="/my-orders">Xem đơn hàng của tôi</Link>
        </Button>
      </div>
      <div className="border-t border-border p-4 sm:p-5">
        <h2 className="text-base font-semibold text-foreground">Cần hỗ trợ</h2>
        <p className="mt-1 text-pretty text-sm text-muted">
          Nhắn {ORDER_SUPPORT_NAME} qua Facebook, gửi kèm mã đơn và ảnh giao
          dịch để được kiểm tra nhanh.
        </p>
        <Button asChild variant="outline" className="mt-4 w-full">
          <a href={ORDER_SUPPORT_URL} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden className="size-4 shrink-0" />
            Nhắn {ORDER_SUPPORT_NAME}
          </a>
        </Button>
      </div>
    </aside>
  );
}
