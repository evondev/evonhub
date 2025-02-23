import {
  IconComment,
  IconCourseManage,
  IconMoney,
  IconOrder,
  IconPlay,
  IconSparkles,
  IconStudy,
  IconUser,
  IconUsers,
} from "../components";
import { MenuLinkItemProps } from "../types";
import { CommonStatus } from "./course.constants";

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
    title: "Quản lý khóa học",
    icon: <IconCourseManage></IconCourseManage>,
    url: "/admin/course/manage",
    isExpert: true,
    isHideMobile: true,
  },
  {
    title: "Quản lý thành viên",
    icon: <IconUsers></IconUsers>,
    url: "/admin/user/manage",
    isAdmin: true,
  },
  {
    title: "Quản lý bình luận",
    icon: <IconComment></IconComment>,
    url: "/admin/comment/manage",
    isAdmin: true,
    isHideMobile: true,
  },
  {
    title: "Quản lý đơn hàng",
    icon: <IconOrder></IconOrder>,
    url: "/admin/order/manage",
    isExpert: true,
  },
  {
    title: "Membership",
    icon: <IconMoney></IconMoney>,
    url: "/membership",
  },
  {
    title: "Sắp ra mắt",
    icon: <IconSparkles></IconSparkles>,
    url: "/coming-soon",
  },
  {
    title: "Mã giảm giá",
    icon: <IconMoney></IconMoney>,
    url: "/coupons",
    isHideMobile: true,
  },
  {
    title: "Profile",
    icon: <IconUser></IconUser>,
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
