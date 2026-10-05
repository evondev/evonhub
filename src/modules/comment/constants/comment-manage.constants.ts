import { CommentStatus } from "@/shared/constants/comment.constants";
import { CourseFilterOption, FilterTabItem } from "@/shared/types";
import {
  CommentManageFilters,
  CommentManagePreviewStateLink,
  CommentManageRow,
  CommentManageTab,
  CommentManageTabCounts,
  CommentStatusBadge,
} from "../types/comment-manage.types";

/** Chờ duyệt đứng đầu và là tab mở mặc định: việc chính của trang là dọn hàng chờ */
export const COMMENT_MANAGE_TABS: FilterTabItem<CommentManageTab>[] = [
  { value: CommentStatus.Pending, label: "Chờ duyệt" },
  { value: CommentStatus.Approved, label: "Đã duyệt" },
  { value: CommentStatus.Rejected, label: "Từ chối" },
  { value: "all", label: "Tất cả" },
];

export const COMMENT_MANAGE_TAB_VALUES = [
  CommentStatus.Pending,
  CommentStatus.Approved,
  CommentStatus.Rejected,
  "all",
] as const;

export const COMMENT_MANAGE_DEFAULT_FILTERS: CommentManageFilters = {
  search: "",
  tab: CommentStatus.Pending,
  courseId: "",
  page: 1,
};

/** Badge trạng thái, chỉ hiện ở tab "Tất cả" (các tab khác mọi dòng cùng trạng thái) */
export const COMMENT_STATUS_BADGES: Record<CommentStatus, CommentStatusBadge> =
  {
    [CommentStatus.Pending]: { tone: "warning", label: "Chờ duyệt" },
    [CommentStatus.Approved]: { tone: "success", label: "Đã duyệt" },
    [CommentStatus.Rejected]: { tone: "neutral", label: "Từ chối" },
  };

/** Server nhận tối đa chừng này bình luận mỗi lần đổi trạng thái */
export const MAX_COMMENTS_PER_UPDATE = 50;

export const COMMENT_STATUS_FORBIDDEN_MESSAGE =
  "Bạn chỉ duyệt được bình luận trong khoá của mình";

export const COMMENT_STATUS_NOT_FOUND_MESSAGE =
  "Không tìm thấy bình luận, có thể đã bị xoá";

/** Thời gian giả lập lưu ở trang xem trước */
export const COMMENT_MANAGE_PREVIEW_SAVE_DELAY_MS = 700;

export const COMMENT_MANAGE_PREVIEW_STATE_LINKS: CommentManagePreviewStateLink[] =
  [
    { state: "du-lieu", label: "Có dữ liệu" },
    { state: "het-cho", label: "Hết hàng chờ" },
    { state: "rong", label: "Rỗng do tìm" },
    { state: "dang-tai", label: "Đang tải" },
    { state: "loi", label: "Lỗi" },
  ];

/**
 * Trang xem trước giả như đang xem trang đầu của cả danh sách thật. Hàng chờ
 * dài hơn một trang để thấy dòng "Chọn cả 24 bình luận chờ duyệt"
 */
export const COMMENT_MANAGE_PREVIEW_TAB_COUNTS: CommentManageTabCounts = {
  [CommentStatus.Pending]: 24,
  [CommentStatus.Approved]: 1284,
  [CommentStatus.Rejected]: 37,
  all: 1345,
};

/** Đủ nhiều và đủ dài để menu "Khoá học" phải cuộn, tên xuống hai ba dòng */
export const PREVIEW_COMMENT_COURSES: CourseFilterOption[] = [
  { id: "c01", title: "Khoá học ReactJS từ cơ bản tới nâng cao" },
  { id: "c02", title: "NextJS 14 App Router" },
  { id: "c03", title: "JavaScript cơ bản cho người mới bắt đầu" },
  { id: "c04", title: "Tailwind CSS thực chiến: dựng giao diện dashboard" },
  {
    id: "c05",
    title:
      "Khoá học HTML CSS nâng cao cắt giao diện toàn tập với Gulp, Pug và Sass",
  },
  { id: "c06", title: "Khoá học Vscode Pro - Thành thạo Vscode cho người mới" },
  {
    id: "c07",
    title: "Khoá học HTML CSS Master - Giúp bạn Master kỹ năng HTML CSS",
  },
  { id: "c08", title: "Khoá học Javascript online từ Google Meet" },
  {
    id: "c09",
    title: "Khoá học NextJS Pro - Xây dựng E Learning System hoàn chỉnh",
  },
  {
    id: "c10",
    title: "Khoá học ReactJS Master - Nắm vững kiến thức React chuyên sâu",
  },
];

