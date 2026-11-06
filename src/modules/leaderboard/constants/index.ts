import { LeaderboardPeriodTab, StreakStatus, StudyTier } from "../types";

/** Video chia thành các ô chừng này giây; mỗi ô xem trọn một lần được tính một lần */
export const WATCH_BUCKET_SECONDS = 10;

/** Trang học còn mở thì cứ chừng này gửi các ô vừa xem lên server */
export const WATCH_FLUSH_INTERVAL_MS = 30 * 1000;

/** Tốc độ phát nhanh nhất được tính đủ. Xem nhanh hơn thì phần dư không cộng */
export const MAX_PLAYBACK_RATE = 2;

/** Hai nhịp timeupdate cách nhau quá chừng này giây thật là đã đứt (tab ngủ, máy lag) */
export const MAX_TICK_GAP_SECONDS = 3;

/** Nhịp timeupdate trễ hơn thời gian thật một chút vẫn tính là phát liền */
export const TICK_TOLERANCE_SECONDS = 0.5;

/** Một lần gửi tối đa chừng này ô, chặn client gửi cả nghìn ô một lúc */
export const MAX_BUCKETS_PER_REQUEST = 200;

/** Lần cộng đầu tiên của một người (chưa có mốc lần trước) được tối đa chừng này giây */
export const FIRST_CREDIT_MAX_SECONDS = 90;

/** Bù độ trễ mạng khi so số giây xin cộng với thời gian thật đã trôi */
export const CREDIT_SLACK_SECONDS = 15;

/** Thời lượng bài (admin nhập, tính bằng phút) nhân hệ số này làm trần số ô của bài */
export const LESSON_DURATION_TOLERANCE = 1.2;

/** Bài video chưa nhập thời lượng thì trần mỗi bài chừng này giây */
export const UNKNOWN_DURATION_MAX_SECONDS = 4 * 60 * 60;

/** Video Google Drive không đọc được giờ phát: tab còn hiện thì cứ chừng này tính một ô */
export const IFRAME_TICK_MS = WATCH_BUCKET_SECONDS * 1000;

/** Giờ Việt Nam (UTC+7, không đổi giờ theo mùa) để chia ngày, tuần, tháng */
export const VIETNAM_UTC_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Chưa đủ một phút thì chưa lên bảng: bảng hiện phút, người 0 phút đứng hạng 37 trông như lỗi */
export const MIN_RANKED_SECONDS = 60;

/** Ngày có ít nhất chừng này giây học thì tính vào chuỗi: cùng mốc một phút như bảng */
export const STREAK_MIN_SECONDS = MIN_RANKED_SECONDS;

/** Thẻ chuỗi trên dashboard: số ngày gần nhất hiện thành chấm lửa */
export const STREAK_DAY_COUNT = 7;

export const STREAK_IMAGE_SRC = "/tiers/tier-streak.png";

const HOUR_SECONDS = 60 * 60;

/**
 * Mười bậc theo tổng giờ học từ trước tới nay, chỉ tăng không giảm. Bậc đầu
 * nhận ngay phút đầu tiên. Mốc đã hạ cho vừa nhịp học hiện tại (người học
 * chăm nhất khoảng 1,5 giờ mỗi tuần): bậc 2 trong tuần đầu, bậc cao nhất hơn một năm.
 */
export const STUDY_TIERS: StudyTier[] = [
  {
    level: 1,
    name: "Tập sự",
    minSeconds: MIN_RANKED_SECONDS,
    imageSrc: "/tiers/tier-1.png",
  },
  {
    level: 2,
    name: "Băng tinh",
    minSeconds: 1 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-2.png",
  },
  {
    level: 3,
    name: "Tinh tú",
    minSeconds: 3 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-3.png",
  },
  {
    level: 4,
    name: "Nhiệt huyết",
    minSeconds: 6 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-4.png",
  },
  {
    level: 5,
    name: "Đam mê",
    minSeconds: 10 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-5.png",
  },
  {
    level: 6,
    name: "Vương miện",
    minSeconds: 15 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-6.png",
  },
  {
    level: 7,
    name: "Chiến cúp",
    minSeconds: 25 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-7.png",
  },
  {
    level: 8,
    name: "Kim cương",
    minSeconds: 40 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-8.png",
  },
  {
    level: 9,
    name: "Thạch anh",
    minSeconds: 60 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-9.png",
  },
  {
    level: 10,
    name: "Huyền thoại",
    minSeconds: 100 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-10.png",
  },
];

/** Nền và chữ của dòng trạng thái trên thẻ chuỗi */
export const STREAK_STATUS_CLASS_NAMES: Record<StreakStatus, string> = {
  new: "bg-item-hover text-foreground/75",
  risk: "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300",
  kept: "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300",
  record:
    "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300",
  broken: "bg-item-hover text-foreground/75",
};

