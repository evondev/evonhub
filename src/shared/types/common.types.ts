export type MenuLinkItemProps = {
  title: string;
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
};
export type StatusBadgeVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default";
