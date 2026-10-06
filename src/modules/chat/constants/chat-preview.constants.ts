import { UserRole } from "@/shared/constants/user.constants";
import {
  ChatPreviewMessageSeed,
  ChatPreviewStateLink,
  ChatPreviewVisitor,
  ChatSender,
} from "../types";

export const CHAT_PREVIEW_STATE_LINKS: ChatPreviewStateLink[] = [
  { state: "du-lieu", label: "Có dữ liệu" },
  { state: "tin-moi", label: "Tin đến liên tục" },
  { state: "chan", label: "Gửi bị chặn" },
  { state: "mod", label: "Góc nhìn mod" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "rong", label: "Rỗng" },
  { state: "loi", label: "Lỗi" },
];

const portrait = (gender: "men" | "women", id: number) =>
  `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;

/** Người trong phòng xem trước. Có người không avatar, tên rất dài để thấy ca biên */
export const chatPreviewSenders: Record<string, ChatSender> = {
  me: {
    userId: "preview-me",
    name: "Lê Minh Khang",
    username: "minhkhang",
    avatar: portrait("men", 52),
    role: UserRole.User,
  },
  vy: {
    userId: "preview-vy",
    name: "Nguyễn Thảo Vy",
    username: "thaovy",
    avatar: portrait("women", 44),
    role: UserRole.User,
  },
  long: {
    userId: "preview-long",
    name: "Phạm Đức Long",
    username: "duclong",
    avatar: portrait("men", 32),
    role: UserRole.User,
  },
  phuong: {
    userId: "preview-phuong",
    name: "Hoàng Thị Mai Phương",
    username: "maiphuong",
    avatar: portrait("women", 68),
    role: UserRole.Expert,
  },
  vu: {
    userId: "preview-vu",
    name: "Trịnh Công Bảo Nguyễn Hoàng Long Vũ",
    username: "longvu",
    avatar: portrait("men", 11),
    role: UserRole.User,
  },
  anh: {
    userId: "preview-anh",
    name: "Đỗ Quỳnh Anh",
    username: "quynhanh",
    avatar: portrait("women", 21),
    role: UserRole.User,
  },
  hai: {
    userId: "preview-hai",
    name: "Vũ Hải",
    username: "vuhai",
    avatar: "",
    role: UserRole.User,
  },
  evon: {
    userId: "preview-evon",
    name: "Evondev",
    username: "evondev",
    avatar: "",
    role: UserRole.Admin,
  },
  huy: {
    userId: "preview-huy",
    name: "Bùi Gia Huy",
    username: "giahuy",
    avatar: portrait("men", 64),
    role: UserRole.User,
  },
  tram: {
    userId: "preview-tram",
    name: "Lý Ngọc Trâm",
    username: "ngoctram",
    avatar: portrait("women", 12),
    role: UserRole.User,
  },
};

/** Học viên online nhưng chưa nói gì; avatar rỗng là người chưa có ảnh */
export const chatPreviewVisitors: ChatPreviewVisitor[] = [
  { name: "Ngô Thanh Tùng", avatar: portrait("men", 22) },
  { name: "Đặng Mỹ Linh", avatar: portrait("women", 33) },
  { name: "Phan Quốc Bảo", avatar: portrait("men", 41) },
  { name: "Mai Anh Thư", avatar: portrait("women", 50) },
  { name: "Tạ Đình Phong", avatar: portrait("men", 70) },
  { name: "Lâm Khánh Vy", avatar: portrait("women", 15) },
  { name: "Hồ Tuấn Kiệt", avatar: "" },
  { name: "Châu Ngọc Hân", avatar: portrait("women", 57) },
  { name: "Kiều Minh Trí", avatar: portrait("men", 85) },
  { name: "Dương Bích Ngọc", avatar: portrait("women", 26) },
  { name: "La Văn Toàn", avatar: portrait("men", 19) },
  { name: "Quách Hải Yến", avatar: "" },
  { name: "Tôn Nữ Thu Hà", avatar: portrait("women", 90) },
];

/** Một tối trong phòng chat, "bây giờ" khoảng 23:40 */
export const chatPreviewMessageSeeds: ChatPreviewMessageSeed[] = [
  { time: "21:46", senderKey: "tram", content: "Tối nay phòng đông ghê 😄" },
  { time: "21:47", senderKey: "tram", content: "mọi người đang học tới bài nào rồi" },
  { time: "21:52", senderKey: "huy", content: "em đang ở bài 14 khoá JavaScript, phần closure hơi khoai" },
  { time: "21:55", senderKey: "anh", content: "closure xem lại ví dụ cái bộ đếm là thấm liền á" },
  { time: "22:02", senderKey: "long", content: "Chào cả nhà, tối nay ai còn thức code không" },
  { time: "22:03", senderKey: "vy", content: "có em nè, đang kẹt bài useEffect chạy 2 lần" },
  { time: "22:03", senderKey: "vy", content: "dev mode thôi hay lên prod cũng bị ạ?" },
  {
    time: "22:05",
    senderKey: "phuong",
    content:
      "Chạy 2 lần ở dev là do StrictMode cố ý mount, unmount rồi mount lại để bắt effect thiếu cleanup. Build prod chỉ chạy 1 lần. Em xem thêm ở đây nhé: https://react.dev/reference/react/StrictMode",
  },
  { time: "22:06", senderKey: "vy", content: "à ra vậy, cảm ơn cô 🙏" },
  {
    time: "22:10",
    senderKey: "vu",
    content:
      "Mọi người cho em hỏi Next.js 14 server action có gọi được trong client component không ạ, em import vào mà báo lỗi",
  },
  { time: "22:12", senderKey: "me", content: 'gọi được bạn ơi, file action phải có "use server" ở dòng đầu' },
  { time: "22:12", senderKey: "me", content: "rồi import bình thường như một hàm async" },
  { time: "22:15", senderKey: "hai", content: "👍" },
  { time: "22:30", senderKey: "anh", content: "Có ai học khoá Tailwind chưa, cho mình xin review với" },
  { time: "22:31", senderKey: "long", content: "mình học rồi, phần responsive rất ổn, có bài tập dựng lại landing luôn" },
  { time: "22:31", senderKey: "long", content: "link khoá nè www.evonhub.dev/course/tailwind-css" },
  {
    time: "22:40",
    senderKey: "evon",
    content:
      "Tin trong phòng sẽ tự dọn lúc 00:00 như mọi hôm nha mọi người. Cần lưu đoạn code nào thì copy về trước 😉",
  },
  { time: "22:41", senderKey: "huy", content: "admin ơi khi nào có khoá Node.js ạ" },
  { time: "22:43", senderKey: "evon", content: "Tháng sau nha em, đang quay những bài cuối 🎬" },
  {
    time: "23:02",
    senderKey: "vu",
    content:
      "em làm theo hướng dẫn này mà vẫn lỗi hydration: https://nextjs.org/docs/messages/react-hydration-error?utm_source=evonhub&utm_medium=chat&utm_campaign=hoi-dap",
  },
  {
    time: "23:05",
    senderKey: "phuong",
    content:
      "Lỗi hydration thường do server và client render ra khác nhau, ví dụ gọi Date.now(), Math.random() hay window ngay lúc render.\nEm thử chuyển phần đó vào useEffect, hoặc tắt SSR cho component bằng dynamic(..., { ssr: false }).",
  },
  { time: "23:06", senderKey: "vu", content: "dạ đúng rồi cô, em lấy new Date() ngay trong JSX 😅 sửa xong hết lỗi rồi" },
  { time: "23:20", senderKey: "vy", content: "😂" },
  {
    time: "23:21",
    senderKey: "anh",
    content: "mai 8h sáng có ai muốn pair-programming bài tập cuối khoá JS không, mình tạo phòng Meet",
  },
  { time: "23:22", senderKey: "me", content: "mình tham gia với" },
  { time: "23:30", senderKey: "huy", content: "cho em 1 slot nha" },
  { time: "23:35", senderKey: "hai", content: "đi ngủ đây, chúc mọi người code không bug 🐛" },
  { time: "23:38", senderKey: "long", content: "ngủ ngon 👋" },
  { time: "23:39", senderKey: "me", content: "mai gặp lại mọi người nha", isPending: true },
];
