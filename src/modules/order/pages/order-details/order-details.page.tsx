import PageNotFound from "@/app/not-found";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getOrderDetails } from "@/lib/actions/order.action";
import Fireworks from "@/shared/components/common/fireworks";
import { OrderStatus } from "@/shared/constants/order.constants";
import { bankAccountInfo } from "@/shared/constants/payment.constants";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { getPaymentQrUrl } from "../../utils";
import { OrderApprovedSuccess } from "./components/order-approved-success";
import { OrderPaymentWatcher } from "./components/order-payment-watcher";

export interface OrderDetailsPageProps {
  orderCode: string;
  isJustPaid?: boolean;
}

export async function OrderDetailsPage({
  orderCode,
  isJustPaid,
}: OrderDetailsPageProps) {
  const orderDetails = await getOrderDetails(orderCode);

  if (!orderDetails) return <PageNotFound />;

  if (orderDetails.status === OrderStatus.Approved)
    return <OrderApprovedSuccess isJustPaid={isJustPaid} />;

  const qrUrl = getPaymentQrUrl(orderDetails.code, orderDetails.total);

  return (
    <div className="relative w-full">
      <Fireworks />
      <div className="bg-white rounded-xl bgDarkMode p-5 flex text-sm lg:text-base flex-col gap-3 font-medium">
        {orderDetails?.course && (
          <div>
            Cám ơn bạn đã đặt mua khóa học{" "}
            <Link
              href={`/course/${orderDetails?.course?.slug}`}
              className="text-primary font-semibold underline"
            >
              {orderDetails?.course?.title}
            </Link>
            .
          </div>
        )}
        <div>
          Bạn vui lòng thanh toán vào thông tin tài khoản dưới đây với nội dung
          chuyển khoản là{" "}
          <strong className="text-secondary">{orderDetails.code}</strong>
        </div>
        <div className="flex flex-col lg:flex-row gap-5 lg:items-start">
          <div className="max-w-[400px] w-full">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Số tài khoản</TableCell>
                  <TableCell>
                    <strong>{bankAccountInfo.accountNumber}</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tên tài khoản</TableCell>
                  <TableCell>
                    <strong>{bankAccountInfo.accountName}</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ngân hàng</TableCell>
                  <TableCell>
                    <strong>{bankAccountInfo.bankCode}</strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nội dung chuyển khoản</TableCell>
                  <TableCell>
                    <strong className="text-secondary">
                      {orderDetails.code}
                    </strong>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Số tiền cần thanh toán</TableCell>
                  <TableCell>
                    <strong className="text-secondary">
                      {formatThoundsand(orderDetails?.total)} VNĐ
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <Image
              alt={`QR thanh toán đơn hàng ${orderDetails.code}`}
              src={qrUrl}
              width={260}
              height={260}
              unoptimized
              className="rounded-xl border borderDarkMode"
            />
            <span className="text-sm text-slate-500">
              Quét QR để điền sẵn số tiền và nội dung
            </span>
          </div>
        </div>
        <OrderPaymentWatcher code={orderDetails.code} />
        <div>
          Nếu bạn cần hỗ trợ, vui lòng liên hệ Admin qua fb cá nhân:{" "}
          <Link
            href="https://fb.com/tuan.trananh.0509"
            className="underline text-primary"
            target="_blank"
          >
            Evondev
          </Link>
        </div>
      </div>
    </div>
  );
}
