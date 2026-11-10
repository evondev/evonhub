import { ActivityType } from "@/shared/constants/activity.constants";
import { PROFILE_PUBLIC_PATH } from "@/shared/constants/user.constants";
import { CourseFilterOption, PreviewStateLink } from "@/shared/types";
import { ActivityRow, TopLessonRow } from "../types";
import { ACTIVITY_DELETED_LABELS } from ".";

export const ACTIVITY_MANAGE_PREVIEW_STATE_LINKS: PreviewStateLink[] = [
  { state: "du-lieu", label: "Có dữ liệu" },
  { state: "rong", label: "Rỗng do tìm" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];

/** Chưa lọc gì thì giả như đang xem trang đầu của cả nhật ký thật */
export const ACTIVITY_MANAGE_PREVIEW_ALL_COUNT = 1284;

/** Từ khoá trang xem trước dùng cho trạng thái rỗng do tìm */
export const ACTIVITY_MANAGE_PREVIEW_EMPTY_KEYWORD = "khong-ai-ten-nay";

export const PREVIEW_ACTIVITY_COURSES: CourseFilterOption[] = [
  {
    id: "c01",
    title: "Khoá học NextJS Pro - Xây dựng E Learning System hoàn chỉnh",
  },
  {
    id: "c02",
    title: "Khoá học ReactJS Master - Nắm vững kiến thức React chuyên sâu",
  },
  {
    id: "c03",
    title: "Khoá học HTML CSS Master - Giúp bạn Master kỹ năng HTML CSS",
  },
  {
    id: "c04",
    title: "Khoá học Javascript từ cơ bản đến nâng cao cho người mới bắt đầu",
  },
];

const portrait = (gender: "men" | "women", index: number) =>
  `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;

// Mốc tròn phút: server và trình duyệt ra cùng chữ "x phút trước", không lệch khi hydrate
const previewNow = Math.floor(Date.now() / 60_000) * 60_000;
const minutesAgo = (minutes: number) =>
  new Date(previewNow - minutes * 60 * 1000).toISOString();

const previewCourse = (courseIndex: number, slug: string) => ({
  courseTitle: PREVIEW_ACTIVITY_COURSES[courseIndex].title,
  courseHref: `/course/${slug}`,
});

const previewUsers = {
  vy: {
    userName: "Trần Thị Vy",
    userEmail: "vy.tran@gmail.com",
    userAvatar: portrait("women", 44),
    userRoleLabel: "",
    userProfileHref: `${PROFILE_PUBLIC_PATH}/vytran`,
  },
  hoang: {
    userName: "Nguyễn Văn Hoàng",
    userEmail: "hoangnv.dev@gmail.com",
    userAvatar: portrait("men", 32),
    userRoleLabel: "",
    userProfileHref: `${PROFILE_PUBLIC_PATH}/hoangnv`,
  },
  khoi: {
    userName: "Lê Hoàng Phương Nguyễn Minh Khôi",
    userEmail: "khoi.lehoangphuong.nguyenminh@outlook.com",
    userRoleLabel: "",
    userProfileHref: `${PROFILE_PUBLIC_PATH}/khoinguyen`,
  },
  bao: {
    userName: "Phạm Quốc Bảo",
    userEmail: "baopq@gmail.com",
    userAvatar: portrait("men", 75),
    userRoleLabel: "",
    userProfileHref: `${PROFILE_PUBLIC_PATH}/baopq`,
  },
  ha: {
    userName: "Đỗ Thu Hà",
    userEmail: "thuha.do@yahoo.com",
    userAvatar: portrait("women", 12),
    userRoleLabel: "",
    userProfileHref: `${PROFILE_PUBLIC_PATH}/thuhado`,
  },
  admin: {
    userName: "Evondev",
    userEmail: "admin@evonhub.dev",
    userAvatar: portrait("men", 1),
    userRoleLabel: "Admin",
    userProfileHref: `${PROFILE_PUBLIC_PATH}/evondev`,
  },
  expert: {
    userName: "Minh Tuấn",
    userEmail: "tuan.expert@gmail.com",
    userAvatar: portrait("men", 8),
    userRoleLabel: "Chuyên gia",
    userProfileHref: `${PROFILE_PUBLIC_PATH}/minhtuan`,
  },
};

/** Một việc làm một lần (không có phiên): bắt đầu và nhịp cuối cùng một giờ */
const atMinutesAgo = (minutes: number) => ({
  startedAt: minutesAgo(minutes),
  lastSeenAt: minutesAgo(minutes),
});

/**
 * Nhật ký giả, mới nhất trước, đủ mọi loại việc: ba người đang học (Vy vừa
 * chuyển bài nên bài trước không còn "đang học"), một người đang xem video lẻ, bình luận, đánh giá, mua
 * khoá ba kiểu duyệt, tài khoản mới, admin / chuyên gia sửa nội dung, tên dài,
 * bài đã xoá, người dùng đã xoá
 */
export const PREVIEW_ACTIVITIES: ActivityRow[] = [
  {
    id: "a01",
    type: ActivityType.ViewLesson,
    ...previewUsers.vy,
    targetTitle: "Bài 12: Server Actions và revalidatePath",
    ...previewCourse(0, "nextjs-pro"),
    detail: "",
    startedAt: minutesAgo(1),
    lastSeenAt: minutesAgo(0),
  },
  {
    id: "a02",
    type: ActivityType.ViewLesson,
    ...previewUsers.hoang,
    targetTitle: "Bài 5: useEffect và những cái bẫy hay gặp",
    ...previewCourse(1, "reactjs-master"),
    detail: "",
    startedAt: minutesAgo(47),
    lastSeenAt: minutesAgo(1),
  },
  {
    id: "a03",
    type: ActivityType.CompleteLesson,
    ...previewUsers.vy,
    targetTitle: "Bài 11: Route Handlers",
    ...previewCourse(0, "nextjs-pro"),
    detail: "",
    ...atMinutesAgo(2),
  },
  {
    id: "a04",
    type: ActivityType.UpdateLesson,
    ...previewUsers.admin,
    targetTitle: "Bài 12: Server Actions và revalidatePath",
    ...previewCourse(0, "nextjs-pro"),
    detail: "Đổi: tiêu đề, video, thời lượng",
    ...atMinutesAgo(2),
  },
  {
    id: "a05",
    type: ActivityType.ViewLesson,
    ...previewUsers.vy,
    targetTitle: "Bài 11: Route Handlers",
    ...previewCourse(0, "nextjs-pro"),
    detail: "",
    startedAt: minutesAgo(26),
    lastSeenAt: minutesAgo(2),
  },
  {
    id: "a06",
    type: ActivityType.ViewLesson,
    ...previewUsers.khoi,
    targetTitle:
      "Bài 34: Tìm hiểu về Event Loop, Call Stack, Microtask Queue và Macrotask Queue trong Javascript",
    ...previewCourse(3, "javascript-co-ban-den-nang-cao"),
    detail: "",
    startedAt: minutesAgo(8),
    lastSeenAt: minutesAgo(3),
  },
  {
    id: "a07",
    type: ActivityType.Comment,
    ...previewUsers.hoang,
    targetTitle: "Bài 5: useEffect và những cái bẫy hay gặp",
    ...previewCourse(1, "reactjs-master"),
    detail:
      "Anh ơi cho em hỏi sao cleanup function lại chạy trước effect mới vậy ạ, em đọc docs mà vẫn chưa hiểu lắm, có ví dụ nào dễ hình dung hơn không ạ?",
    ...atMinutesAgo(9),
  },
  {
    id: "a08",
    type: ActivityType.PurchaseCourse,
    ...previewUsers.ha,
    targetTitle: PREVIEW_ACTIVITY_COURSES[1].title,
    ...previewCourse(1, "reactjs-master"),
    detail: "Đơn DH84726153 · 799.000đ · SePay tự duyệt",
    ...atMinutesAgo(12),
  },
  {
    id: "a09",
    type: ActivityType.CreateOrder,
    ...previewUsers.ha,
    targetTitle: PREVIEW_ACTIVITY_COURSES[1].title,
    ...previewCourse(1, "reactjs-master"),
    detail: "Đơn DH84726153 · 799.000đ",
    ...atMinutesAgo(15),
  },
  {
    id: "a10",
    type: ActivityType.SignUp,
    ...previewUsers.ha,
    targetTitle: "",
    courseTitle: "",
    courseHref: "",
    detail: "",
    ...atMinutesAgo(17),
  },
  {
    id: "a10b",
    type: ActivityType.ViewVideo,
    ...previewUsers.ha,
    targetTitle: "Tối ưu ảnh với next/image trong 10 phút",
    courseTitle: "Tối ưu ảnh với next/image trong 10 phút",
    courseHref: "/course/toi-uu-anh-next-image",
    detail: "",
    startedAt: minutesAgo(12),
    lastSeenAt: minutesAgo(2),
  },
  {
    id: "a11",
    type: ActivityType.RateCourse,
    ...previewUsers.bao,
    targetTitle: PREVIEW_ACTIVITY_COURSES[2].title,
    ...previewCourse(2, "html-css-master"),
    detail:
      "5★ · Khoá học rất chi tiết, anh giảng chậm rãi dễ hiểu. Phần flexbox với grid làm em hết sợ CSS luôn.",
    ...atMinutesAgo(25),
  },
  {
    id: "a12",
    type: ActivityType.EnrollFree,
    ...previewUsers.khoi,
    targetTitle: PREVIEW_ACTIVITY_COURSES[3].title,
    ...previewCourse(3, "javascript-co-ban-den-nang-cao"),
    detail: "",
    ...atMinutesAgo(40),
  },
  {
    id: "a13",
    type: ActivityType.ReorderOutline,
    ...previewUsers.expert,
    targetTitle: PREVIEW_ACTIVITY_COURSES[1].title,
    ...previewCourse(1, "reactjs-master"),
    detail: "",
    startedAt: minutesAgo(70),
    lastSeenAt: minutesAgo(55),
  },
  {
    id: "a14",
    type: ActivityType.CreateLesson,
    ...previewUsers.expert,
    targetTitle: "Bài 6: useMemo và useCallback",
    ...previewCourse(1, "reactjs-master"),
    detail: "Chương: Hooks nâng cao",
    ...atMinutesAgo(72),
  },
  {
    id: "a15",
    type: ActivityType.UpdateLecture,
    ...previewUsers.expert,
    targetTitle: "Hooks nâng cao",
    ...previewCourse(1, "reactjs-master"),
    detail: "Tên cũ: Hooks",
    ...atMinutesAgo(80),
  },
  {
    id: "a16",
    type: ActivityType.PurchaseCourse,
    ...previewUsers.bao,
    targetTitle: PREVIEW_ACTIVITY_COURSES[0].title,
    ...previewCourse(0, "nextjs-pro"),
    detail: "Đơn DH84719020 · 1.299.000đ · Minh Tuấn duyệt tay",
    ...atMinutesAgo(130),
  },
  {
    id: "a17",
    type: ActivityType.DeleteLesson,
    ...previewUsers.admin,
    targetTitle: "Bài 7: Cài đặt môi trường (bản cũ)",
    ...previewCourse(0, "nextjs-pro"),
    detail: "",
    ...atMinutesAgo(150),
  },
  {
    id: "a18",
    type: ActivityType.UpdateCourse,
    ...previewUsers.admin,
    targetTitle: PREVIEW_ACTIVITY_COURSES[0].title,
    ...previewCourse(0, "nextjs-pro"),
    detail: "Đổi: giá, giá gốc, mô tả",
    ...atMinutesAgo(160),
  },
  {
    id: "a19",
    type: ActivityType.ViewLesson,
    ...previewUsers.ha,
    targetTitle: ACTIVITY_DELETED_LABELS.lesson,
    ...previewCourse(1, "reactjs-master"),
    detail: "",
    startedAt: minutesAgo(190),
    lastSeenAt: minutesAgo(185),
  },
  {
    id: "a20",
    type: ActivityType.ViewLesson,
    userName: ACTIVITY_DELETED_LABELS.user,
    userEmail: "",
    userRoleLabel: "",
    userProfileHref: "",
    targetTitle: "Bài 1: Giới thiệu khoá học",
    ...previewCourse(3, "javascript-co-ban-den-nang-cao"),
    detail: "",
    startedAt: minutesAgo(60 * 26),
    lastSeenAt: minutesAgo(60 * 26 - 4),
  },
  {
    id: "a21",
    type: ActivityType.DeleteCourse,
    ...previewUsers.admin,
    targetTitle: "Khoá học Vscode Pro - Thành thạo Vscode cho người mới",
    courseTitle: ACTIVITY_DELETED_LABELS.course,
    courseHref: "",
    detail: "Chuyển về chờ duyệt, ẩn khỏi trang",
    ...atMinutesAgo(60 * 50),
  },
];

const previewLessonHref = (slug: string, lessonId: string) =>
  `/${slug}/lesson?id=${lessonId}`;

/**
 * Bảng xếp hạng giả, đã xếp sẵn nhiều người học nhất trước, đủ hơn một trang:
 * hạng hoà người học (xét phiên), tên dài, bài đã xoá, khoá đã xoá. Hạng tính
 * lại sau khi lọc
 */
export const PREVIEW_TOP_LESSONS: TopLessonRow[] = [
  {
    id: "l01",
    lessonTitle: "Bài 1: Giới thiệu khoá học",
    lessonHref: previewLessonHref("javascript-co-ban-den-nang-cao", "l01"),
    learnerCount: 186,
    sessionCount: 241,
    totalStudyMinutes: 1930,
    ...previewCourse(3, "javascript-co-ban-den-nang-cao"),
  },
  {
    id: "l02",
    lessonTitle: "Bài 0: Lưu ý quan trọng",
    lessonHref: previewLessonHref("reactjs-master", "l02"),
    learnerCount: 142,
    sessionCount: 160,
    totalStudyMinutes: 812,
    ...previewCourse(1, "reactjs-master"),
  },
  {
    id: "l03",
    lessonTitle: "Bài 12: Server Actions và revalidatePath",
    lessonHref: previewLessonHref("nextjs-pro", "l03"),
    learnerCount: 97,
    sessionCount: 188,
    totalStudyMinutes: 4215,
    ...previewCourse(0, "nextjs-pro"),
  },
  {
    id: "l04",
    lessonTitle: "Bài 5: useEffect và những cái bẫy hay gặp",
    lessonHref: previewLessonHref("reactjs-master", "l04"),
    learnerCount: 97,
    sessionCount: 152,
    totalStudyMinutes: 3020,
    ...previewCourse(1, "reactjs-master"),
  },
  {
    id: "l05",
    lessonTitle:
      "Bài 103: Optional chaining, nullish coalescing và những toán tử mới giúp code ngắn gọn hơn rất nhiều",
    lessonHref: previewLessonHref("javascript-co-ban-den-nang-cao", "l05"),
    learnerCount: 64,
    sessionCount: 90,
    totalStudyMinutes: 1240,
    ...previewCourse(3, "javascript-co-ban-den-nang-cao"),
  },
  {
    id: "l06",
    lessonTitle: "Bài 3: Flexbox từ A tới Z",
    lessonHref: previewLessonHref("html-css-master", "l06"),
    learnerCount: 58,
    sessionCount: 71,
    totalStudyMinutes: 960,
    ...previewCourse(2, "html-css-master"),
  },
  {
    id: "l07",
    lessonTitle: "Bài 104: Destructuring",
    lessonHref: previewLessonHref("javascript-co-ban-den-nang-cao", "l07"),
    learnerCount: 41,
    sessionCount: 55,
    totalStudyMinutes: 600,
    ...previewCourse(3, "javascript-co-ban-den-nang-cao"),
  },
  {
    id: "l08",
    lessonTitle: ACTIVITY_DELETED_LABELS.lesson,
    lessonHref: "",
    learnerCount: 33,
    sessionCount: 38,
    totalStudyMinutes: 300,
    ...previewCourse(0, "nextjs-pro"),
  },
  {
    id: "l09",
    lessonTitle: "Bài 11: Route Handlers",
    lessonHref: previewLessonHref("nextjs-pro", "l09"),
    learnerCount: 29,
    sessionCount: 44,
    totalStudyMinutes: 715,
    ...previewCourse(0, "nextjs-pro"),
  },
  {
    id: "l10",
    lessonTitle: "Bài 6: useMemo và useCallback",
    lessonHref: previewLessonHref("reactjs-master", "l10"),
    learnerCount: 22,
    sessionCount: 25,
    totalStudyMinutes: 60,
    ...previewCourse(1, "reactjs-master"),
  },
  {
    id: "l11",
    lessonTitle: "Bài 2: Cài đặt môi trường",
    lessonHref: "",
    courseTitle: ACTIVITY_DELETED_LABELS.course,
    courseHref: "",
    learnerCount: 8,
    sessionCount: 9,
    totalStudyMinutes: 0,
  },
  {
    id: "l12",
    lessonTitle: "Bài 4: Grid layout",
    lessonHref: previewLessonHref("html-css-master", "l12"),
    learnerCount: 1,
    sessionCount: 1,
    totalStudyMinutes: 3,
    ...previewCourse(2, "html-css-master"),
  },
].map((lesson, index) => ({ ...lesson, rank: index + 1 }));
