"use server";
import Course from "@/database/course.model";
import CourseModel from "@/modules/course/models";
import { sendNotification } from "@/modules/notifications/services/send-notification.service";
import OrderModel from "@/modules/order/models";
import UserModel from "@/modules/user/models";
import { canManageCourse } from "@/modules/course/services/course-permission.service";
import { decrementCouponUsage } from "@/modules/order/services/coupon-usage.service";
import { createManualOrder } from "@/modules/order/services/create-manual-order.service";
import { getCurrentUser } from "@/shared/libs/auth";
import { EOrderStatus } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function getUserById({ userId }: { userId: string }) {
  try {
    connectToDatabase();
    if (!userId) return undefined;

    // Hàm trong file "use server" ai cũng gọi được: chỉ trả bản ghi của chính người gọi
    const { userId: currentUserId } = auth();

    if (userId !== currentUserId) return undefined;

    let user = await UserModel.findOne({ clerkId: userId }).populate({
      path: "courses",
      model: Course,
      select: "title slug free",
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}

interface AddCourseToUserParams {
  userId: string;
  course: {
    id: string;
    // Không dùng nữa: giá luôn đọc từ DB. Giữ lại để caller cũ không lỗi type
    price?: number;
    discount?: number;
  };
  path: string;
}
export async function addCourseToUser({
  userId,
  path,
  course: { id: courseId },
}: AddCourseToUserParams) {
  try {
    connectToDatabase();

    // Cấp khóa thủ công: admin làm được với mọi khóa, expert chỉ với khóa của
    // chính mình. Không được tin quyền do client gửi lên.
    const currentUser = await getCurrentUser();
    const hasPermission = await canManageCourse({
      role: currentUser?.role,
      userId: currentUser?._id,
      courseId,
    });

    if (!hasPermission) {
      return {
        type: "error",
        message: "Bạn không có quyền thực hiện thao tác này",
      };
    }

    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }
    // check if users already have this course
    if (user.courses.includes(courseId)) {
      return {
        type: "error",
        message: "Thành viên này đã có khóa học này rồi",
      };
    }
    user.courses.push(courseId);
    await user.save();
    await createManualOrder({
      userId: user._id.toString(),
      courseId,
    });
    revalidatePath(path);
    const findCourse = await CourseModel.findById(courseId);
    if (!findCourse?.title) return;
    await sendNotification({
      title: "Hệ thống",
      content: `Chúc mừng bạn đã đăng ký khóa học <strong>${findCourse.title}</strong> thành công`,
      users: [user._id],
    });
  } catch (error) {
    console.log(error);

    // Lỗi DB hay không tìm thấy thành viên: trả lỗi để trang không báo "Đã cấp"
    return {
      type: "error",
      message: "Chưa cấp được khóa học, thử lại sau",
    };
  }
}
export async function removeCourseFromUser({
  userId,
  courseId,
  path,
}: {
  userId: string;
  courseId: string;
  path: string;
}) {
  try {
    connectToDatabase();

    const currentUser = await getCurrentUser();
    const hasPermission = await canManageCourse({
      role: currentUser?.role,
      userId: currentUser?._id,
      courseId,
    });

    // Báo lỗi cho trang biết, không im lặng: im lặng thì trang vẫn báo "Đã thu hồi"
    if (!hasPermission) {
      return {
        type: "error",
        message: "Bạn không có quyền thực hiện thao tác này",
      };
    }

    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) {
      return {
        type: "error",
        message: "Không tìm thấy thành viên này",
      };
    }
    user.courses = user.courses.filter((c: any) => c.toString() !== courseId);
    await user.save();
    revalidatePath(path);
    const findOrder = await OrderModel.findOne({
      user: user._id,
      course: courseId,
    });
    if (findOrder) {
      await OrderModel.findByIdAndUpdate(findOrder._id, {
        status: EOrderStatus.REJECTED,
      });

      if (findOrder.status === EOrderStatus.APPROVED) {
        await decrementCouponUsage(findOrder);
      }
    }
  } catch (error) {
    console.log(error);

    return {
      type: "error",
      message: "Chưa thu hồi được khóa học, thử lại sau",
    };
  }
}
