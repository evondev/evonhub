import { ORDER_SUPPORT_URL } from "@/modules/order/constants/order-details.constants";
import { SPEAK_NOW_URL } from "@/shared/constants/common.constants";
import {
  Gift,
  MessagesSquare,
  PlayCircle,
  QrCode,
  Route,
  Trophy,
} from "lucide-react";
import {
  FaqItem,
  InstructorStat,
  LandingFeature,
  LandingFooterColumn,
  LandingNavLink,
  PurchaseStep,
} from "../types";

// Lấy đủ khóa đang bán để tính số liệu cả nền tảng, không chỉ trang đầu
export const LANDING_COURSE_LIMIT = 100;

export const LANDING_COURSE_SHOWCASE_LIMIT = 6;

export const LANDING_TESTIMONIAL_LIMIT = 9;

// Chỉ lấy đánh giá 5 sao cho khối cảm nhận
export const LANDING_TESTIMONIAL_RATING = 5;

// Khung nội dung chung của mọi section
export const LANDING_CONTAINER_CLASS_NAME =
  "mx-auto w-full max-w-6xl px-4 sm:px-6";

// Khoảng cách trên dưới của một section
export const LANDING_SECTION_CLASS_NAME = "scroll-mt-16 py-20 sm:py-28";

export const LANDING_SECTION_IDS = {
  features: "cach-hoc",
  courses: "khoa-hoc",
  testimonials: "cam-nhan",
  faq: "hoi-dap",
};

export const landingNavLinks: LandingNavLink[] = [
  { title: "Cách học", url: `#${LANDING_SECTION_IDS.features}` },
  { title: "Khóa học", url: `#${LANDING_SECTION_IDS.courses}` },
  { title: "Cảm nhận", url: `#${LANDING_SECTION_IDS.testimonials}` },
  { title: "Hỏi đáp", url: `#${LANDING_SECTION_IDS.faq}` },
];

export const EVONDEV_URL = "https://evon.dev";

export const EVONDEV_YOUTUBE_URL = "https://www.youtube.com/@evondevfrontend";

export const FACEBOOK_SUPPORT_URL = ORDER_SUPPORT_URL;

// ----- Hero -----

export const HERO_TITLE_LEAD = "AI viết code nhanh.";

export const HERO_TITLE_ACCENT = "Hiểu code vẫn là việc của bạn.";

export const HERO_DESCRIPTION =
  "AI gõ code trong vài giây, nhưng đọc ra chỗ sai, sửa cho đúng và chịu trách nhiệm khi nó chạy thật vẫn là bạn. EvonHub dạy nền tảng để làm được việc đó: JavaScript, React, Next.js, học từ gốc chứ không học thuộc.";

// Màu nền Aurora sau tiêu đề hero: tím brand và tím nhạt
export const HERO_AURORA_COLOR_STOPS: string[] = [
  "#6c5fe6",
  "#a78bfa",
  "#6c5fe6",
];

// Các công nghệ trong những khóa đang bán, chạy ngang dưới hero
export const techStackItems: string[] = [
  "HTML CSS",
  "JavaScript",
  "TypeScript",
  "ReactJS",
  "Next.js",
  "Tailwind CSS",
  "MongoDB",
  "VS Code",
];

// Thời gian số liệu đếm từ 0 lên giá trị thật
export const COUNT_UP_DURATION_MS = 1600;

// Hai điểm luôn đúng của hero; số khóa miễn phí ghép thêm ở utils theo dữ liệu
export const heroHighlights: string[] = ["Có bài học thử", "Không gói tháng"];

// Mỗi chữ của tiêu đề hiện sau chữ trước bấy nhiêu mili giây
export const HERO_WORD_DELAY_MS = 70;

// Dòng code thứ nhất hiện sau bấy nhiêu mili giây, mỗi dòng sau trễ thêm một nhịp
export const HERO_CODE_FIRST_LINE_DELAY_MS = 1000;

export const HERO_CODE_LINE_DELAY_MS = 140;

// Ảnh chụp trang học một bài học thử thật, bản sáng và tối
export const HERO_SHOWCASE_IMAGE = {
  light: "/landing/lesson-preview-light.webp",
  dark: "/landing/lesson-preview-dark.webp",
  width: 1562,
  height: 1250,
};

// ----- Cách học -----

