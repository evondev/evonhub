import { SupportInboxPage } from "@/modules/support/pages";
import { NotFoundState } from "@/shared/components/not-found";
import { getCurrentAdmin } from "@/shared/libs/auth";

// Trang phụ thuộc session Clerk nên không prerender tĩnh được
export const dynamic = "force-dynamic";

export default async function SupportInboxPageRoot() {
  // Khu quản lý cho cả giảng viên vào; hộp thư thì chỉ Admin
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) return <NotFoundState />;

  return <SupportInboxPage />;
}
