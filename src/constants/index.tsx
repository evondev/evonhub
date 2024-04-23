import { IconHome, IconPlay } from "@/components/icons";
import { TMenuLink } from "@/types";

export const menuLinks: TMenuLink[] = [
  {
    title: "Dashboard",
    icon: <IconHome></IconHome>,
    url: "/",
  },
  // {
  //   title: "Overview",
  //   icon: <IconDashboard></IconDashboard>,
  //   url: "/overview",
  // },
  {
    title: "Courses",
    icon: <IconPlay></IconPlay>,
    url: "/courses",
  },
  {
    title: "Add new course",
    icon: <IconPlay></IconPlay>,
    url: "/not-admin/course/add-new",
  },
  // {
  //   title: "Students",
  //   icon: <IconUsers></IconUsers>,
  //   url: "/students",
  // },
];
