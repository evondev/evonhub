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
  isFree?: boolean;
};
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

/** Một tab trên hàng tab lọc phía trên bảng hoặc danh sách */
export interface FilterTabItem<TValue extends string> {
  value: TValue;
  label: string;
  /** Không có số thì tab chỉ ghi chữ */
  count?: number;
}
