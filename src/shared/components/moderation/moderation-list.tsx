import { cn } from "@/shared/utils";

interface ModerationListProps {
  id: string;
  /** Tên danh sách cho trình đọc màn hình, ví dụ "Danh sách bình luận" */
  label: string;
  /** Đang tải trang hoặc bộ lọc mới, vẫn giữ mục cũ trên màn */
  isRefreshing: boolean;
  /** Hàng chọn tất cả / thanh hàng loạt */
  header: React.ReactNode;
  hasItems: boolean;
  /** Câu báo rỗng khi không có mục nào */
  empty: React.ReactNode;
  /** Phân trang, chỉ hiện khi có mục */
  footer: React.ReactNode;
  children: React.ReactNode;
}

/** Một khối chia đường kẻ: hàng chọn tất cả, các mục, phân trang */
export function ModerationList({
  id,
  label,
  isRefreshing,
  header,
  hasItems,
  empty,
  footer,
  children,
}: ModerationListProps) {
  return (
    <section
      id={id}
      aria-label={label}
      aria-busy={isRefreshing}
      // overflow-clip, không overflow-hidden: hidden biến khung thành vùng cuộn,
      // hàng "Đã chọn" bên trong không dính được theo trang
      className="overflow-clip rounded-2xl border border-border bg-surface"
    >
      {header}
      {hasItems && (
        <ul className={cn("transition-opacity", isRefreshing && "opacity-60")}>
          {children}
        </ul>
      )}
      {!hasItems && empty}
      {hasItems && footer}
    </section>
  );
}
