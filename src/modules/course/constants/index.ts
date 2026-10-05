import {
  COURSE_LEVEL_LABELS,
  CourseLevel,
  CourseStatus,
} from "@/shared/constants/course.constants";
import { ECourseLevel, ECourseStatus } from "@/types/enums";
import { FileText, MessageCircle } from "lucide-react";
import type {
  CourseIncludeItem,
  CourseSelectOption,
  CourseUpdateData,
  CourseUpdatePreviewState,
  ExploreFilters,
  ExploreLevelOption,
  ExplorePreviewStateLink,
  ExploreSort,
  ExploreSortOption,
  PreviewExploreCourseSeed,
} from "../types";

// 12 chia hết cho lưới 2, 3 và 4 cột nên hàng cuối của trang đầy
export const EXPLORE_PAGE_SIZE = 12;

// Gõ xong dừng chừng này mới tìm, tránh gọi server mỗi phím
export const EXPLORE_SEARCH_DEBOUNCE_MS = 400;

export const EXPLORE_DEFAULT_FILTERS: ExploreFilters = {
  search: "",
  isFree: false,
  sort: "moi",
  page: 1,
};

export const EXPLORE_LEVEL_OPTIONS: ExploreLevelOption[] = [
  { slug: "co-ban", level: CourseLevel.Easy },
  { slug: "trung-binh", level: CourseLevel.Medium },
  { slug: "nang-cao", level: CourseLevel.Expert },
];

export const EXPLORE_SORT_OPTIONS: ExploreSortOption[] = [
  { value: "moi", label: "Mới nhất" },
  { value: "xem-nhieu", label: "Xem nhiều" },
  { value: "danh-gia", label: "Đánh giá cao" },
];

// Luôn chốt bằng createdAt rồi _id để thứ tự cố định giữa các trang
export const EXPLORE_SORT_STAGES: Record<
  ExploreSort,
  Record<string, 1 | -1>
> = {
  moi: { createdAt: -1, _id: -1 },
  "xem-nhieu": { views: -1, createdAt: -1, _id: -1 },
  "danh-gia": {
    averageRating: -1,
    ratingCount: -1,
    createdAt: -1,
    _id: -1,
  },
};

