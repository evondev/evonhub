import { CourseLevel } from "@/shared/constants/course.constants";
import { LayoutGrid, List } from "lucide-react";
import type {
  PreviewVideoListItem,
  VideoCategoryOption,
  VideoListFilters,
  VideoListPreviewStateLink,
  VideoListViewOption,
} from "../types";

export const VIDEO_LIST_PATH = "/videos";

export const VIDEO_LIST_PREVIEW_PATH = "/videos-preview";

// Năm đầu dưới 30 video: một trang lấy hết, chưa cần phân trang
export const VIDEO_LIST_LIMIT = 60;

export const VIDEO_LIST_DEFAULT_FILTERS: VideoListFilters = {
  search: "",
  isFree: false,
  categorySlug: "",
};

// ?xem=danh-sach: cùng kiểu tên tiếng Việt với ?gia=mien-phi, ?danhmuc=
export const VIDEO_LIST_VIEW_PARAM = "xem";

export const VIDEO_LIST_LIST_VIEW_VALUE = "danh-sach";

export const VIDEO_LIST_VIEW_OPTIONS: VideoListViewOption[] = [
  { view: "grid", label: "Xem dạng lưới", icon: LayoutGrid },
  { view: "list", label: "Xem dạng danh sách", icon: List },
];

// Mô tả ngắn ở dạng danh sách chỉ hiện hai dòng: cắt bớt cho nhẹ dữ liệu trả về
export const VIDEO_EXCERPT_MAX_LENGTH = 220;

// Cuối trang xem video: hai hàng ở lưới 2 cột
export const RELATED_VIDEO_COUNT = 4;

// Hàng đầu của lưới 4 cột nằm trong màn đầu, tải ảnh ngay
export const VIDEO_LIST_PRIORITY_COUNT = 4;

// Khung chờ vẽ đủ hai hàng ở lưới 4 cột
export const VIDEO_LIST_SKELETON_COUNT = 8;

// ----- Chỉ dùng cho trang xem trước ở dev (/videos-preview) -----

