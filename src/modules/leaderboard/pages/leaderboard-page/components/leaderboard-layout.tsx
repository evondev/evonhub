import { cn } from "@/shared/utils";
import { ReactNode } from "react";

interface LeaderboardLayoutProps {
  /** Thẻ của bạn và thẻ bậc. Không có (khách, admin, expert) thì bảng chiếm hết bề ngang */
  meCard?: ReactNode;
  children: ReactNode;
}

/**
 * Từ xl: bảng trái, thẻ của bạn cột phải 340px. Hẹp hơn: thẻ của bạn lên đầu,
 * vì việc chính của trang là biết mình đứng đâu. Cột phải dính khi cuộn, chỉ
 * khi màn đủ cao để thấy hết cả hai thẻ.
 */
export function LeaderboardLayout({
  meCard,
  children,
}: LeaderboardLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
      {meCard && (
        <div className="flex min-w-0 flex-col gap-6 xl:order-2 xl:[@media(min-height:900px)]:sticky xl:[@media(min-height:900px)]:top-24">
          {meCard}
        </div>
      )}
      <div
        className={cn(
          "flex min-w-0 flex-col gap-4 xl:order-1",
          !meCard && "xl:col-span-2",
        )}
      >
        {children}
      </div>
    </div>
  );
}
