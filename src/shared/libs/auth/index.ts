import UserModel from "@/modules/user/models";
import { connectToDatabase } from "@/shared/libs";
import { auth } from "@clerk/nextjs/server";

/**
 * Lấy user đang đăng nhập từ Clerk session.
 * Mọi server action thao tác dữ liệu của user phải dùng hàm này thay vì nhận
 * userId / userRole từ client.
 */
export async function getCurrentUser() {
  const { userId: clerkId } = auth();

  if (!clerkId) return null;

  await connectToDatabase();

  return UserModel.findOne({ clerkId });
}
