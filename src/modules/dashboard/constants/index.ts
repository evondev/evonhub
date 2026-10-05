import {
  LearningActivity,
  PartnerLink,
  PreviewCourseProgress,
  PreviewStateLink,
} from "../types";

export const partnerLinks: PartnerLink[] = [
  { name: "Mayashare", url: "https://vncreatorpreneur.com/" },
  { name: "Evondev", url: "https://evondev.com/" },
];

export const IN_PROGRESS_COURSE_LIMIT = 4;

// Lấy đủ khóa của học viên để đếm đúng số khóa đang học và đã xong
export const LEARNER_COURSE_FETCH_LIMIT = 50;

export const RECOMMENDED_COURSE_LIMIT = 4;

// Cột cao nhất chỉ lên 85% vùng vẽ, chừa chỗ cho số trên đầu cột
export const MAX_BAR_HEIGHT_PERCENT = 85;

export const SKELETON_STAT_TILE_COUNT = 4;
export const SKELETON_COURSE_ROW_WIDTHS: string[] = ["w-2/5", "w-3/5", "w-1/3"];
export const SKELETON_CHART_BAR_HEIGHTS: number[] = [
  50, 20, 40, 90, 55, 80, 70, 25,
];

// ----- Chỉ dùng cho trang xem trước ở dev (/dashboard-preview) -----
export const PREVIEW_FIRST_NAME = "Tuấn";

export const PREVIEW_COURSE_PROGRESS: PreviewCourseProgress[] = [
  { current: 22, total: 48 },
  { current: 39, total: 50 },
  { current: 0, total: 32 },
  { current: 30, total: 30 },
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
  { state: "hoc-vien", label: "Học viên" },
  { state: "chua-noi", label: "Học viên, chưa nối số liệu" },
  { state: "nguoi-moi", label: "Người mới" },
  { state: "khach", label: "Khách" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];
