"use server";

import CouponModel from "@/modules/coupon/models";
import CourseModel from "@/modules/course/models";
import UserModel from "@/modules/user/models";
import { OrderStatus } from "@/shared/constants/order.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentUser } from "@/shared/libs/auth";
import { FilterQuery } from "mongoose";
import OrderModel from "../models";
import {
  decrementCouponUsage,
  incrementCouponUsage,
} from "../services/coupon-usage.service";
import {
  grantOrderToUser,
  revokeOrderFromUser,
} from "../services/grant-order.service";
import {
  FetchOrdersProps,
  FetchOrdersResult,
  FetchOrderStatusProps,
  OrderItemData,
  UpdateOrderProps,
} from "../types";
import {
  OrderManageGroup,
  OrderManageTabCounts,
} from "../types/order-manage.types";
import { getPendingOrderExpiryDate } from "../utils";

export async function fetchCountOrdersByCourse(
  courseId: string
): Promise<number | undefined> {
  try {
    connectToDatabase();
    const count = await UserModel.countDocuments({ courses: courseId });
    return count;
  } catch (error) {
    console.log("error:", error);
  }
}

// Đơn 0 đồng đang chờ admin duyệt (đơn gói thành viên cũ không có khoá, bỏ qua)
const freePendingOrderQuery = {
  total: { $lte: 0 },
  status: OrderStatus.Pending,
  course: { $ne: null },
};

// Đơn chưa nhận đồng nào: chưa có paidAmount hoặc bằng 0
const unpaidCondition = { paidAmount: { $in: [null, 0] } };

/**
 * Điều kiện của từng nhóm trên trang quản lý đơn, khớp getOrderManageGroup ở
 * client. DB chỉ ghi PENDING cho mọi đơn chưa xong, nên tách thêm: cần admin xử
 * lý (đơn 0 đồng, đã nhận tiền), đang đợi khách, và chờ quá hạn mà chưa nhận
 * đồng nào (tính là hết hạn cùng đơn đã ghi EXPIRED)
 */
function buildOrderGroupCondition(
  group: OrderManageGroup,
  expiryDate: Date,
): FilterQuery<typeof OrderModel> {
  const unpaidPendingCondition = {
    status: OrderStatus.Pending,
    total: { $gt: 0 },
    ...unpaidCondition,
  };

  if (group === "needs-action") {
    return {
      status: OrderStatus.Pending,
      $or: [{ total: { $lte: 0 } }, { paidAmount: { $gt: 0 } }],
    };
  }

  if (group === "waiting") {
    return { ...unpaidPendingCondition, createdAt: { $gt: expiryDate } };
  }

  if (group === OrderStatus.Expired) {
    return {
      $or: [
        { status: OrderStatus.Expired },
        { ...unpaidPendingCondition, createdAt: { $lte: expiryDate } },
      ],
    };
  }

  return { status: group };
}

function combineConditions(
  conditions: FilterQuery<typeof OrderModel>[],
): FilterQuery<typeof OrderModel> {
  if (!conditions.length) return {};

  return { $and: conditions };
}

const orderManageGroups: OrderManageGroup[] = [
  "needs-action",
  "waiting",
  OrderStatus.Approved,
  OrderStatus.Expired,
  OrderStatus.Rejected,
];

export async function fetchOrders({
  limit,
  filter,
  page,
  isFree,
  tab = "all",
}: FetchOrdersProps): Promise<FetchOrdersResult | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser) return;
    if (![UserRole.Admin, UserRole.Expert].includes(currentUser.role)) return;

    const skip = (page - 1) * limit;
    const expiryDate = getPendingOrderExpiryDate();
    // Điều kiện chung của mọi tab: từ khoá, đơn 0 đồng, phạm vi của expert
    const scopeConditions: FilterQuery<typeof OrderModel>[] = [];

    if (filter) {
      const matchedUsers = await UserModel.find({
        email: { $regex: filter, $options: "i" },
      }).select("_id");

      scopeConditions.push({
        $or: [
          { code: { $regex: filter, $options: "i" } },
          { user: { $in: matchedUsers.map((user) => user._id) } },
        ],
      });
    }

    if (isFree) {
      scopeConditions.push({ total: { $lte: 0 } });
    }

    // Expert chỉ thấy đơn hàng của khóa học do chính mình tạo
    if (currentUser.role === UserRole.Expert) {
      const authoredCourses = await CourseModel.find({
        author: currentUser._id,
      }).select("_id");

      scopeConditions.push({
        course: { $in: authoredCourses.map((course) => course._id) },
      });
    }

    const tabConditions =
      tab === "all"
        ? scopeConditions
        : [...scopeConditions, buildOrderGroupCondition(tab, expiryDate)];
    const isAdmin = currentUser.role === UserRole.Admin;

    const [orders, allCount, groupCounts, freePendingCount] =
      await Promise.all([
        OrderModel.find(combineConditions(tabConditions))
          .limit(limit)
          .skip(skip)
          .sort({
            createdAt: -1,
          })
          .populate({
            path: "course",
            model: CourseModel,
            select: "_id title",
          })
          .populate({
            path: "coupon",
            model: CouponModel,
            select: "_id code amount",
          })
          .populate({
            path: "user",
            model: UserModel,
            select: "_id username email",
          }),
        OrderModel.countDocuments(combineConditions(scopeConditions)),
        Promise.all(
          orderManageGroups.map((group) =>
            OrderModel.countDocuments(
              combineConditions([
                ...scopeConditions,
                buildOrderGroupCondition(group, expiryDate),
              ]),
            ),
          ),
        ),
        // Đúng phạm vi handleUpdateFreeOrder sẽ duyệt, không theo bộ lọc
        isAdmin ? OrderModel.countDocuments(freePendingOrderQuery) : 0,
      ]);

    const tabCounts = Object.fromEntries([
      ["all", allCount],
      ...orderManageGroups.map((group, index) => [group, groupCounts[index]]),
    ]) as OrderManageTabCounts;

    return {
      orders: parseData(orders),
      total: tabCounts[tab],
      tabCounts,
      freePendingCount,
    };
  } catch (error) {
    console.log(error);
  }
}

