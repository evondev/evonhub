import {
  IconCategory,
  IconCourseManage,
  IconHome,
  IconPlay,
  IconUser,
  IconUsers,
} from "@/components/icons";
import { TMenuLink } from "@/types";

export const menuLinks: TMenuLink[] = [
  {
    title: "Khu vực học tập",
    icon: <IconHome></IconHome>,
    url: "/",
  },
  {
    title: "Khám phá",
    icon: <IconPlay></IconPlay>,
    url: "/explore",
  },
  {
    title: "Quản lý khóa học",
    icon: <IconCourseManage></IconCourseManage>,
    url: "/admin/course/manage",
    isAdmin: true,
  },
  {
    title: "Quản lý thành viên",
    icon: <IconUsers></IconUsers>,
    url: "/admin/user/manage",
    isAdmin: true,
  },
  {
    title: "Quản lý danh mục",
    icon: <IconCategory></IconCategory>,
    url: "/admin/category/manage",
    isAdmin: true,
  },
  {
    title: "Profile",
    icon: <IconUser></IconUser>,
    url: "/profile",
  },
];
export const baseButtonClassName =
  "rounded-md h-12 inline-flex items-center justify-center text-center px-5 font-bold min-w-[120px] transition-all text-sm";

export const primaryButtonClassName = `bg-primary text-white gradientPrimary gradientPrimaryHover ${baseButtonClassName}`;

export const actionClassName =
  "size-8 flex items-center justify-center bg-gray-100 dark:bg-grayDarkest rounded-lg  p-2 transition-all  hover:text-gray-500 dark:hover:text-opacity-80";

export const boxDetailClassName =
  "rounded-lg p-5 bg-white dark:bg-grayDarker flex flex-col items-start gap-1";

export const widgetClassName = "p-5 rounded-lg bg-white dark:bg-grayDarker";

export const courseStatusClassName =
  "text-xs font-semibold  inline-flex py-1 px-3 rounded-full whitespace-nowrap";

export const courseStatus = {
  approved: {
    text: "Đã duyệt",
    className: "bg-green-500 bg-opacity-10 text-green-500",
  },
  pending: {
    text: "Chờ duyệt",
    className: "bg-orange-500 bg-opacity-10 text-orange-500",
  },
  rejected: {
    text: "Bị từ chối",
    className: "bg-red-500 bg-opacity-10 text-red-500",
  },
};
