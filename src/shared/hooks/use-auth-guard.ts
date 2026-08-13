"use client";

import { commonPath } from "@/constants";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

/**
 * Chặn các hành động cần đăng nhập và đá khách sang trang đăng nhập, kèm
 * đường dẫn hiện tại để đăng nhập xong quay lại đúng chỗ đang đứng.
 */
export function useAuthGuard() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function redirectToSignIn(): void {
    const query = searchParams.toString();
    const currentUrl = query ? `${pathname}?${query}` : pathname;

    router.push(
      `${commonPath.LOGIN}?redirect_url=${encodeURIComponent(currentUrl)}`
    );
  }

  /** Trả về true khi đã đăng nhập, ngược lại tự điều hướng sang trang login. */
  function ensureSignedIn(
    message = "Vui lòng đăng nhập để tiếp tục"
  ): boolean {
    // Clerk chưa load xong thì chưa biết trạng thái, không điều hướng vội
    if (!isLoaded) return false;

    if (isSignedIn) return true;

    toast.info(message);
    redirectToSignIn();

    return false;
  }

  return { isLoaded, isSignedIn, ensureSignedIn, redirectToSignIn };
}
