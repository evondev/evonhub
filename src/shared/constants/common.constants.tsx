import {
  BookOpen,
  CircleUser,
  ClipboardList,
  Compass,
  Home,
  LayoutGrid,
  LibraryBig,
  MessageSquare,
  Receipt,
  Star,
  Users,
} from "lucide-react";
import { BadgeTone, MenuLinkItemProps, StatusBadgeVariant } from "../types";

export const ADMIN_HOME_PATH = "/admin";

// Trang chi tiết khóa học: /course/[slug]
export const COURSE_DETAILS_PATH_PREFIX = "/course/";

export enum CommonStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export const menuLinks: MenuLinkItemProps[] = [
  {
    title: "Dashboard",
    icon: <Home />,
    url: "/",
  },
  {
    title: "Khu vực học tập",
    mobileTitle: "Học tập",
    icon: <BookOpen />,
    url: "/study",
  },
  {
    title: "Danh sách khóa học",
    mobileTitle: "Khóa học",
    icon: <Compass />,
    url: "/explore",
  },
  // {
  //   title: "Săn mã giảm giá",
  //   icon: <IconGift />,
  //   url: "/coupons",
  //   isHot: true,
  //   isHideForAdmin: true,
  // },
  {
    title: "Hồ sơ",
    icon: <CircleUser />,
    url: "/profile",
  },
  {
    title: "Quản lý",
    icon: <LayoutGrid />,
    url: ADMIN_HOME_PATH,
    activePathPrefix: "/admin/",
    isExpert: true,
  },
  {
    title: "Đơn hàng của tôi",
    mobileTitle: "Đơn hàng",
    icon: <Receipt />,
    url: "/my-orders",
    isAuth: true,
  },
];

// Thanh tab đầu khu quản lý. Tab đầu là trang mở mặc định khi vào /admin
export const adminNavLinks: MenuLinkItemProps[] = [
  {
    title: "Đơn hàng",
    icon: <ClipboardList />,
    url: "/admin/order/manage",
    isExpert: true,
  },
  {
    title: "Khóa học",
    icon: <LibraryBig />,
    url: "/admin/course/manage",
    isExpert: true,
  },
  {
    title: "Đánh giá",
    icon: <Star />,
    url: "/admin/rating/manage",
    isExpert: true,
  },
  {
    title: "Bình luận",
    icon: <MessageSquare />,
    url: "/admin/comment/manage",
    isExpert: true,
  },
  {
    title: "Thành viên",
    icon: <Users />,
    url: "/admin/user/manage",
    isAdmin: true,
  },
  // {
  //   title: "Coupon",
  //   icon: <IconCoupon />,
  //   url: "/admin/coupon/manage",
  //   isAdmin: true,
  // },
];

export const commonStatus: Record<
  CommonStatus,
  {
    text: string;
    className: string;
  }
> = {
  [CommonStatus.Pending]: {
    text: "Chờ duyệt",
    className: "bg-orange-500 bg-opacity-10 text-orange-500",
  },
  [CommonStatus.Approved]: {
    text: "Đã duyệt",
    className: "bg-green-500 bg-opacity-10 text-green-500",
  },
  [CommonStatus.Rejected]: {
    text: "Bị từ chối",
    className: "bg-red-500 bg-opacity-10 text-red-500",
  },
};

export const commonStatuses: Record<
  string,
  {
    variant: StatusBadgeVariant;
    title: string;
  }
> = {
  active: {
    variant: "success",
    title: "Hoạt động",
  },
  inactive: {
    variant: "warning",
    title: "Chờ duyệt",
  },
};

export const ITEMS_PER_PAGE = 10;

/** Rê vào bao lâu thì tooltip hiện: đủ để lướt qua không bật, ngắn hơn hẳn title của trình duyệt */
export const TOOLTIP_DELAY_MS = 400;
export const MAXIUM_DISCOUNT = 500_000;
export const MAX_RECIPIENTS = 100; // Giới hạn 100 email / request của Resend batch API
export const SEND_EMAIL_DELAY_MS = 1000; // Resend giới hạn 2 request / giây

// Chưa có khóa nào mở bán thì mời theo dõi kênh này (dashboard, khu vực học tập)
export const COMING_SOON_CHANNEL_URL = "https://fb.com/tuan.trananh.0509";

export const COMING_SOON_CHANNEL_LABEL = "Theo dõi Evondev";

export const BADGE_TONE_CLASSES: Record<BadgeTone, string> = {
  success:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  // Hổ phách ở nền tối dùng orange-400: amber-400 trôi sang vàng, đọc ra màu khác
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-orange-400",
  neutral: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",
  error: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};
