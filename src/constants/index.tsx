import {
  IconComment,
  IconCourseManage,
  IconCube,
  IconPlay,
  IconStudy,
  IconUser,
  IconUsers,
} from "@/components/icons";
import { TLevel, TMenuLink, TUserStatus } from "@/types";
import { EReactionType } from "@/types/enums";

export const menuLinks: TMenuLink[] = [
  {
    title: "Overview",
    icon: <IconCube></IconCube>,
    url: "/admin/overview",
    isAdmin: true,
  },
  {
    title: "Khu vực học tập",
    icon: <IconStudy></IconStudy>,
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
    title: "Quản lý bình luận",
    icon: <IconComment></IconComment>,
    url: "/admin/comment/manage",
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
export const userStatus: Record<
  TUserStatus,
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
    skin: theme === "dark" ? "oxide-dark" : "oxide",
    height: 200,
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
    content_style: `body { font-family: DM sans, Inter,Helvetica,Arial,sans-serif; font-size:14px; } img { max-width: 100%; height: auto; display: block; margin: 0 auto; }`,
  },
});
export const courseLevel: Record<TLevel, string> = {
  easy: "Dễ",
  medium: "Trung bình",
  expert: "Khó",
};
export const reactions: {
  icon: string;
  value: EReactionType;
}[] = [
  {
    icon: "/reactions/awesome.png",
    value: EReactionType.AWESOME,
  },
  {
    icon: "/reactions/good.png",
    value: EReactionType.GOOD,
  },
  {
    icon: "/reactions/meh.png",
    value: EReactionType.MEH,
  },
  {
    icon: "/reactions/bad.png",
    value: EReactionType.BAD,
  },
  {
    icon: "/reactions/terrible.png",
    value: EReactionType.TERRIBLE,
  },
];
