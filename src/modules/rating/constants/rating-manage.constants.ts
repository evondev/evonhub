import { reactions } from "@/constants";
import {
  RatingStatus,
  reactionLabels,
} from "@/shared/constants/rating.constants";
import { CourseFilterOption, FilterTabItem } from "@/shared/types";
import {
  RatingManageFilters,
  RatingManagePreviewStateLink,
  RatingManageRow,
  RatingManageTab,
  RatingManageTabCounts,
  RatingReaction,
  RatingStatusBadge,
} from "../types/rating-manage.types";

/** Chờ duyệt đứng đầu và là tab mở mặc định: việc chính của trang là dọn hàng chờ */
export const RATING_MANAGE_TABS: FilterTabItem<RatingManageTab>[] = [
  { value: RatingStatus.Inactive, label: "Chờ duyệt" },
  { value: RatingStatus.Active, label: "Đã duyệt" },
  { value: RatingStatus.Rejected, label: "Từ chối" },
  { value: "all", label: "Tất cả" },
];

export const RATING_MANAGE_TAB_VALUES = [
  RatingStatus.Inactive,
  RatingStatus.Active,
  RatingStatus.Rejected,
  "all",
] as const;

export const RATING_MANAGE_DEFAULT_FILTERS: RatingManageFilters = {
  search: "",
  tab: RatingStatus.Inactive,
  courseId: "",
  page: 1,
};

/** Badge trạng thái, chỉ hiện ở tab "Tất cả" (các tab khác mọi dòng cùng trạng thái) */
export const RATING_STATUS_BADGES: Record<RatingStatus, RatingStatusBadge> = {
  [RatingStatus.Inactive]: { tone: "warning", label: "Chờ duyệt" },
  [RatingStatus.Active]: { tone: "success", label: "Đã duyệt" },
  [RatingStatus.Rejected]: { tone: "neutral", label: "Từ chối" },
};

/** Số sao → icon và nhãn cảm xúc, cùng bộ với hộp đánh giá khoá học */
export const RATING_REACTIONS: Record<number, RatingReaction> =
  Object.fromEntries(
    reactions.map((reaction) => [
      reaction.rating,
      { icon: reaction.icon, label: reactionLabels[reaction.value] },
    ]),
  );

/** Tên tab trong câu "Chọn cả 24 đánh giá chờ duyệt"; tab "Tất cả" thì không ghi */
export const RATING_TAB_SCOPE_LABELS: Record<RatingManageTab, string> = {
  [RatingStatus.Inactive]: "chờ duyệt",
  [RatingStatus.Active]: "đã duyệt",
  [RatingStatus.Rejected]: "đã từ chối",
  all: "",
};

/** Câu báo rỗng của từng tab khi không tìm, không lọc khoá */
export const RATING_EMPTY_MESSAGES: Record<RatingManageTab, string> = {
  [RatingStatus.Inactive]: "Không còn đánh giá nào chờ duyệt.",
  [RatingStatus.Active]: "Chưa có đánh giá nào được duyệt.",
  [RatingStatus.Rejected]: "Chưa từ chối đánh giá nào.",
  all: "Chưa có đánh giá nào.",
};

/** Server nhận tối đa chừng này đánh giá mỗi lần đổi trạng thái */
export const MAX_RATINGS_PER_UPDATE = 50;

/** Server trả tối đa chừng này đánh giá mỗi trang */
export const MAX_RATINGS_PER_PAGE = 50;

export const RATING_STATUS_FORBIDDEN_MESSAGE =
  "Bạn chỉ duyệt được đánh giá trong khoá của mình";

export const RATING_STATUS_NOT_FOUND_MESSAGE =
  "Không tìm thấy đánh giá, có thể đã bị xoá";

/** Thời gian giả lập lưu ở trang xem trước */
export const RATING_MANAGE_PREVIEW_SAVE_DELAY_MS = 700;

export const RATING_MANAGE_PREVIEW_STATE_LINKS: RatingManagePreviewStateLink[] =
  [
    { state: "du-lieu", label: "Có dữ liệu" },
    { state: "het-cho", label: "Hết hàng chờ" },
    { state: "rong", label: "Rỗng do tìm" },
    { state: "dang-tai", label: "Đang tải" },
    { state: "loi", label: "Lỗi" },
  ];

/**
 * Trang xem trước giả như đang xem trang đầu của cả danh sách thật. Hàng chờ
 * dài hơn một trang để thấy dòng "Chọn cả 19 đánh giá chờ duyệt"
 */
export const RATING_MANAGE_PREVIEW_TAB_COUNTS: RatingManageTabCounts = {
  [RatingStatus.Inactive]: 19,
  [RatingStatus.Active]: 412,
  [RatingStatus.Rejected]: 9,
  all: 440,
};

/** Từ khoá trang xem trước dùng cho trạng thái rỗng do tìm */
export const RATING_MANAGE_PREVIEW_EMPTY_KEYWORD = "hoàn tiền";

