import { adminNavLinks } from "@/shared/constants/common.constants";
import { redirect } from "next/navigation";

// Layout đã chặn người ngoài admin/expert; tab đầu là trang cả hai cùng xem được
export default function AdminHomePage() {
  redirect(adminNavLinks[0].url);
}
