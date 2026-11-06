import {
  LeaderboardPreviewStateLink,
  LeaderboardViewer,
  PreviewLeaderboardPerson,
  StreakStatus,
} from "../types";

export const PREVIEW_LEADERBOARD_STATE_LINKS: LeaderboardPreviewStateLink[] = [
  { state: "du-lieu", label: "Có dữ liệu" },
  { state: "bac-cao-nhat", label: "Bạn ở bậc cao nhất" },
  { state: "chua-co-phut", label: "Bạn chưa có phút" },
  { state: "khach", label: "Khách" },
  { state: "rong", label: "Tuần mới, chưa ai học" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];

export const PREVIEW_VIEWER: LeaderboardViewer = {
  userId: "preview-viewer",
  // Trang xem trước không có người thật: để rỗng cho tên, avatar không thành link 404
  username: "",
  name: "Trần Anh Tuấn",
  avatar: "https://randomuser.me/api/portraits/men/52.jpg",
};

/** Tổng giờ của bạn trên trang xem trước: bậc Đam mê, còn 12 giờ 20 phút lên Vương miện */
export const PREVIEW_VIEWER_TOTAL_HOURS = 27 + 40 / 60;

export const PREVIEW_VIEWER_WEEK_MINUTES = 66;

/** Bạn chen vào giữa các dòng giả ở hạng này */
export const PREVIEW_VIEWER_RANK = 14;

/** Phút 7 ngày gần nhất của bạn, hôm nay ở cuối */
export const PREVIEW_VIEWER_DAY_MINUTES: number[] = [34, 52, 18, 41, 25, 66, 0];

/** Mọi người trừ bạn, phút giảm dần. Có tên dài, có người không ảnh */
export const PREVIEW_LEADERBOARD_PEOPLE: PreviewLeaderboardPerson[] = [
  {
    name: "Nguyễn Minh Khang",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    minutes: 252,
    totalHours: 142,
  },
  {
    name: "Trần Bảo Ngọc",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    minutes: 218,
    totalHours: 71,
  },
  {
    name: "Lê Hoàng Phúc",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    minutes: 190,
    totalHours: 196,
  },
  {
    name: "Phạm Thị Thu Hà",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    minutes: 164,
    totalHours: 44,
  },
  {
    name: "Đỗ Quang Huy",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    minutes: 151,
    totalHours: 95,
  },
  {
    name: "Võ Nguyễn Ngọc Anh Thư (Frontend Developer tại Đà Nẵng)",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
    minutes: 139,
    totalHours: 17,
  },
  { name: "Bùi Tuấn Kiệt", avatar: "", minutes: 122, totalHours: 9 },
  {
    name: "Hoàng Gia Bảo",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg",
    minutes: 108,
    totalHours: 26,
  },
  {
    name: "Mai Phương Linh",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    minutes: 96,
    totalHours: 31,
  },
  {
    name: "Đặng Quốc Việt",
    avatar: "https://randomuser.me/api/portraits/men/64.jpg",
    minutes: 88,
    totalHours: 0.5,
  },
  { name: "Phan Minh Đức", avatar: "", minutes: 80, totalHours: 4 },
  {
    name: "Ngô Thanh Tâm",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    minutes: 74,
    totalHours: 5,
  },
  {
    name: "Lý Gia Hân",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    minutes: 71,
    totalHours: 12,
  },
  { name: "Trịnh Văn Nam", avatar: "", minutes: 61, totalHours: 2 },
];

export const PREVIEW_STREAK_STATUSES: StreakStatus[] = [
  "risk",
  "kept",
  "record",
  "broken",
  "new",
];
