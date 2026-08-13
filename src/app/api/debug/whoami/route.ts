import UserModel from "@/modules/user/models";
import { connectToDatabase } from "@/shared/libs";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Route chẩn đoán: cho biết server có nhìn thấy session Clerk không và có tìm
 * được user tương ứng trong Mongo không. Chỉ bật ở môi trường dev.
 */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { userId: clerkId, sessionId } = auth();

  if (!clerkId) {
    return NextResponse.json({
      clerkSeenByServer: false,
      sessionId,
      hint: "Server không thấy session Clerk. Kiểm tra middleware hoặc đăng nhập lại.",
    });
  }

  await connectToDatabase();

  const findUser = await UserModel.findOne({ clerkId }).select(
    "email username role status"
  );

  return NextResponse.json({
    clerkSeenByServer: true,
    clerkId,
    userFoundInMongo: !!findUser,
    user: findUser
      ? {
          email: findUser.email,
          username: findUser.username,
          role: findUser.role,
          status: findUser.status,
        }
      : null,
    hint: findUser
      ? "Server OK. Nếu vẫn báo lỗi thì là guard phía client."
      : `Không có user nào với clerkId ${clerkId} trong Mongo.`,
  });
}