/** Khoá thật của Evonhub: đủ nhiều và đủ dài để menu "Khoá học" phải cuộn */
export const PREVIEW_RATING_COURSES: CourseFilterOption[] = [
  {
    id: "c01",
    title:
      "Khoá học HTML CSS nâng cao cắt giao diện toàn tập với Gulp, Pug và Sass",
  },
  { id: "c02", title: "Khoá học Vscode Pro - Thành thạo Vscode cho người mới" },
  {
    id: "c03",
    title: "Khoá học HTML CSS Master - Giúp bạn Master kỹ năng HTML CSS",
  },
  { id: "c04", title: "Khoá học Javascript online từ Google Meet" },
  {
    id: "c05",
    title: "Khoá học Javascript từ cơ bản đến nâng cao cho người mới bắt đầu",
  },
  {
    id: "c06",
    title: "Khoá học NextJS Pro - Xây dựng E Learning System hoàn chỉnh",
  },
  {
    id: "c07",
    title: "Khoá học ReactJS Master - Nắm vững kiến thức React chuyên sâu",
  },
];

const portrait = (gender: "men" | "women", index: number) =>
  `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;

// Mốc tròn giờ: server và trình duyệt tính ra cùng một giờ, không lệch khi hydrate
const previewNow = Math.floor(Date.now() / 3_600_000) * 3_600_000;
const hoursAgo = (hours: number) =>
  new Date(previewNow - hours * 60 * 60 * 1000).toISOString();

const previewCourse = (courseIndex: number, slug: string) => ({
  slug,
  title: PREVIEW_RATING_COURSES[courseIndex].title,
});

/**
 * Đánh giá giả cho trang xem trước: đủ năm mức sao, nhận xét dài nhiều đoạn,
 * nhận xét một chữ, một đánh giá cũ không có nội dung, người không ảnh, chờ quá hai ngày
 */
export const PREVIEW_MANAGED_RATINGS: RatingManageRow[] = [
  {
    id: "r01",
    content:
      "Khoá học rất chi tiết, anh giảng chậm rãi dễ hiểu. Phần dự án cuối khoá giúp em tự tin đi phỏng vấn.",
    rating: 5,
    status: RatingStatus.Inactive,
    createdAt: hoursAgo(1),
    author: { name: "Trần Thị Vy", avatar: portrait("women", 44) },
    course: previewCourse(6, "reactjs-master"),
  },
  {
    id: "r02",
    content:
      "Nội dung tốt nhưng video phần Redux Toolkit hơi cũ, đang dùng bản 1.x trong khi giờ đã lên 2.x, nhiều API đổi tên nên em làm theo bị lỗi.\n\nMong anh cập nhật lại phần này, hoặc ghi chú bên dưới video những chỗ đã đổi. Em phải lên GitHub issue tìm mới sửa được.\n\nNgoài ra phần bài tập nên có lời giải để đối chiếu.",
    rating: 3,
    status: RatingStatus.Inactive,
    createdAt: hoursAgo(4),
    author: { name: "Nguyễn Thị Phương Thảo", avatar: portrait("women", 68) },
    course: previewCourse(6, "reactjs-master"),
  },
  {
    id: "r03",
    content: "Tuyệt!",
    rating: 5,
    status: RatingStatus.Inactive,
    createdAt: hoursAgo(9),
    author: { name: "Lê Hoàng Nam", avatar: portrait("men", 32) },
    course: previewCourse(0, "html-css-nang-cao"),
  },
  {
    id: "r04",
    content:
      "Mua xong không vào học được, nhắn fanpage 2 ngày chưa thấy trả lời. Rất thất vọng.",
    rating: 1,
    status: RatingStatus.Inactive,
    createdAt: hoursAgo(20),
    author: { name: "khoahocgiare247" },
    course: previewCourse(5, "nextjs-pro"),
  },
  {
    id: "r05",
    content:
      "Phần Gulp với Pug hơi khó theo với người mới, nhưng phần Sass thì rất hay.",
    rating: 4,
    status: RatingStatus.Inactive,
    createdAt: hoursAgo(30),
    author: { name: "Đỗ Khánh Linh", avatar: portrait("women", 12) },
    course: previewCourse(0, "html-css-nang-cao"),
  },
  {
    id: "r06",
    content: "Âm thanh một số video bị nhỏ, phải bật hết cỡ mới nghe rõ.",
    rating: 2,
    status: RatingStatus.Inactive,
    createdAt: hoursAgo(62),
    author: { name: "Võ Thanh Tùng", avatar: portrait("men", 51) },
    course: previewCourse(1, "vscode-pro"),
  },
  {
    id: "r07",
    content: "",
    rating: 4,
    status: RatingStatus.Inactive,
    createdAt: hoursAgo(150),
    author: { name: "Tôn Nữ Thị Minh Nguyệt" },
    course: previewCourse(4, "javascript-co-ban-den-nang-cao"),
  },
  {
    id: "r08",
    content:
      "Khoá học đáng tiền nhất mình từng mua, học xong làm được trang web bán hàng đầu tiên.",
    rating: 5,
    status: RatingStatus.Active,
    createdAt: hoursAgo(200),
    author: { name: "Hoàng Gia Bảo", avatar: portrait("men", 8) },
    course: previewCourse(4, "javascript-co-ban-den-nang-cao"),
  },
  {
    id: "r09",
    content: "Liên hệ zalo 09xx để mua khoá giá rẻ",
    rating: 1,
    status: RatingStatus.Rejected,
    createdAt: hoursAgo(260),
    author: { name: "spam_bot_99" },
    course: previewCourse(2, "html-css-master"),
  },
];