const portrait = (gender: "men" | "women", index: number) =>
  `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;

// Mốc tròn giờ: server và trình duyệt tính ra cùng một giờ, không lệch khi hydrate
const previewNow = Math.floor(Date.now() / 3_600_000) * 3_600_000;
const hoursAgo = (hours: number) =>
  new Date(previewNow - hours * 60 * 60 * 1000).toISOString();

const reactCourse = {
  slug: "khoa-hoc-reactjs",
  title: PREVIEW_COMMENT_COURSES[0].title,
};
const nextCourse = {
  slug: "nextjs-14-app-router",
  title: PREVIEW_COMMENT_COURSES[1].title,
};
const javascriptCourse = {
  slug: "javascript-co-ban",
  title: PREVIEW_COMMENT_COURSES[2].title,
};
const tailwindCourse = {
  slug: "tailwind-css-thuc-chien",
  title: PREVIEW_COMMENT_COURSES[3].title,
};

/**
 * Bình luận giả cho trang xem trước: có nội dung dài nhiều đoạn, một link dài
 * không dấu cách, câu trả lời, người không ảnh, bình luận chờ quá hai ngày
 */
export const PREVIEW_MANAGED_COMMENTS: CommentManageRow[] = [
  {
    id: "cm01",
    content:
      "Anh ơi cho em hỏi, em làm theo y hệt video mà useEffect cứ chạy hai lần liền khi vào trang. Em đã kiểm tra mảng phụ thuộc rồi, chỉ có [] thôi.",
    status: CommentStatus.Pending,
    createdAt: hoursAgo(0.4),
    author: { name: "Trần Thị Vy", avatar: portrait("women", 44) },
    lesson: { id: "l01", title: "Bài 12: useEffect và vòng đời component" },
    course: reactCourse,
  },
  {
    id: "cm02",
    content:
      "Do React 18 bật StrictMode ở môi trường dev nên effect chạy hai lần đó bạn, build production thì chỉ chạy một lần thôi.",
    status: CommentStatus.Pending,
    createdAt: hoursAgo(2),
    author: { name: "Lê Hoàng Nam", avatar: portrait("men", 32) },
    lesson: { id: "l01", title: "Bài 12: useEffect và vòng đời component" },
    course: reactCourse,
    replyToName: "Trần Thị Vy",
  },
  {
    id: "cm03",
    content:
      "Phần server action này em thấy hơi khó hiểu chỗ revalidatePath. Em gọi revalidatePath('/') sau khi thêm dữ liệu nhưng trang danh sách vẫn hiện dữ liệu cũ, phải F5 mới thấy.\n\nEm đã thử thêm export const dynamic = 'force-dynamic' ở page.tsx nhưng vẫn vậy. Em dùng Next 14.2, deploy lên Vercel. Ở local thì chạy đúng, lên Vercel mới bị.\n\nAnh có thể làm thêm một video riêng về cache của App Router không ạ? Phần này em thấy nhiều bạn trong nhóm cũng bị giống em.",
    status: CommentStatus.Pending,
    createdAt: hoursAgo(5),
    author: { name: "Nguyễn Thị Phương Thảo", avatar: portrait("women", 68) },
    lesson: {
      id: "l02",
      title:
        "Bài 27: Server Actions, revalidatePath và revalidateTag trong App Router",
    },
    course: nextCourse,
  },
  {
    id: "cm04",
    content:
      "Học thêm tại https://khoahoc-giamgia-90phantram.example.com/react-nextjs-full-tron-bo-2024?ref=evonhub-comment-spam nhé mọi người, rẻ hơn nhiều",
    status: CommentStatus.Pending,
    createdAt: hoursAgo(9),
    author: { name: "khoahocgiare247" },
    lesson: { id: "l03", title: "Bài 3: Biến và kiểu dữ liệu" },
    course: javascriptCourse,
  },
  {
    id: "cm05",
    content: "Cảm ơn anh, bài này dễ hiểu quá!",
    status: CommentStatus.Pending,
    createdAt: hoursAgo(20),
    author: { name: "Phạm Minh Khôi", avatar: portrait("men", 75) },
    lesson: { id: "l04", title: "Bài 8: Lưới grid và flex" },
    course: tailwindCourse,
  },
  {
    id: "cm06",
    content:
      "Ở phút 12:30 anh dùng group-hover nhưng em thử trên Tailwind v3.3 không ăn, có phải phải thêm class group ở thẻ cha không ạ?",
    status: CommentStatus.Pending,
    createdAt: hoursAgo(30),
    author: { name: "Đỗ Khánh Linh", avatar: portrait("women", 12) },
    lesson: { id: "l05", title: "Bài 11: Trạng thái hover, focus, group" },
    course: tailwindCourse,
  },
  {
    id: "cm07",
    content:
      "Video bài này bị lỗi, tới khoảng phút thứ 4 là màn hình đen nhưng vẫn có tiếng. Em thử trên Chrome và Safari đều bị.",
    status: CommentStatus.Pending,
    createdAt: hoursAgo(62),
    author: { name: "Võ Thanh Tùng", avatar: portrait("men", 51) },
    lesson: { id: "l06", title: "Bài 19: Context API" },
    course: reactCourse,
  },
  {
    id: "cm08",
    content: "Đúng rồi bạn, thêm class group ở thẻ cha là được.",
    status: CommentStatus.Pending,
    createdAt: hoursAgo(80),
    author: { name: "Tôn Nữ Thị Minh Nguyệt" },
    lesson: { id: "l05", title: "Bài 11: Trạng thái hover, focus, group" },
    course: tailwindCourse,
    replyToName: "Đỗ Khánh Linh",
  },
  {
    id: "cm09",
    content:
      "Bài này hay quá anh, em đã làm được form đăng nhập có kiểm tra lỗi theo từng ô rồi.",
    status: CommentStatus.Approved,
    createdAt: hoursAgo(100),
    author: { name: "Hoàng Gia Bảo", avatar: portrait("men", 8) },
    lesson: { id: "l07", title: "Bài 22: Form và kiểm tra dữ liệu" },
    course: reactCourse,
  },
  {
    id: "cm10",
    content: "Mua khoá học giá rẻ inbox mình",
    status: CommentStatus.Rejected,
    createdAt: hoursAgo(130),
    author: { name: "spam_bot_99" },
    lesson: { id: "l03", title: "Bài 3: Biến và kiểu dữ liệu" },
    course: javascriptCourse,
  },
];

/** Tên tab trong câu "Chọn cả 24 bình luận chờ duyệt"; tab "Tất cả" thì không ghi */
export const COMMENT_TAB_SCOPE_LABELS: Record<CommentManageTab, string> = {
  [CommentStatus.Pending]: "chờ duyệt",
  [CommentStatus.Approved]: "đã duyệt",
  [CommentStatus.Rejected]: "đã từ chối",
  all: "",
};

/** Câu báo rỗng của từng tab khi không tìm, không lọc khoá */
export const COMMENT_EMPTY_MESSAGES: Record<CommentManageTab, string> = {
  [CommentStatus.Pending]: "Không còn bình luận nào chờ duyệt.",
  [CommentStatus.Approved]: "Chưa có bình luận nào được duyệt.",
  [CommentStatus.Rejected]: "Chưa từ chối bình luận nào.",
  all: "Chưa có bình luận nào.",
};

/** Từ khoá trang xem trước dùng cho trạng thái rỗng do tìm */
export const COMMENT_MANAGE_PREVIEW_EMPTY_KEYWORD = "hoàn tiền khoá học";
