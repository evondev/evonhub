import PageNotFound from "@/app/not-found";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getOrderDetails } from "@/lib/actions/order.action";
import { OrderStatus } from "@/shared/constants/order.constants";
import { MembershipPlan } from "@/shared/constants/user.constants";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import Fireworks from "./fireworks";

const page = async ({
  params,
}: {
  params: {
    orderId: string;
  };
}) => {
  if (!params.orderId) return <PageNotFound />;
  const orderDetails = await getOrderDetails(params.orderId);
  const bankInfo = orderDetails?.course?.author?.bank || {};
  const isOrderMembership = orderDetails?.plan !== MembershipPlan.None;

  if (isOrderMembership) {
    bankInfo.bankNumber = "33366668888";
    bankInfo.bankAccount = "TRAN ANH TUAN";
    bankInfo.bankName = "ACB";
  }

  if (!orderDetails || !bankInfo || !bankInfo.bankNumber)
    return <PageNotFound />;

  if (orderDetails.status === OrderStatus.Approved)
    return (
      <div className="flex items-center justify-center flex-col gap-3">
        <Image alt="" src="/check.png" width={100} height={100} />
        <h1 className="font-bold text-xl mb-5">Đơn hàng này đã được duyệt</h1>
        <Link
          href="/study"
          className="rounded-full flex items-center justify-center py-2 px-5 bg-secondary font-semibold text-white h-12"
        >
          Khu vực học tập
        </Link>
      </div>
    );

  return (
    <div className="relative w-full h-[calc(100vh-184px)]">
      <Fireworks />
      <div className="bg-white rounded-lg bgDarkMode p-5 flex text-sm lg:text-base flex-col gap-3 font-medium">
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
          {" "}
          Bạn vui lòng thanh toán vào thông tin tài khoản dưới đây với nội dung
          chuyển khoản là{" "}
          <strong className="text-secondary">{orderDetails.code}</strong>
        </div>
        <div className="max-w-[400px]">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Số tài khoản</TableCell>
                <TableCell>
                  <strong>{bankInfo?.bankNumber}</strong>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tên tài khoản</TableCell>
                <TableCell>
                  <strong>{bankInfo?.bankAccount}</strong>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ngân hàng</TableCell>
                <TableCell>
                  <strong>{bankInfo?.bankName}</strong>
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
};

export default page;
