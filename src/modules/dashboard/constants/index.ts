import {
  LearningActivity,
  PartnerLink,
  PreviewCourseProgress,
  PreviewStateLink,
  RoadmapStepConfig,
} from "../types";

export const partnerLinks: PartnerLink[] = [
  { name: "Mayashare", url: "https://vncreatorpreneur.com/" },
  { name: "Evondev", url: "https://evondev.com/" },
];

// Thứ tự học đề xuất cho người mới. Đổi khóa hay câu mô tả ở đây.
export const ROADMAP_STEPS: RoadmapStepConfig[] = [
  {
    slug: "khoa-hoc-javascript-co-ban-cho-nguoi-moi",
    shortTitle: "JavaScript",
    outcome: "Nền tảng trước khi học framework",
  },
  {
    slug: "khoa-hoc-reactjs-co-ban",
    shortTitle: "ReactJS",
    outcome: "Giao diện có trạng thái, gọi API",
  },
  {
    slug: "khoa-hoc-nextjs-pro",
    shortTitle: "NextJS Pro",
    outcome: "Một sản phẩm thật, lên production",
  },
];

export const IN_PROGRESS_COURSE_LIMIT = 4;

// Lấy đủ khóa của học viên để đếm đúng số khóa đang học và đã xong
export const LEARNER_COURSE_FETCH_LIMIT = 50;

// Danh sách khóa đã public: dùng cho số liệu ở dải đầu trang, lộ trình và lưới khóa
export const CATALOG_COURSE_LIMIT = 20;

export const CATALOG_GRID_LIMIT = 8;

export const TESTIMONIAL_LIMIT = 6;

// Cột cao nhất chỉ lên 85% vùng vẽ, chừa chỗ cho số trên đầu cột
export const MAX_BAR_HEIGHT_PERCENT = 85;

export const SKELETON_ROADMAP_STEP_COUNT = 3;

// ----- Chỉ dùng cho trang xem trước ở dev (/dashboard-preview) -----
export const PREVIEW_FIRST_NAME = "Tuấn";

export const PREVIEW_COURSE_PROGRESS: PreviewCourseProgress[] = [
  { slug: "khoa-hoc-javascript-co-ban-cho-nguoi-moi", current: 50, total: 50 },
  { slug: "khoa-hoc-reactjs-co-ban", current: 22, total: 48 },
  { slug: "khoa-hoc-nextjs-pro", current: 0, total: 64 },
];

export const PREVIEW_LEARNING_ACTIVITY: LearningActivity = {
  lessonsLastSevenDays: 9,
  lessonsToday: 2,
  currentStreakDays: 4,
  longestStreakDays: 11,
  weeklyLessons: [
    { label: "17/08", value: 6 },
    { label: "24/08", value: 0 },
    { label: "31/08", value: 4 },
    { label: "07/09", value: 9 },
    { label: "14/09", value: 5 },
    { label: "21/09", value: 8 },
    { label: "28/09", value: 7 },
    { label: "05/10", value: 2, isCurrent: true },
  ],
};

export const PREVIEW_STATE_LINKS: PreviewStateLink[] = [
  { state: "nguoi-moi", label: "Người mới" },
  { state: "hoc-vien", label: "Học viên" },
  { state: "chua-noi", label: "Học viên, chưa nối số liệu" },
  { state: "khach", label: "Khách" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];
