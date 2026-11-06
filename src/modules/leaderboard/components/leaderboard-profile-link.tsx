import { buildPublicProfilePath } from "@/shared/helpers/url.helper";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { ReactNode } from "react";

interface LeaderboardProfileLinkProps {
  username: string;
  children: ReactNode;
  className?: string;
  /**
   * Link lặp lại cái tên ngay bên cạnh (bọc avatar): bỏ khỏi tab và trình đọc
   * màn hình để mỗi người chỉ có một điểm dừng
   */
  isDuplicate?: boolean;
}

/** Bọc tên hoặc avatar thành link trang công khai. Không có username thì để nguyên */
export function LeaderboardProfileLink({
  username,
  children,
  className,
  isDuplicate = false,
}: LeaderboardProfileLinkProps) {
  if (!username) return <>{children}</>;

  return (
    <Link
      href={buildPublicProfilePath(username)}
      aria-hidden={isDuplicate || undefined}
      tabIndex={isDuplicate ? -1 : undefined}
      className={cn(
        "rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
    >
      {children}
    </Link>
  );
}