// ----- Chỉ dùng cho trang xem trước ở dev (/explore-preview) -----
// Khóa mới dự kiến xen khóa cũ, dữ liệu giả hoàn toàn: tên, giá, ảnh Unsplash
const unsplashImage = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?w=800&q=80&auto=format&fit=crop`;

export const PREVIEW_EXPLORE_COURSES: PreviewExploreCourseSeed[] = [
  {
    slug: "preview-ai-cho-nguoi-moi",
    title: "AI cho người mới: dùng ChatGPT, Claude để học code nhanh hơn",
    image: unsplashImage("1498050108023-c5249f4df085"),
    level: CourseLevel.Easy,
    price: 0,
    salePrice: 0,
    free: true,
    rating: [5, 5, 4],
    views: 12_480,
  },
  {
    slug: "preview-vibe-coding",
    title:
      "Vibe Coding thực chiến: dựng app với AI từ ý tưởng tới bản chạy được",
    image: unsplashImage("1555066931-4365d14bab8c"),
    level: CourseLevel.Easy,
    price: 99_000,
    salePrice: 299_000,
    free: false,
    rating: [5, 5, 5, 5],
    views: 38_216,
  },
  {
    slug: "preview-prompt-cho-lap-trinh-vien",
    title:
      "Prompt cho lập trình viên: viết yêu cầu để AI ra code dùng được ngay, không phải sửa đi sửa lại cả buổi chiều",
    image: unsplashImage("1677442136019-21780ecad995"),
    level: CourseLevel.Medium,
    price: 149_000,
    salePrice: 249_000,
    free: false,
    rating: [],
    views: 0,
  },
  {
    slug: "preview-bao-mat-web",
    title: "Bảo mật web cho dev dùng AI",
    image: unsplashImage("1563986768609-322da13575f3"),
    level: CourseLevel.Medium,
    price: 199_000,
    salePrice: 0,
    free: false,
    rating: [],
    views: 1_204,
  },
  {
    slug: "preview-typescript-co-ban",
    title: "Khóa học Typescript cơ bản dành cho người mới",
    image: "https://utfs.io/f/c441d98a-8b32-49a2-8f4d-a37be5eedb15-o4mqd1.jpg",
    level: CourseLevel.Easy,
    price: 0,
    salePrice: 0,
    free: true,
    rating: [5, 4, 5, 4, 4, 5, 4],
    views: 90_617,
  },
  {
    slug: "preview-len-production",
    title: "Đưa sản phẩm lên production: deploy, log và giám sát",
    image: unsplashImage("1551288049-bebda4e38f71"),
    level: CourseLevel.Expert,
    price: 299_000,
    salePrice: 499_000,
    free: false,
    rating: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4],
    views: 5_320,
  },
  {
    slug: "preview-nextjs-pro",
    title: "Khóa học NextJS Pro - Xây dựng E Learning System hoàn chỉnh",
    image: "https://utfs.io/f/97868c0d-8a10-431e-a2d4-ca1be2436392-hcfblw.png",
    level: CourseLevel.Expert,
    price: 699_000,
    salePrice: 1_199_000,
    free: false,
    rating: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4],
    views: 120_791,
  },
  {
    slug: "preview-viet-test",
    title: "Viết test cho code AI sinh ra",
    image: unsplashImage("1517694712202-14dd9538aa97"),
    level: CourseLevel.Medium,
    price: 129_000,
    salePrice: 0,
    free: false,
    rating: [5, 5],
    views: 860,
  },
  {
    slug: "preview-git-github",
    title: "Git và GitHub cho người mới",
    image: "",
    level: CourseLevel.Easy,
    price: 0,
    salePrice: 0,
    free: true,
    rating: [],
    views: 310,
  },
];

export const PREVIEW_EXPLORE_STATE_LINKS: ExplorePreviewStateLink[] = [
  { state: "du-lieu", label: "Có 9 khóa" },
  { state: "mot-khoa", label: "Chỉ 1 khóa" },
  { state: "khong-ket-qua", label: "Không có kết quả" },
  { state: "chua-co-khoa", label: "Chưa có khóa nào" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];

// Neo của khối "Nội dung khóa học", nút "Học thử" cuộn tới đây
export const COURSE_CURRICULUM_SECTION_ID = "noi-dung";

export const RATING_STAR_POSITIONS: number[] = [1, 2, 3, 4, 5];

// Dòng "Khóa học gồm" trong thẻ mua, sau dòng số bài và thời lượng video
export const COURSE_EXTRA_INCLUDES: CourseIncludeItem[] = [
  { icon: FileText, label: "Có tài liệu kèm theo" },
  { icon: MessageCircle, label: "Hỗ trợ trong quá trình học" },
];

// Bề rộng vệt chờ ở trang chi tiết khóa học: dài ngắn lệch nhau cho giống chữ.
// Dòng "Khóa học gồm" luôn có 3 mục: số bài + COURSE_EXTRA_INCLUDES
export const COURSE_DETAILS_SKELETON_INCLUDE_WIDTHS: string[] = [
  "w-3/5",
  "w-1/2",
  "w-2/3",
];

export const COURSE_DETAILS_SKELETON_OUTCOME_WIDTHS: string[] = [
  "w-3/4",
  "w-2/3",
  "w-4/5",
  "w-1/2",
];

export const COURSE_DETAILS_SKELETON_CHAPTER_WIDTHS: string[] = [
  "w-2/5",
  "w-1/3",
  "w-1/2",
  "w-1/4",
  "w-2/5 sm:w-1/3",
];

// ----- Trang cập nhật khóa học -----
export const COURSE_LEVEL_OPTIONS: CourseSelectOption[] = Object.values(
  CourseLevel,
).map((level) => ({ value: level, label: COURSE_LEVEL_LABELS[level] }));

export const COURSE_STATUS_OPTIONS: CourseSelectOption[] = [
  { value: CourseStatus.Approved, label: "Đã duyệt" },
  { value: CourseStatus.Pending, label: "Chờ duyệt" },
  { value: CourseStatus.Rejected, label: "Bị từ chối" },
];

// Viền đỏ khi FormControl gắn aria-invalid (Input, Select chưa tự có trạng thái lỗi)
export const COURSE_FORM_CONTROL_CLASS_NAME =
  "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/10";

export const COURSE_IMAGE_HINT = "Ảnh 16:9, hiện ở thẻ khóa học và đầu trang bán";

// ----- Chỉ dùng cho trang xem trước ở dev (/course-update-preview) -----
// Dữ liệu giả: tiêu đề dài nhất đang có, đủ yêu cầu, kết quả, Q/A
const PREVIEW_COURSE_UPDATE_FILLED: CourseUpdateData = {
  title:
    "Vibe Coding Thực Chiến: Xây Dựng Ứng Dụng AI Hoàn Chỉnh Từ Ý Tưởng Đến Thanh Toán",
  slug: "vibe-coding-ai",
  price: 99000,
  salePrice: 299000,
  intro: "",
  desc: "<p>Học cách biến một ý tưởng thành ứng dụng AI hoàn chỉnh với landing page, payment, email, Telegram ops, AI agent, branding, testing và security, thông qua một case study thật.</p>",
  level: ECourseLevel.EASY,
  image:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop",
  status: ECourseStatus.REJECTED,
  cta: "Mua ngay",
  seoKeywords: "",
  free: false,
  info: {
    requirements: ["Biết HTML, CSS cơ bản", "Có máy tính cài được Node.js 20 trở lên"],
    gained: [
      "Tự dựng được landing page có thanh toán và email tự động",
      "Biết nối AI agent vào sản phẩm thật",
    ],
    qa: [
      {
        question: "Chưa biết code có học được không?",
        answer: "Được. Khóa đi từ con số 0, mỗi bước có prompt mẫu để chép.",
      },
    ],
  },
};

export const PREVIEW_COURSE_UPDATE_DATA: Record<
  CourseUpdatePreviewState,
  CourseUpdateData
> = {
  "du-lieu": PREVIEW_COURSE_UPDATE_FILLED,
  rong: {
    ...PREVIEW_COURSE_UPDATE_FILLED,
    title: "Khóa học mới",
    slug: "khoa-hoc-moi",
    price: 0,
    salePrice: 0,
    desc: "",
    image: "",
    status: ECourseStatus.PENDING,
    free: true,
    info: { requirements: [], gained: [], qa: [] },
  },
};