export const landingFeatures: LandingFeature[] = [
  {
    icon: PlayCircle,
    title: "Học thử trước khi mua",
    description:
      "Mở trang khóa học rồi bấm Học thử để xem bài mẫu ngay, không cần đăng nhập.",
  },
  {
    icon: Route,
    title: "Lộ trình có thứ tự",
    description:
      "Đi từ JavaScript cơ bản tới React, Next.js. Biết học gì trước, học gì sau.",
  },
  {
    icon: MessagesSquare,
    title: "Hỏi ngay dưới bài học",
    description:
      "Chỗ nào chưa hiểu thì bình luận ngay dưới bài đó, không phải đi tìm nhóm chat.",
  },
  {
    icon: Trophy,
    title: "Bảng xếp hạng theo phút học",
    description:
      "Mỗi tuần một bảng xếp hạng theo số phút học. Học đều thì lên bậc.",
  },
  {
    icon: Gift,
    title: "Khóa miễn phí, không chuyển khoản",
    description:
      "Bấm đăng ký là có đơn 0đ. Đơn được duyệt thì khóa vào Khu vực học tập.",
  },
  {
    icon: QrCode,
    title: "Trả một lần, không gói tháng",
    description:
      "Khóa trả phí chỉ trả một lần, quét QR là khóa tự mở. Không có gói thành viên.",
  },
];

// ----- Người dạy -----

export const INSTRUCTOR_BIO =
  "Mình làm Frontend từ năm 2016, bắt đầu từ cắt HTML CSS rồi tới JavaScript, React và Next.js. Các khóa ở EvonHub dạy đúng những thứ mình dùng mỗi ngày khi làm sản phẩm thật.";

// Số liệu lấy từ evon.dev (11/2026). Cập nhật tay khi số đổi nhiều
export const instructorStats: InstructorStat[] = [
  {
    value: "41.5K",
    label: "subscriber YouTube",
    url: EVONDEV_YOUTUBE_URL,
  },
  {
    value: "516",
    label: "video đã đăng",
    url: EVONDEV_YOUTUBE_URL,
  },
  {
    value: "163K+",
    label: "lượt cài theme VS Code",
    url: `${EVONDEV_URL}/#vscode`,
  },
  {
    value: "22.4K",
    label: "follower TikTok",
    url: "https://www.tiktok.com/@evon.dev",
  },
];

// ----- Mua thế nào -----

export const purchaseSteps: PurchaseStep[] = [
  {
    title: "Tạo tài khoản",
    description: "Đăng ký tài khoản EvonHub, không mất phí.",
  },
  {
    title: "Mở khóa, bấm đăng ký",
    description:
      "Khóa miễn phí tạo đơn 0đ, không cần chuyển khoản. Khóa trả phí thì quét QR với nội dung là mã đơn.",
  },
  {
    title: "Vào Khu vực học tập",
    description:
      "Đơn miễn phí được duyệt, hoặc hệ thống nhận được tiền, là khóa nằm ngay trong Khu vực học tập.",
  },
];

// ----- Hỏi đáp -----

export const faqItems: FaqItem[] = [
  {
    question: "Khóa miễn phí thì đăng ký thế nào?",
    answer:
      "Mở trang khóa học rồi bấm đăng ký. Hệ thống tạo đơn 0đ, không cần chuyển khoản. Đơn được duyệt thì khóa vào Khu vực học tập.",
  },
  {
    question: "Đăng ký rồi thì học được bao lâu?",
    answer:
      "Khóa nằm trong tài khoản của bạn, không có hạn dùng và không phải gia hạn.",
  },
  {
    question: "Khóa trả phí chuyển khoản xong bao lâu thì vào học?",
    answer:
      "Chuyển đúng số tiền với nội dung là mã đơn thì khóa tự mở ngay khi hệ thống nhận được tiền. Đơn được giữ trong 24 giờ.",
  },
  {
    question: "Có được học thử trước không?",
    answer:
      "Có. Các khóa có bài học thử: mở trang khóa học, bấm Học thử là xem được ngay, không cần đăng nhập.",
  },
  {
    question: "Mới bắt đầu thì nên học khóa nào?",
    answer:
      "Bắt đầu với khóa JavaScript cơ bản cho người mới, sau đó tới ReactJS cơ bản rồi Next.js.",
  },
  {
    question: "Có gói thành viên học tất cả các khóa không?",
    answer:
      "Không. Mỗi khóa đăng ký riêng. Khóa trả phí trả một lần, không có gói tháng hay gói năm.",
  },
  {
    question: "Học bị kẹt thì hỏi ở đâu?",
    answer:
      "Bình luận ngay dưới bài học đó, hoặc nhắn trực tiếp cho evondev qua Facebook.",
  },
];

// ----- Footer -----

export const landingFooterColumns: LandingFooterColumn[] = [
  {
    title: "Học",
    links: [
      { title: "Khóa học", url: "/explore" },
      { title: "Video", url: "/videos" },
      { title: "Xếp hạng", url: "/leaderboard" },
      { title: "Khu vực học tập", url: "/study" },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { title: "Hướng dẫn mua khóa", url: "/how-to-buy" },
      { title: "Nhắn Facebook", url: FACEBOOK_SUPPORT_URL, isExternal: true },
    ],
  },
  {
    title: "Evondev",
    links: [
      { title: "evon.dev", url: EVONDEV_URL, isExternal: true },
      { title: "YouTube", url: EVONDEV_YOUTUBE_URL, isExternal: true },
      { title: "Học tiếng Anh", url: SPEAK_NOW_URL, isExternal: true },
    ],
  },
];
