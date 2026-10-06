import { getUserByIdOptions } from "@/modules/user/services/data/query-user-by-id.data";
import { getQueryClient } from "@/shared/libs/react-query/query-client";
import { auth } from "@clerk/nextjs/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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
export default async function UserQueryHydration({
  children,
}: UserQueryHydrationProps) {
  const { userId } = auth();

  if (!userId) return <>{children}</>;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getUserByIdOptions({ userId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
