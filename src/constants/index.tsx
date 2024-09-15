import {
  IconComment,
  IconCoupon,
  IconCourseManage,
  IconCube,
  IconOrder,
  IconPlay,
  IconStudy,
  IconUser,
  IconUsers,
} from "@/components/icons";
import { TMenuLink } from "@/types";
import {
  ECommonStatus,
  ECourseLevel,
  EOrderStatus,
  EReactionType,
  EUserStatus,
} from "@/types/enums";

export const menuLinks: TMenuLink[] = [
  {
    title: "Overview",
    icon: <IconCube></IconCube>,
    url: "/admin/overview",
    isExpert: true,
  },
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
    title: "Quản lý Coupon",
    icon: <IconCoupon></IconCoupon>,
    url: "/admin/coupon/manage",
    isAdmin: true,
  },
  {
    title: "Profile",
    icon: <IconUser></IconUser>,
    url: "/profile",
    isAuth: true,
  },
];
export const baseButtonClassName =
  "rounded-lg h-10 inline-flex items-center justify-center text-center px-5 font-bold min-w-[120px] transition-all text-sm flex-shrink-0";

export const primaryButtonClassName = `bg-primary text-white bg-primary button-styles ${baseButtonClassName}`;

export const actionClassName =
  "size-8 flex items-center justify-center bg-gray-100 dark:bg-grayDarkest rounded  p-2 transition-all  hover:text-gray-500 dark:hover:text-opacity-80";

export const boxDetailClassName =
  "rounded-lg p-5 bgDarkMode borderDarkMode flex flex-col items-start gap-1";

export const widgetClassName = "p-5 rounded-lg bgDarkMode borderDarkMode";

export const courseStatusClassName =
  "text-xs font-semibold  inline-flex py-1 px-3 rounded-full whitespace-nowrap";
export const baseStatusClassName =
  "text-xs font-semibold  inline-flex py-1 px-3 rounded-full whitespace-nowrap";
export const pagiBtn =
  "size-10 rounded bg-gray-900 dark:bg-white dark:text-gray-900 flex items-center justify-center text-white hover:opacity-90 p-2";
export const ArrowRight = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);
export const ArrowLeft = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);
export const courseStatus = {
  approved: {
    text: "Đã duyệt",
    className: "bg-green-500 text-green-500",
  },
  pending: {
    text: "Chờ duyệt",
    className: "bg-orange-500 text-orange-500",
  },
  rejected: {
    text: "Bị từ chối",
    className: "bg-red-500 text-red-500",
  },
};
export const orderStatus: Record<
  EOrderStatus,
  {
    text: string;
    className: string;
  }
> = {
  APPROVED: {
    text: "Đã duyệt",
    className: "bg-green-500 text-green-500",
  },
  PENDING: {
    text: "Chờ duyệt",
    className: "bg-orange-500 text-orange-500",
  },
  REJECTED: {
    text: "Bị từ chối",
    className: "bg-red-500 text-red-500",
  },
};
export const userStatus: Record<
  EUserStatus,
  {
    text: string;
    className: string;
  }
> = {
  active: {
    text: "Hoạt động",
    className: "bg-green-500 bg-opacity-10 text-green-500",
  },
  inactive: {
    text: "Không hoạt động",
    className: "bg-red-500 bg-opacity-10 text-red-500",
  },
};

export const editorOptions = (field: any, theme: any) => ({
  initialValue: "",
  onBlur: field.onBlur,
  onEditorChange: (content: any) => field.onChange(content),
  init: {
    codesample_global_prismjs: true,
    skin: theme === "dark" ? "oxide-dark" : "oxide",
    height: 300,
    menubar: false,
    plugins: [
      "advlist",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "codesample",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "heading",
    ],
    toolbar:
      "undo redo | " +
      "codesample | bold italic forecolor | alignleft aligncenter |" +
      "alignright alignjustify | bullist numlist |" +
      "image |" +
      "h1 h2 h3 h4 h5 h6 | preview | fullscreen |" +
      "link",
    content_style: `@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');body { font-family: Manrope,Helvetica,Arial,sans-serif; font-size:14px; line-height: 2; padding-bottom: 32px; } img { max-width: 100%; height: auto; display: block; margin: 0 auto; };`,
  },
});
export const courseLevel: Record<ECourseLevel, string> = {
  easy: "Dễ",
  medium: "Trung bình",
  expert: "Khó",
};
export const reactions: {
  icon: string;
  value: EReactionType;
  rating: number;
}[] = [
  {
    icon: "/reactions/awesome.png",
    value: EReactionType.AWESOME,
    rating: 5,
  },
  {
    icon: "/reactions/good.png",
    value: EReactionType.GOOD,
    rating: 4,
  },
  {
    icon: "/reactions/meh.png",
    value: EReactionType.MEH,
    rating: 3,
  },
  {
    icon: "/reactions/bad.png",
    value: EReactionType.BAD,
    rating: 2,
  },
  {
    icon: "/reactions/terrible.png",
    value: EReactionType.TERRIBLE,
    rating: 1,
  },
];

export const commonStatus: Record<
  ECommonStatus,
  {
    text: string;
    className: string;
  }
> = {
  pending: {
    text: "Chờ duyệt",
    className: "bg-orange-500 bg-opacity-10 text-orange-500",
  },
  approved: {
    text: "Đã duyệt",
    className: "bg-green-500 bg-opacity-10 text-green-500",
  },
  rejected: {
    text: "Bị từ chối",
    className: "bg-red-500 bg-opacity-10 text-red-500",
  },
};
export const userPermissions = {
  create_course: "create:course",
  update_course: "update:course",
  create_lecture: "create:lecture",
  update_lecture: "update:lecture",
  delete_lecture: "delete:lecture",
  create_lesson: "create:lesson",
  update_lesson: "update:lesson",
  delete_lesson: "delete:lesson",
  update_comment: "update:comment",
  delete_comment: "delete:comment",
  create_category: "create:category",
  update_category: "update:category",
  delete_category: "delete:category",
} satisfies Record<string, string>;
export type TUserPermission = keyof typeof userPermissions;
export const adminRoutes = ["/admin/overview", "/admin/user/manage"];
export const commonPath = {
  LOGIN: "/sign-in",
};
