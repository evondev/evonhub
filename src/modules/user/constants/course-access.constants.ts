import { UserRole } from "@/shared/constants/user.constants";
import {
  CourseAccessCourse,
  CourseAccessPreviewStateLink,
  CourseAccessSource,
  CourseAccessUser,
} from "../types/course-access.types";

export const COURSE_ACCESS_SOURCE_LABELS: Record<CourseAccessSource, string> = {
  purchase: "Đã mua",
  manual: "Cấp tay",
};

/** Từ khoá dài hơn chừng này thì cắt khi nhắc lại trong câu "không có khóa nào khớp" */
export const COURSE_ACCESS_QUERY_PREVIEW_LENGTH = 24;

export const COURSE_ACCESS_SKELETON_ROW_COUNT = 3;

/** Thời gian giả lập cấp, thu hồi ở trang xem trước */
export const COURSE_ACCESS_PREVIEW_DELAY_MS = 700;

export const COURSE_ACCESS_PREVIEW_STATE_LINKS: CourseAccessPreviewStateLink[] =
  [
    { state: "du-lieu", label: "Có khóa" },
    { state: "hop-cap", label: "Hộp cấp khóa" },
    { state: "hop-thu-hoi", label: "Hộp thu hồi" },
    { state: "rong", label: "Chưa có khóa" },
    { state: "dang-tai", label: "Đang tải" },
    { state: "loi", label: "Lỗi" },
  ];

const unsplashImage = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?w=800&q=80&auto=format&fit=crop`;

export const PREVIEW_COURSE_ACCESS_USER: CourseAccessUser = {
  clerkId: "preview-clerk-ttvy166",
  name: "Trần Thị Vy",
  username: "ttvy166",
  email: "ttvy166@gmail.com",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  role: UserRole.User,
  createdAt: "2024-02-14T08:30:00.000Z",
  isLocked: false,
};

/** Danh mục khóa giả: đủ ca dài tên, thiếu ảnh, miễn phí, ngừng bán */
export const PREVIEW_COURSE_ACCESS_CATALOG: CourseAccessCourse[] = [
  {
    id: "preview-nextjs-pro",
    slug: "preview-nextjs-pro",
    title: "Khóa học NextJS Pro - Xây dựng E Learning System hoàn chỉnh",
    image: "https://utfs.io/f/97868c0d-8a10-431e-a2d4-ca1be2436392-hcfblw.png",
    price: 1_299_000,
    isFree: false,
    isRetired: false,
  },
  {
    id: "preview-vibe-coding",
    slug: "preview-vibe-coding",
    title: "Vibe coding: dựng một app thật từ ý tưởng tới lúc có người dùng",
    image: unsplashImage("1555066931-4365d14bab8c"),
    price: 899_000,
    isFree: false,
    isRetired: false,
  },
  {
    id: "preview-typescript-co-ban",
    slug: "preview-typescript-co-ban",
    title: "Khóa học Typescript cơ bản dành cho người mới",
    image: "https://utfs.io/f/c441d98a-8b32-49a2-8f4d-a37be5eedb15-o4mqd1.jpg",
    price: 0,
    isFree: true,
    isRetired: false,
  },
  {
    id: "preview-ai-cho-nguoi-moi",
    slug: "preview-ai-cho-nguoi-moi",
    title: "AI cho người mới: dùng ChatGPT, Claude để học code nhanh hơn",
    image: unsplashImage("1498050108023-c5249f4df085"),
    price: 599_000,
    isFree: false,
    isRetired: false,
  },
  {
    id: "preview-javascript-2023",
    slug: "preview-javascript-2023",
    title: "JavaScript căn bản 2023",
    image: unsplashImage("1517694712202-14dd9538aa97"),
    price: 499_000,
    isFree: false,
    isRetired: true,
  },
  {
    id: "preview-react-hooks",
    slug: "preview-react-hooks",
    title: "React Hooks chuyên sâu: useEffect, useMemo, custom hook và những lỗi hay gặp khi đi làm",
    image: unsplashImage("1461749280684-dccba630e2f6"),
    price: 799_000,
    isFree: false,
    isRetired: false,
  },
  {
    id: "preview-bao-mat-web",
    slug: "preview-bao-mat-web",
    title: "Bảo mật web cho dev dùng AI",
    price: 699_000,
    isFree: false,
    isRetired: false,
  },
  {
    id: "preview-tailwind-2022",
    slug: "preview-tailwind-2022",
    title: "Tailwind CSS từ A tới Z (bản 2022)",
    image: unsplashImage("1587620962725-abab7fe55159"),
    price: 399_000,
    isFree: false,
    isRetired: true,
  },
];
