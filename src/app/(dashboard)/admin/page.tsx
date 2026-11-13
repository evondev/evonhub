import { adminNavLinks } from "@/shared/constants/common.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { getCurrentUser } from "@/shared/libs/auth";
import { redirect } from "next/navigation";

// Layout đã chặn người ngoài admin/expert. Tab đầu (Hoạt động) chỉ admin xem
// được, chuyên gia mở tab đầu tiên dành cho họ
export default async function AdminHomePage() {
  const currentUser = await getCurrentUser();

  if (currentUser?.role === UserRole.Admin) redirect(adminNavLinks[0].url);

  const expertHomeLink = adminNavLinks.find((link) => link.isExpert) || adminNavLinks[0];

  redirect(expertHomeLink.url);
}
