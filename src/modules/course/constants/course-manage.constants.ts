import { CourseStatus } from "@/shared/constants/course.constants";
import { BadgeTone, FilterTabItem } from "@/shared/types";
import {
  CourseManageFilters,
  CourseManagePreviewStateLink,
  CourseManageRow,
  CourseManageTab,
  CourseManageTabCounts,
} from "../types/course-manage.types";

export const COURSE_MANAGE_TAB_VALUES = [
  "all",
  CourseStatus.Approved,
  CourseStatus.Pending,
  CourseStatus.Rejected,
] as const;

export const COURSE_MANAGE_STATUS_LABELS: Record<CourseStatus, string> = {
  [CourseStatus.Approved]: "Đã duyệt",
  [CourseStatus.Pending]: "Chờ duyệt",
  // Rejected là thôi bán: người đã mua vẫn học được (LEARNABLE_COURSE_STATUSES)
  [CourseStatus.Rejected]: "Ngừng bán",
};

export const COURSE_MANAGE_STATUS_TONES: Record<CourseStatus, BadgeTone> = {
  [CourseStatus.Approved]: "success",
  [CourseStatus.Pending]: "warning",
  [CourseStatus.Rejected]: "neutral",
};

export const COURSE_MANAGE_TABS: FilterTabItem<CourseManageTab>[] = [
  { value: "all", label: "Tất cả" },
  {
    value: CourseStatus.Approved,
    label: COURSE_MANAGE_STATUS_LABELS[CourseStatus.Approved],
  },
  {
    value: CourseStatus.Pending,
    label: COURSE_MANAGE_STATUS_LABELS[CourseStatus.Pending],
  },
  {
    value: CourseStatus.Rejected,
    label: COURSE_MANAGE_STATUS_LABELS[CourseStatus.Rejected],
  },
];

export const COURSE_MANAGE_DEFAULT_FILTERS: CourseManageFilters = {
  search: "",
  tab: "all",
  isFree: false,
  page: 1,
};

export const COURSE_ADD_NEW_PATH = "/admin/course/add-new";

/** Khung chờ vẽ chừng này dòng, gần bằng một trang thật */
export const COURSE_MANAGE_SKELETON_ROW_COUNT = 8;

export const COURSE_MANAGE_PREVIEW_STATE_LINKS: CourseManagePreviewStateLink[] =
  [
    { state: "du-lieu", label: "Có dữ liệu" },
    { state: "rong", label: "Rỗng do tìm" },
    { state: "dang-tai", label: "Đang tải" },
    { state: "loi", label: "Lỗi" },
  ];

/** Trang xem trước giả như đang xem trang đầu của cả danh sách thật */
export const COURSE_MANAGE_PREVIEW_TAB_COUNTS: CourseManageTabCounts = {
  all: 24,
  [CourseStatus.Approved]: 15,
  [CourseStatus.Pending]: 5,
  [CourseStatus.Rejected]: 4,
};

/** Từ khoá trang xem trước dùng cho trạng thái "Rỗng do tìm" */
export const COURSE_MANAGE_PREVIEW_EMPTY_KEYWORD =
  "khoá học lập trình game unity 3d nâng cao";