export const LEADERBOARD_LIMIT = 100;

/**
 * Bảng của mỗi kỳ dùng chung cho mọi người xem, đọc lại DB tối đa một lần
 * trong chừng này giây. Phút của chính bạn vẫn đọc mới mỗi lần.
 */
export const LEADERBOARD_CACHE_SECONDS = 60;

export const LEADERBOARD_CACHE_TAG = "leaderboard";

/** Bảng mở ra hiện chừng này người, bấm "Xem thêm" mới hiện đủ LEADERBOARD_LIMIT */
export const LEADERBOARD_VISIBLE_COUNT = 20;

/** Dashboard chỉ hiện avatar của chừng này người dẫn đầu tuần */
export const DASHBOARD_TOP_COUNT = 3;

/** Biểu đồ trên thẻ của bạn: số ngày gần nhất */
export const STUDY_DAY_CHART_LENGTH = 7;

export const STUDY_PATH = "/study";

export const LEADERBOARD_PATH = "/leaderboard";

export const LEADERBOARD_PERIOD_TABS: LeaderboardPeriodTab[] = [
  {
    value: "week",
    label: "Tuần này",
    meTitle: "Tuần này của bạn",
    participantLabel: "học viên có phút tuần này",
    rankTitleSuffix: "tuần",
    emptyText: "Tuần này bạn chưa có phút học nào.",
  },
  {
    value: "month",
    label: "Tháng này",
    meTitle: "Tháng này của bạn",
    participantLabel: "học viên có phút tháng này",
    rankTitleSuffix: "tháng",
    emptyText: "Tháng này bạn chưa có phút học nào.",
  },
  {
    value: "all",
    label: "Tất cả",
    meTitle: "Từ trước tới nay",
    participantLabel: "học viên có phút học",
    rankTitleSuffix: "mọi thời",
    emptyText: "Bạn chưa có phút học nào.",
  },
];

/** Nối sau emptyText: lối đi tiếp khi chưa có phút */
export const LEADERBOARD_EMPTY_HINT = "Xem một bài là có tên trên bảng.";

// Panel "Tuần này" lúc chưa từng học và tuần này chưa có phút: một câu cho cả
// chuỗi ngày lẫn bảng xếp hạng, thay vì hai khối cùng báo trống
export const WEEK_PROGRESS_EMPTY_MESSAGE =
  "Tuần này chưa có phút học nào. Học 1 phút để bắt đầu chuỗi và có tên trên bảng xếp hạng";

/** Màu huy chương top 3: vàng, bạc, đồng. Hạng khác không có huy chương */
export const RANK_MEDAL_CLASS_NAMES: Record<number, string> = {
  1: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  2: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",
  3: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
};

/**
 * Danh hiệu top 3 của kỳ đang xem, nối với đuôi kỳ: "Dẫn đầu tuần". Khác bậc:
 * bậc theo tổng giờ từ trước tới nay, danh hiệu theo hạng trong kỳ
 */
export const RANK_TITLES: Record<number, string> = {
  1: "Dẫn đầu",
  2: "Á quân",
  3: "Hạng ba",
};

/**
 * Viền avatar theo bậc, lấy màu từ ảnh huy hiệu cùng bậc. Từ bậc 6 có ánh sáng
 * tỏa ra, bậc cao nhất viền cầu vồng xoay chậm
 */
export const TIER_FRAME_CLASS_NAMES: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-500 to-orange-800",
  2: "bg-gradient-to-br from-sky-300 to-blue-500",
  3: "bg-gradient-to-br from-violet-400 to-purple-600",
  4: "bg-gradient-to-br from-orange-400 to-red-500",
  5: "bg-gradient-to-br from-pink-400 via-rose-500 to-amber-400",
  6: "bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.45)]",
  7: "bg-gradient-to-br from-yellow-200 via-amber-400 to-purple-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]",
  8: "bg-gradient-to-br from-amber-300 via-fuchsia-500 to-purple-700 shadow-[0_0_14px_rgba(217,70,239,0.5)]",
  9: "bg-gradient-to-br from-fuchsia-400 via-violet-600 to-amber-300 shadow-[0_0_16px_rgba(192,38,211,0.55)]",
  10: "animate-[spin_6s_linear_infinite] bg-[conic-gradient(#22d3ee,#e879f9,#fbbf24,#a78bfa,#22d3ee)] shadow-[0_0_18px_rgba(232,121,249,0.6)] motion-reduce:animate-none",
};

export const WEEKDAY_LABELS: string[] = [
  "CN",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
];

/** Bề rộng các vệt chờ tên trong bảng, lệch nhau cho giống chữ thật */
export const SKELETON_NAME_WIDTHS: string[] = [
  "w-2/5",
  "w-1/2",
  "w-1/3",
  "w-3/5",
  "w-2/5",
  "w-1/2",
  "w-1/3",
  "w-2/5",
];
