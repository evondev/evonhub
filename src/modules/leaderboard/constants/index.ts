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
 * nhận ngay phút đầu tiên. Mốc giờ là ước lượng ban đầu, chỉnh theo dữ liệu thật.
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
    minSeconds: 3 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-2.png",
  },
  {
    level: 3,
    name: "Tinh tú",
    minSeconds: 8 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-3.png",
  },
  {
    level: 4,
    name: "Nhiệt huyết",
    minSeconds: 15 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-4.png",
  },
  {
    level: 5,
    name: "Đam mê",
    minSeconds: 25 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-5.png",
  },
  {
    level: 6,
    name: "Vương miện",
    minSeconds: 40 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-6.png",
  },
  {
    level: 7,
    name: "Chiến cúp",
    minSeconds: 60 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-7.png",
  },
  {
    level: 8,
    name: "Kim cương",
    minSeconds: 90 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-8.png",
  },
  {
    level: 9,
    name: "Thạch anh",
    minSeconds: 130 * HOUR_SECONDS,
    imageSrc: "/tiers/tier-9.png",
  },
  {
    level: 10,
    name: "Huyền thoại",
    minSeconds: 180 * HOUR_SECONDS,
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
    emptyText: "Tuần này bạn chưa có phút học nào.",
  },
  {
    value: "month",
    label: "Tháng này",
    meTitle: "Tháng này của bạn",
    participantLabel: "học viên có phút tháng này",
    emptyText: "Tháng này bạn chưa có phút học nào.",
  },
  {
    value: "all",
    label: "Tất cả",
    meTitle: "Từ trước tới nay",
    participantLabel: "học viên có phút học",
    emptyText: "Bạn chưa có phút học nào.",
  },
];

/** Nối sau emptyText: lối đi tiếp khi chưa có phút */
export const LEADERBOARD_EMPTY_HINT = "Xem một bài là có tên trên bảng.";

/** Màu huy chương top 3: vàng, bạc, đồng. Hạng khác không có huy chương */
export const RANK_MEDAL_CLASS_NAMES: Record<number, string> = {
  1: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  2: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",
  3: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
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