/** Khoá học giả cho trang xem trước: tên dài, không ảnh, giá lớn, 0 học viên */
export const PREVIEW_MANAGED_COURSES: CourseManageRow[] = [
  {
    id: "preview-course-1",
    slug: "vibe-coding-thuc-chien",
    title:
      "Vibe Coding Thực Chiến: Xây Dựng Ứng Dụng AI Hoàn Chỉnh Từ Ý Tưởng Đến Thanh Toán",
    image: "https://utfs.io/f/97868c0d-8a10-431e-a2d4-ca1be2436392-hcfblw.png",
    status: CourseStatus.Pending,
    price: 99000,
    isFree: false,
    studentCount: 0,
    createdAt: "2026-05-14T08:00:00.000Z",
  },
  {
    id: "preview-course-2",
    slug: "nextjs-15-app-router",
    title: "Khóa học Next.js 15 App Router từ A tới Z cho dự án thật",
    status: CourseStatus.Pending,
    price: 1290000,
    isFree: false,
    studentCount: 0,
    createdAt: "2026-04-02T08:00:00.000Z",
  },
  {
    id: "preview-course-3",
    slug: "reactjs-master",
    title: "Khóa học ReactJS Master - Nắm vững kiến thức React chuyên sâu",
    image: "https://utfs.io/f/50be40a2-35e9-4420-9f8a-3a769f0a8a17-d8ajqo.jpg",
    status: CourseStatus.Approved,
    price: 399000,
    isFree: false,
    studentCount: 28,
    createdAt: "2025-02-01T08:00:00.000Z",
  },
  {
    id: "preview-course-4",
    slug: "typescript-co-ban",
    title: "Khóa học Typescript cơ bản dành cho người mới",
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80&auto=format&fit=crop",
    status: CourseStatus.Approved,
    price: 249000,
    isFree: false,
    studentCount: 12,
    createdAt: "2025-01-10T08:00:00.000Z",
  },
  {
    id: "preview-course-5",
    slug: "html-css-co-ban",
    title:
      "Tự học thiết kế website hiệu quả với khoá học HTML CSS cơ bản cho người mới",
    image: "https://utfs.io/f/c441d98a-8b32-49a2-8f4d-a37be5eedb15-o4mqd1.jpg",
    status: CourseStatus.Approved,
    price: 0,
    isFree: true,
    studentCount: 1686,
    createdAt: "2024-12-16T08:00:00.000Z",
  },
  {
    id: "preview-course-6",
    slug: "html-css-nang-cao",
    title:
      "Khoá học HTML CSS nâng cao cắt giao diện toàn tập với Gulp, Pug và Sass",
    image: "https://utfs.io/f/4ad01579-440e-4098-8712-b60ffced479f-kzr59j.jpg",
    status: CourseStatus.Approved,
    price: 0,
    isFree: true,
    studentCount: 1694,
    createdAt: "2024-12-09T08:00:00.000Z",
  },
  {
    id: "preview-course-7",
    slug: "javascript-google-meet",
    title: "Khóa học Javascript online từ Google Meet",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80&auto=format&fit=crop",
    status: CourseStatus.Rejected,
    price: 499000,
    isFree: false,
    studentCount: 515,
    createdAt: "2024-11-27T08:00:00.000Z",
  },
  {
    id: "preview-course-8",
    slug: "reactjs-co-ban-nang-cao",
    title: "Khóa học ReactJS từ cơ bản đến nâng cao dành cho người mới",
    image: "https://utfs.io/f/4ad01579-440e-4098-8712-b60ffced479f-kzr59j.jpg",
    status: CourseStatus.Approved,
    price: 0,
    isFree: true,
    studentCount: 656,
    createdAt: "2024-11-23T08:00:00.000Z",
  },
  {
    id: "preview-course-9",
    slug: "javascript-co-ban-nang-cao",
    title: "Khóa học Javascript từ cơ bản đến nâng cao cho người mới bắt đầu",
    image: "https://utfs.io/f/c441d98a-8b32-49a2-8f4d-a37be5eedb15-o4mqd1.jpg",
    status: CourseStatus.Approved,
    price: 0,
    isFree: true,
    studentCount: 539,
    createdAt: "2024-11-23T07:00:00.000Z",
  },
  {
    id: "preview-course-10",
    slug: "html-css-master",
    title: "Khóa học HTML CSS Master - Giúp bạn Master kỹ năng HTML CSS",
    image: "https://utfs.io/f/97868c0d-8a10-431e-a2d4-ca1be2436392-hcfblw.png",
    status: CourseStatus.Rejected,
    price: 0,
    isFree: true,
    studentCount: 957,
    createdAt: "2024-11-22T08:00:00.000Z",
  },
];
