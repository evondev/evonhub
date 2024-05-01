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
  "bg-primary text-white rounded-lg h-12 inline-flex items-center justify-center text-center px-5 font-semibold";
export const actionClassName =
  "hover:text-white size-8 flex items-center justify-center bg-gray-100 dark:bg-grayDarkest rounded-full  transition-all";