export const PREVIEW_VIDEO_LIST_STATE_LINKS: VideoListPreviewStateLink[] = [
  { state: "du-lieu", label: "Có 10 video" },
  { state: "khong-ket-qua", label: "Không có kết quả" },
  { state: "chua-co-video", label: "Chưa có video nào" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];

export const PREVIEW_VIDEO_LIST_EMPTY_KEYWORD = "react hook form";

interface PreviewVideoSeed {
  title: string;
  /** Mã ảnh Unsplash; rỗng là video chưa có ảnh bìa */
  unsplashId: string;
  duration: number;
  price: number;
  salePrice: number;
  isFree: boolean;
  level: CourseLevel;
  daysAgo: number;
  categorySlug: string;
  ratings: number[];
  /** Rỗng là video chưa viết mô tả */
  excerpt: string;
  isComingSoon?: boolean;
}

// Đủ ca biên: tên dài hai dòng, chưa có ảnh, chưa có đánh giá, video hơn một giờ
const previewVideoSeeds: PreviewVideoSeed[] = [
  { title: "Dựng hiệu ứng cuộn mượt với GSAP ScrollTrigger", unsplashId: "1542831371-29b0f74f9713", duration: 18, price: 49000, salePrice: 99000, isFree: false, level: CourseLevel.Medium, daysAgo: 3, categorySlug: "javascript", ratings: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 5] , excerpt: "Làm hiệu ứng ghim khối, chạy chữ theo thanh cuộn và parallax ảnh nền bằng ScrollTrigger, kèm cách dọn timeline khi đổi trang để không rò bộ nhớ." },
  { title: "5 lỗi useEffect hay gặp và cách sửa", unsplashId: "1555949963-ff9fe0c870eb", duration: 12, price: 0, salePrice: 0, isFree: true, level: CourseLevel.Easy, daysAgo: 7, categorySlug: "react", ratings: [5, 5, 4, 5, 5, 5, 4, 5] , excerpt: "Thiếu dependency, gọi API hai lần ở Strict Mode, quên dọn interval, race condition khi fetch và set state sau khi unmount: xem từng lỗi rồi sửa ngay trong code." },
  { title: "Tối ưu ảnh trong Next.js: next/image, sizes, priority dùng sao cho đúng để điểm Lighthouse lên xanh", unsplashId: "1461749280684-dccba630e2f6", duration: 26, price: 79000, salePrice: 0, isFree: false, level: CourseLevel.Expert, daysAgo: 14, categorySlug: "nextjs", ratings: [], isComingSoon: true, excerpt: "Hiểu sizes để trình duyệt chọn đúng ảnh, khi nào nên priority, cách tránh nhảy bố cục và đo lại bằng Lighthouse trước, sau khi sửa." },
  { title: "Cấu hình ESLint + Prettier cho dự án React trong 10 phút", unsplashId: "1517694712202-14dd9538aa97", duration: 10, price: 0, salePrice: 0, isFree: true, level: CourseLevel.Easy, daysAgo: 15, categorySlug: "cong-cu", ratings: [5, 4, 5, 5, 4, 5, 5, 4] , excerpt: "" },
  { title: "Server Actions thực chiến: form, validate, revalidate", unsplashId: "1504639725590-34d0984388bd", duration: 32, price: 99000, salePrice: 149000, isFree: false, level: CourseLevel.Expert, daysAgo: 21, categorySlug: "nextjs", ratings: [5, 5, 5, 5] , excerpt: "Dựng form tạo bài viết với useFormState, validate bằng zod ở server, báo lỗi từng ô và revalidatePath để danh sách tự cập nhật." },
  { title: "Git rebase không còn đáng sợ", unsplashId: "", duration: 15, price: 0, salePrice: 0, isFree: true, level: CourseLevel.Medium, daysAgo: 32, categorySlug: "cong-cu", ratings: [5, 5, 4, 5, 5] , excerpt: "Rebase khác merge chỗ nào, gộp commit bằng rebase -i, xử lý xung đột từng bước và cứu nhánh bằng reflog khi lỡ tay." },
  { title: "Viết custom hook useDebounce và test bằng Vitest", unsplashId: "1587620962725-abab7fe55159", duration: 21, price: 39000, salePrice: 0, isFree: false, level: CourseLevel.Medium, daysAgo: 35, categorySlug: "react", ratings: [5, 4, 5, 4, 5, 4] , excerpt: "Tách logic debounce thành hook dùng lại được, rồi viết test với fake timer của Vitest để chắc chắn hook chạy đúng." },
  { title: "Deploy Next.js lên VPS với Docker và Nginx", unsplashId: "1551033406-611cf9a28f67", duration: 72, price: 149000, salePrice: 249000, isFree: false, level: CourseLevel.Expert, daysAgo: 62, categorySlug: "devops", ratings: [5, 5, 5, 5, 5, 4, 5, 5, 5] , excerpt: "Đóng gói ứng dụng bằng Dockerfile nhiều tầng, chạy sau Nginx làm reverse proxy, gắn SSL miễn phí và tự khởi động lại khi server reboot." },
  { title: "CSS Grid: 7 bố cục hay dùng nhất", unsplashId: "1498050108023-c5249f4df085", duration: 14, price: 0, salePrice: 0, isFree: true, level: CourseLevel.Easy, daysAgo: 65, categorySlug: "css", ratings: [], isComingSoon: true, excerpt: "Holy grail, lưới thẻ tự xuống dòng, sidebar co giãn, masonry giả và vài bố cục khác chỉ với vài dòng grid-template." },
  { title: "Zustand hay Redux Toolkit cho dự án vừa?", unsplashId: "1515879218367-8466d910aaa4", duration: 19, price: 59000, salePrice: 0, isFree: false, level: CourseLevel.Medium, daysAgo: 95, categorySlug: "react", ratings: [4, 5, 4, 4, 5] , excerpt: "So hai thư viện trên cùng một dự án mẫu: lượng code, cách tách store, devtools và lúc nào thì nên chọn cái nào." },
];

const DAY_MS = 24 * 60 * 60 * 1000;

// Chip của trang xem trước: chỉ các danh mục có video, xếp theo tên như server
export const PREVIEW_VIDEO_CATEGORIES: VideoCategoryOption[] = [
  { name: "Công cụ", slug: "cong-cu" },
  { name: "CSS", slug: "css" },
  { name: "DevOps", slug: "devops" },
  { name: "JavaScript", slug: "javascript" },
  { name: "Next.js", slug: "nextjs" },
  { name: "React", slug: "react" },
];

export const PREVIEW_VIDEO_LIST: PreviewVideoListItem[] = previewVideoSeeds.map(
  (seed, index) => ({
    _id: `preview-video-${index + 1}`,
    title: seed.title,
    slug: `preview-video-${index + 1}`,
    image: seed.unsplashId
      ? `https://images.unsplash.com/photo-${seed.unsplashId}?w=800&q=80&auto=format&fit=crop`
      : "",
    level: seed.level,
    rating: seed.ratings,
    price: seed.price,
    salePrice: seed.salePrice,
    free: seed.isFree,
    isComingSoon: Boolean(seed.isComingSoon),
    createdAt: new Date(Date.now() - seed.daysAgo * DAY_MS),
    duration: seed.duration,
    excerpt: seed.excerpt,
    categorySlug: seed.categorySlug,
  }),
);
