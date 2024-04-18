import {
  IconDashboard,
  IconHome,
  IconPlay,
  IconUsers,
} from "@/components/icons";
import { TMenuLink } from "@/types";

export const menuLinks: TMenuLink[] = [
  {
    title: "Overview",
    icon: <IconDashboard></IconDashboard>,
    url: "/",
  },
  {
    title: "Home Page",
    icon: <IconHome></IconHome>,
    url: "/dashboard",
  },
  {
    title: "Courses",
    icon: <IconPlay></IconPlay>,
    url: "/courses",
  },
  {
    title: "Students",
    icon: <IconUsers></IconUsers>,
    url: "/students",
  },
];
