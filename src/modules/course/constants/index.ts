import { CourseLevel } from "@/shared/constants/course.constants";
import type {
  ExploreFilters,
  ExplorePreviewStateLink,
  ExploreSort,
  ExploreSortOption,
  PreviewExploreCourseSeed,
} from "../types";

// 12 chia hết cho lưới 2, 3 và 4 cột nên hàng cuối của trang đầy
export const EXPLORE_PAGE_SIZE = 12;

export const EXPLORE_SKELETON_CARD_COUNT = 6;

// Gõ xong dừng chừng này mới tìm, tránh gọi server mỗi phím
export const EXPLORE_SEARCH_DEBOUNCE_MS = 400;

export const EXPLORE_DEFAULT_FILTERS: ExploreFilters = {
  search: "",
  isFree: false,
  sort: "moi",
  page: 1,
};

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
