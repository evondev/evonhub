import {
  IconCoupon,
  IconCourseManage,
  IconCube,
  IconEmail,
  IconMoney,
  IconOrder,
  IconPlay,
  IconSparkles,
  IconStudy,
  IconUser,
  IconUsers,
} from "../components";
import { MenuLinkItemProps, StatusBadgeVariant } from "../types";

export enum CommonStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

export const menuLinks: MenuLinkItemProps[] = [
  {
    title: "Khám phá",
    icon: <IconPlay></IconPlay>,
    url: "/",
  },
  {
    title: "Khu vực học tập",
    icon: <IconStudy></IconStudy>,
    url: "/study",
  },
  {
    title: "Săn mã giảm giá",
    icon: <IconCube />,
    url: "/coupons",
    isNew: true,
  },
  {
    title: "Quản lý khóa học",
    icon: <IconCourseManage />,
    url: "/admin/course/manage",
    isExpert: true,
    isHideMobile: true,
  },
  {
    title: "Quản lý đơn hàng",
    icon: <IconOrder />,
    url: "/admin/order/manage",
    isExpert: true,
  },
  {
    title: "Quản lý thành viên",
    icon: <IconUsers />,
    url: "/admin/user/manage",
    isAdmin: true,
  },
  // {
  //   title: "Quản lý đánh giá",
  //   icon: <IconStar />,
  //   url: "/admin/rating/manage",
  //   isAdmin: true,
  //   isHideMobile: true,
  // },
  // {
  //   title: "Quản lý bình luận",
  //   icon: <IconComment />,
  //   url: "/admin/comment/manage",
  //   isAdmin: true,
  //   isHideMobile: true,
  // },
  {
    title: "Quản lý emails",
    icon: <IconEmail />,
    url: "/admin/email/manage",
    isAdmin: true,
    isHideMobile: true,
  },
  {
    title: "Quản lý coupon",
    icon: <IconCoupon />,
    url: "/admin/coupon/manage",
    isAdmin: true,
    isHideMobile: true,
  },
  {
    title: "Membership",
    icon: <IconMoney />,
    url: "/membership",
    isHot: true,
  },
  {
    title: "Sắp ra mắt",
    icon: <IconSparkles />,
    url: "/coming-soon",
  },

  {
    title: "Profile",
    icon: <IconUser />,
    url: "/profile",
    isAuth: true,
    isHideMobile: true,
  },
];
export const adminRoutes = ["/admin/overview", "/admin/user/manage"];

export const statusActions = [
  {
    text: "Tất cả",
    value: "",
    className:
      "bg-gray-100 text-gray-500 border border-gray-500 dark:bg-grayDarkest dark:text-gray-200",
  },
  {
    text: "Đã duyệt",
    value: CommonStatus.Approved,
    className: "bg-green-100 text-green-500 border border-green-500",
  },
  {
    text: "Chờ duyệt",
    value: CommonStatus.Pending,
    className: "bg-orange-100 text-orange-500 border border-orange-500",
  },
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
export const MAXIUM_DISCOUNT = 500_000;
export const MAX_RECIPIENTS = 20; // Giới hạn SES
export const RATE_LIMIT = 10; //