/** Toàn bộ đơn hàng của chính user đang đăng nhập, mới nhất trước. */
export async function fetchMyOrders(): Promise<OrderItemData[] | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    const orders = await OrderModel.find({ user: currentUser._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "course",
        model: CourseModel,
        select: "_id title slug image",
      });

    return parseData(orders);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Trạng thái đơn hàng của chính user đang đăng nhập, dùng để trang thanh toán
 * tự cập nhật khi webhook SePay duyệt đơn.
 */
export async function fetchOrderStatus({
  code,
}: FetchOrderStatusProps): Promise<OrderStatus | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    const findOrder = await OrderModel.findOne({
      code,
      user: currentUser._id,
    }).select("status");

    return findOrder?.status;
  } catch (error) {
    console.log(error);
  }
}

export async function handleUpdateOrder({
  code,
  status,
}: UpdateOrderProps): Promise<boolean | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser) return;
    if (![UserRole.Admin, UserRole.Expert].includes(currentUser.role)) return;
    if (!Object.values(OrderStatus).includes(status)) return;

    // Toàn bộ thông tin đơn hàng lấy từ DB, client chỉ gửi lên mã đơn
    const findOrder = await OrderModel.findOne({ code });

    if (!findOrder || findOrder.status === OrderStatus.Rejected) return;

    const findUser = await UserModel.findById(findOrder.user);

    if (!findUser) return;

    // Expert chỉ được xử lý đơn của khóa học do chính mình tạo
    if (currentUser.role === UserRole.Expert) {
      const isCourseAuthor =
        !!findOrder.course &&
        !!(await CourseModel.exists({
          _id: findOrder.course,
          author: currentUser._id,
        }));

      if (!isCourseAuthor) return;
    }

    const previousStatus = findOrder.status;

    // Chỉ đổi khi trạng thái chưa bị ai đổi trước (webhook / admin khác), để
    // lượt dùng mã giảm giá không bị cộng trùng
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: findOrder._id, status: previousStatus },
      { $set: { status } },
      { new: true },
    );

    if (!updatedOrder) return;

    const isNewlyApproved =
      previousStatus !== OrderStatus.Approved &&
      status === OrderStatus.Approved;
    const isApprovalRevoked =
      previousStatus === OrderStatus.Approved &&
      status !== OrderStatus.Approved;

    if (status === OrderStatus.Approved) {
      await grantOrderToUser(updatedOrder);
    } else {
      await revokeOrderFromUser(updatedOrder);
    }

    if (isNewlyApproved) {
      await incrementCouponUsage(updatedOrder);
    }

    if (isApprovalRevoked) {
      await decrementCouponUsage(updatedOrder);
    }

    return true;
  } catch (error) {
    console.log(error);
  }
}

/** Duyệt mọi đơn 0 đồng đang chờ, trả về số đơn vừa duyệt */
export async function handleUpdateFreeOrder(): Promise<number | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== UserRole.Admin) return;

    const freeOrders = await OrderModel.find(freePendingOrderQuery);
    let approvedCount = 0;

    for (const order of freeOrders) {
      const approveResult = await OrderModel.updateOne(
        { _id: order._id, status: OrderStatus.Pending },
        { status: OrderStatus.Approved }
      );

      if (!approveResult.modifiedCount) continue;

      await UserModel.updateOne(
        { _id: order.user },
        { $addToSet: { courses: order.course } }
      );
      await incrementCouponUsage(order);
      approvedCount += 1;
    }

    return approvedCount;
  } catch (error) {
    console.log(error);
  }
}
