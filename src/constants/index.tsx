import {
  IconDashboard,
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
    title: "Overview",
    icon: <IconDashboard></IconDashboard>,
    url: "/overview",
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
