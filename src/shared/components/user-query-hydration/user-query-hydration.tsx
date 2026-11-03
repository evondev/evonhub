import { getUserByIdOptions } from "@/modules/user/services/data/query-user-by-id.data";
import { getQueryClient } from "@/shared/libs/react-query/query-client";
import { auth } from "@clerk/nextjs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";

interface UserQueryHydrationProps {
  children: React.ReactNode;
}

/**
 * Đọc hồ sơ user trên server rồi đổ vào cache React Query, để UserProvider có
 * dữ liệu ngay lần render đầu. Không có bước này, mọi trang phải đợi Clerk JS
 * tải xong rồi mới gọi server action lấy user (vai trò, khóa đã mua).
 * Root layout không render lại khi chuyển trang trong app, nên chỉ đọc một lần
 * mỗi lần tải trang.
 */
function readUserId() {
  // auth() ném lỗi khi request thiếu header của clerkMiddleware. Gặp khi tab cũ
  // gọi server action không còn tồn tại (sau HMR hoặc deploy mới): Next render
  // cây not-found trong chính request POST đó. Khi ấy bỏ prefetch, UserProvider
  // tự lấy user ở client.
  // Gọi headers() ngoài try để lỗi báo route dynamic lúc build không bị nuốt.
  headers();

  try {
    return auth().userId;
  } catch {
    return null;
  }
}

export default async function UserQueryHydration({
  children,
}: UserQueryHydrationProps) {
  const userId = readUserId();

  if (!userId) return <>{children}</>;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getUserByIdOptions({ userId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
