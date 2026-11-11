import { commonPath } from "@/constants";
import { SupportPage } from "@/modules/support/pages";
import {
  SUPPORT_ADMIN_PATH,
  SUPPORT_PATH,
} from "@/shared/constants/common.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { getCurrentUser } from "@/shared/libs/auth";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Trang phụ thuộc session Clerk nên không prerender tĩnh được
export const dynamic = "force-dynamic";

export default async function SupportPageRoot() {
  // Chỉ đẩy sang đăng nhập khi chưa có session Clerk. Có session mà chưa có
  // bản ghi trong DB (webhook chưa đồng bộ) thì không được đẩy: trang đăng
  // nhập thấy đã đăng nhập sẽ trả về đây, thành vòng lặp
  const { userId } = auth();

  if (!userId) {
    redirect(
      `${commonPath.LOGIN}?redirect_url=${encodeURIComponent(SUPPORT_PATH)}`,
    );
  }

  const currentUser = await getCurrentUser();

  // Admin không nhắn cho chính mình: đưa thẳng vào hộp thư
  if (currentUser?.role === UserRole.Admin) redirect(SUPPORT_ADMIN_PATH);

  return <SupportPage />;
}
