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

export const LANDING_TESTIMONIAL_LIMIT = 12;

// Chỉ lấy đánh giá 5 sao cho khối cảm nhận
export const LANDING_TESTIMONIAL_RATING = 5;

// Khung nội dung chung của mọi section
export const LANDING_CONTAINER_CLASS_NAME =
  "mx-auto w-full max-w-6xl px-4 sm:px-6";

// Khoảng cách trên dưới của một section
export const LANDING_SECTION_CLASS_NAME = "scroll-mt-16 py-16 sm:py-24";

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

// Màu chùm tia sáng rọi từ đỉnh hero xuống: trắng ngả tím
export const HERO_LIGHT_RAYS_COLOR = "#ddd6fe";

// Màu tia laser rọi xuống editor hero
export const HERO_LASER_COLOR = "#8b5cf6";

// Màu các vệt sáng rơi sau tiêu đề phần cảm nhận
export const TESTIMONIAL_LIGHTFALL_COLORS: string[] = [
  "#ffffff",
  "#c4b5fd",
  "#a78bfa",
];

export const TESTIMONIAL_LIGHTFALL_GLOW_COLOR = "#6c5fe6";

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

// Ảnh chụp trang học một bài học thử thật (giao diện tối, cùng nền landing)
export const LESSON_SHOWCASE_IMAGE = {
  src: "/landing/lesson-preview-dark.webp",
  width: 1562,
  height: 1250,
};

// ----- Nút neon dùng chung cả trang -----

export const NEON_PRIMARY_BUTTON_CLASS_NAME =
  "btn-shine h-11 rounded-full bg-gradient-to-b from-violet-400 to-violet-600 px-6 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.4),0_0_0_1px_rgb(167_139_250/0.6),0_10px_40px_-8px_rgb(139_92_246/0.8)] transition-shadow duration-300 hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_0_0_1px_rgb(196_181_253/0.9),0_12px_60px_-4px_rgb(139_92_246/1)]";

export const NEON_GHOST_BUTTON_CLASS_NAME =
  "h-11 rounded-full bg-white/[0.06] px-6 text-white ring-1 ring-inset ring-white/15 backdrop-blur-md transition-colors hover:bg-white/10";

// Nút nhỏ ở header: cùng kiểu, thấp hơn
export const NEON_BUTTON_SMALL_CLASS_NAME = "h-9 px-4";

// ----- Lưới kẻ mờ (số liệu, cách học, người dạy) -----

// Vạch sáng nhỏ nằm trên đường kẻ trái của ô, ngang dòng tiêu đề. Lệch ra
// đúng bằng phần đệm của ô (p-6, sm:p-8) để rơi đúng lên đường kẻ
export const GRID_TICK_CLASS_NAME =
  "relative before:absolute before:-left-6 before:top-1/2 before:h-4 before:w-px before:-translate-y-1/2 before:bg-violet-300 before:shadow-[0_0_8px_rgb(167_139_250)] sm:before:-left-8";

// ----- Cảm nhận: hai hàng card trôi ngang -----

// Mỗi hàng cần đủ card để phủ hết bề ngang màn rộng, thiếu thì lặp lại
export const TESTIMONIAL_MIN_ROW_LENGTH = 6;

// Ít đánh giá quá thì chỉ chạy một hàng
export const TESTIMONIAL_SINGLE_ROW_MAX = 3;

// ----- CTA cuối: lưới ô vuông -----

// Ô cỡ cố định, lưới tự chia số cột theo bề ngang; dư ô thì bị cắt khỏi khối
export const CTA_PIXEL_COUNT = 480;

// Ô thứ i sáng sẵn khi (i * STEP) % MODULO < THRESHOLD: khoảng 1/10 số ô
export const CTA_LIT_PIXEL_STEP = 37;

export const CTA_LIT_PIXEL_MODULO = 29;

export const CTA_LIT_PIXEL_THRESHOLD = 3;

// Các ô sáng nhấp nháy lệch nhịp nhau
export const ctaPixelTwinkleDelayClassNames: string[] = [
  "[animation-delay:0s]",
  "[animation-delay:1.5s]",
  "[animation-delay:3s]",
  "[animation-delay:4.5s]",
];

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
