import { IconHome, IconPlay } from "@/components/icons";
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
    title: "Manage Courses",
    icon: <IconPlay></IconPlay>,
    url: "/admin/course/manage",
    isAdmin: true,
  },
];
export const primaryButtonClassName =
  "bg-primary text-white rounded-lg h-12 inline-flex items-center justify-center text-center px-5 font-semibold min-w-[125px]";
export const actionClassName =
  "hover:text-white size-8 flex items-center justify-center bg-gray-100 dark:bg-grayDarkest rounded-full  transition-all";
export const boxDetailClassName =
  "rounded-lg p-5 bg-white dark:bg-grayDarker flex flex-col items-start gap-1";
export const widgetClassName = "p-5 rounded-lg bg-white dark:bg-grayDarker";
