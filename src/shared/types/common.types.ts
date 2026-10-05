export type MenuLinkItemProps = {
  title: string;
  /** Nhãn ngắn cho thanh điều hướng dưới trên điện thoại */
  mobileTitle?: string;
  icon: React.ReactNode;
  url: string;
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
