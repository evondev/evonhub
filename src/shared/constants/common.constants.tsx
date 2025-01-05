import {
  IconComment,
  IconCourseManage,
  IconOrder,
  IconPlay,
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
    title: "Khu vực tu luyện",
    icon: <IconStudy></IconStudy>,
    url: "/study",
  },

  {
    title: "Quản lý khóa học",
    icon: <IconCourseManage></IconCourseManage>,
    url: "/admin/course/manage",
    isExpert: true,
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
    title: "Sắp ra mắt",
    icon: <IconStudy></IconStudy>,
    url: "/coming-soon",
  },
  {
    title: "Profile",
    icon: <IconUser></IconUser>,
    url: "/profile",
    isAuth: true,
  },
];
export const adminRoutes = ["/admin/overview", "/admin/user/manage"];
