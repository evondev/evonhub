export type MenuLinkItemProps = {
  title: string;
  /** Nhãn ngắn cho thanh điều hướng dưới trên điện thoại */
  mobileTitle?: string;
  icon: React.ReactNode;
  url: string;
  /** Sáng cả khi đang ở trang con, vd "/admin/" cho mục Quản lý */
  activePathPrefix?: string;
  isAdmin?: boolean;
  isAuth?: boolean;
  isHideMobile?: boolean;
  isExpert?: boolean;
  isExternal?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isHideForAdmin?: boolean;
  /** Ẩn khỏi thanh dưới với admin, expert: họ có thêm mục Quản lý, đủ 6 mục là chật */
  isHideMobileForManager?: boolean;
  isFree?: boolean;
};
/** Tín hiệu sống trên một mục menu, vd phòng chat đang có người, có tin chưa đọc */
export interface MenuLinkSignal {
  /** Số người đang ở đó, 0 thì không hiện */
  count: number;
  /** Có cái mới chưa xem */
  hasUnread: boolean;
  /** Đang có hoạt động ngay lúc này: chấm xanh nhấp nháy */
  isLive: boolean;
  /** Câu mô tả cho tooltip và screen reader */
  description: string;
}

export type StatusBadgeVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default";

/** Một trạng thái trên thanh chuyển trạng thái của các trang xem trước ở dev */
export interface PreviewStateLink {
  state: string;
  label: string;
}

/** Một ô trên thanh phân trang: số trang hoặc dấu "…" */
export type PaginationItem = number | "ellipsis";

/** Tông màu của badge trạng thái */
export type BadgeTone = "success" | "warning" | "neutral" | "error";

/** Mốc bề rộng mà dưới nó hàng tab lọc thu thành nút "Trạng thái:" */
export type FilterTabsBreakpoint = "sm" | "xl";

/** Một tab trên hàng tab lọc phía trên bảng hoặc danh sách */
export interface FilterTabItem<TValue extends string> {
  value: TValue;
  label: string;
  /** Không có số thì tab chỉ ghi chữ */
  count?: number;
}
