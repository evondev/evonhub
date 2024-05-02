import {
  IconCategory,
  IconCourseManage,
  IconHome,
  IconPlay,
  IconUsers,
} from "@/components/icons";
import { TMenuLink } from "@/types";

export const menuLinks: TMenuLink[] = [
  {
    title: "Dashboard",
    icon: <IconHome></IconHome>,
    url: "/",
  },
  {
    title: "Courses",
    icon: <IconPlay></IconPlay>,
    url: "/courses",
  },
  {
    title: "Manage courses",
    icon: <IconCourseManage></IconCourseManage>,
    url: "/admin/course/manage",
    isAdmin: true,
  },
  {
    title: "Manage members",
    icon: <IconUsers></IconUsers>,
    url: "/admin/user/manage",
    isAdmin: true,
  },
  {
    title: "Manage categories",
    icon: <IconCategory></IconCategory>,
    url: "/admin/category/manage",
    isAdmin: true,
  },
];
export const baseButtonClassName =
  "rounded-lg h-12 inline-flex items-center justify-center text-center px-5 font-semibold min-w-[100px]";
export const primaryButtonClassName = `bg-primary text-white ${baseButtonClassName}`;
export const actionClassName =
  "hover:text-white size-8 flex items-center justify-center bg-gray-100 dark:bg-grayDarkest rounded-full  transition-all";
export const boxDetailClassName =
  "rounded-lg p-5 bg-white dark:bg-grayDarker flex flex-col items-start gap-1";
export const widgetClassName = "p-5 rounded-lg bg-white dark:bg-grayDarker";
