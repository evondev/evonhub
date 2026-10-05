import { GraduationCap, Rocket, Sparkles } from "lucide-react";
import {
  HeroCodeLine,
  PartnerLink,
  PreviewCourseProgress,
  PreviewCourseSeed,
  PreviewStateLink,
  RoadmapStepConfig,
} from "../types";

export const partnerLinks: PartnerLink[] = [
  { name: "Mayashare", url: "https://vncreatorpreneur.com/" },
  { name: "Evondev", url: "https://evondev.com/" },
];

// Lộ trình cho người mới. Khóa cũ đã gỡ, khóa mới chưa có nên để trống: khối
// lộ trình tự ẩn. Có khóa mới thì thêm bước ở đây, khóa chưa public thì ghi
// launchLabel để hiện là "Ra mắt …".
export const ROADMAP_STEPS: RoadmapStepConfig[] = [];

// Ít hơn số bước này thì không gọi là lộ trình, khối tự ẩn
export const ROADMAP_MIN_STEP_COUNT = 2;

export const ROADMAP_SUBTITLE =
  "Từ để AI viết code, tới hiểu nó và đưa nó chạy thật";

// Đoạn code minh hoạ ở khối đầu trang: AI viết, dòng 3 dính SQL injection
export const HERO_CODE_FILE_NAME = "login.ts · AI vừa viết";

export const HERO_CODE_LINES: HeroCodeLine[] = [
  { code: "export async function login(email) {" },
  { code: "  const user = await db.query(" },
  { code: "    `SELECT * FROM users WHERE email='${email}'`", isFlagged: true },
  { code: "  );" },
  { code: "  return user;" },
  { code: "}" },
];

export const HERO_CODE_WARNING_TITLE = "Dòng 3 dính SQL injection.";

export const HERO_CODE_WARNING_TEXT =
  "Chạy được, nhưng ai cũng đọc được cả bảng users.";

export const IN_PROGRESS_COURSE_LIMIT = 4;

// Khung chờ khối "Khóa đang học": đoán học viên có thêm ngần này khóa đang học
export const IN_PROGRESS_SKELETON_ROW_COUNT = 2;

// Lấy đủ khóa của học viên để đếm đúng số khóa đang học và đã xong
export const LEARNER_COURSE_FETCH_LIMIT = 50;

// Danh sách khóa đã public: dùng cho số liệu ở khối đầu trang, lộ trình, khối khóa học
export const CATALOG_COURSE_LIMIT = 20;

// Khối Khóa học: một khóa lớn và tối đa ngần này khóa trong danh sách bên cạnh
export const CATALOG_LIST_LIMIT = 4;

// Lấy dư cảm nhận để chọn cái dài nhất làm cảm nhận lớn, rồi hiện ngần này cái
export const TESTIMONIAL_FETCH_LIMIT = 8;

export const TESTIMONIAL_SHOW_COUNT = 3;

// Số ô trong hàng số liệu ở khối đầu trang của khách (lưới 3 cột)
export const HERO_STAT_SKELETON_COUNT = 3;

export const STAR_POSITIONS: number[] = [1, 2, 3, 4, 5];

// ----- Chỉ dùng cho trang xem trước ở dev (/dashboard-preview) -----
// Khóa mới dự kiến, dữ liệu giả hoàn toàn: tên, giá, ảnh Unsplash
export const PREVIEW_FIRST_NAME = "Tuấn";

export const PREVIEW_COURSES: PreviewCourseSeed[] = [
  {
    slug: "preview-ai-cho-nguoi-moi",
    title: "AI cho người mới: dùng ChatGPT, Claude để học code nhanh hơn",
    desc: "Biết hỏi AI đúng cách, đọc hiểu câu trả lời và tự kiểm lại.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80&auto=format&fit=crop",
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
    desc: "Dựng một app hoàn chỉnh bằng AI, ít video, làm theo là ra sản phẩm.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&auto=format&fit=crop",
    price: 99_000,
    salePrice: 299_000,
    free: false,
    rating: [5, 5, 5, 5],
    views: 38_216,
  },
  {
    slug: "preview-typescript",
    title: "TypeScript thực chiến cho người đã biết JavaScript",
    desc: "Kiểu dữ liệu chặt, ít lỗi lúc chạy.",
    image: "",
    price: 199_000,
    salePrice: 0,
    free: false,
    rating: [],
    views: 0,
  },
];

export const PREVIEW_ROADMAP_STEPS: RoadmapStepConfig[] = [
  {
    slug: "preview-ai-cho-nguoi-moi",
    shortTitle: "AI cho người mới",
    outcome: "Hỏi AI đúng cách, tự kiểm lại câu trả lời",
    icon: GraduationCap,
  },
  {
    slug: "preview-vibe-coding",
    shortTitle: "Vibe Coding thực chiến",
    outcome: "Dựng một app hoàn chỉnh bằng AI",
    icon: Sparkles,
  },
  {
    slug: "preview-len-production",
    shortTitle: "Lên production",
    outcome: "Sản phẩm chạy thật, sập thì biết vì sao",
    icon: Rocket,
    launchLabel: "12/2026",
  },
];

export const PREVIEW_COURSE_PROGRESS: PreviewCourseProgress[] = [
  { slug: "preview-ai-cho-nguoi-moi", current: 18, total: 18 },
  { slug: "preview-vibe-coding", current: 13, total: 42 },
];

export const PREVIEW_STATE_LINKS: PreviewStateLink[] = [
  { state: "nguoi-moi", label: "Người mới" },
  { state: "hoc-vien", label: "Học viên" },
  { state: "khach", label: "Khách" },
  { state: "chua-co-khoa", label: "Chưa mở khóa nào" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "dang-tai-khach", label: "Đang tải (khách)" },
  { state: "loi", label: "Lỗi" },
];
