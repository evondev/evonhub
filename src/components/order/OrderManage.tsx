import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatThoundsand } from "@/utils";
const OrderManage = ({ allOrders }: { allOrders: any[] }) => {
  return (
    <>
      <div className="mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-extrabold">
          Quản lý đơn hàng
        </h1>
        <Input
          placeholder="Tìm kiếm đơn hàng"
          className="w-full lg:w-[300px]"
        />
      </div>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox />
            </TableHead>
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Khóa học</TableHead>
            <TableHead>Thành viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Ngày lập</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allOrders.map((order: any) => (
            <TableRow key={order._id}>
              <TableCell></TableCell>
              <TableCell>{order.code}</TableCell>
              <TableCell>
                <div className="max-w-[200px]">
                  <div className="line-clamp-1">{order.course.title}</div>
                </div>
              </TableCell>
              <TableCell>{order.user.username}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-2 font-medium">
                  <p>
                    Giá tiền:
                    {order.amount}
                  </p>
                  {order.discount > 0 && (
                    <p className="">
                      Giảm giá
                      <span className="line-through">{order.discount}</span>
                    </p>
                  )}
                  <p className="text-secondary font-bold">
                    Tổng tiền:
                    {formatThoundsand(order.total)}
                  </p>
                </div>
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrderManage;
