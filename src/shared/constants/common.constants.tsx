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
