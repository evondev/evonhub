import { LucideIcon } from "lucide-react";

export interface LandingNavLink {
  title: string;
  url: string;
}

/** Một chữ ở vế đầu của tiêu đề hero */
export interface HeroTitleWord {
  text: string;
}

export interface HeroTitleWords {
  leadWords: HeroTitleWord[];
  /** Vế sau, hiện nguyên cụm với dải màu nhấn */
  accentText: string;
  /** Vế sau hiện lên ngay sau chữ cuối của vế đầu */
  accentDelayMs: number;
}

/** Cách hiện con số: số nguyên, rút gọn ("507 nghìn"), điểm trên 5 ("4,8/5") */
export type StatValueFormat = "integer" | "compact" | "rating";

export interface LandingStatItem {
  value: number;
  format: StatValueFormat;
  label: string;
  /** Dòng chữ nhỏ bên dưới: nguồn hoặc cách đếm của con số */
  hint: string;
  /** Có thì cả ô là link, rê vào đổi nền */
  url?: string;
}

export interface LandingFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface InstructorStat {
  value: string;
  label: string;
  url: string;
}

export interface PurchaseStep {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface LandingFooterLinkItem {
  title: string;
  url: string;
  isExternal?: boolean;
}

export interface LandingFooterColumn {
  title: string;
  links: LandingFooterLinkItem[];
}

/** Một mẩu chữ trong dòng code đã tô màu */
export type CodeTokenKind =
  "plain" | "keyword" | "tag" | "attribute" | "danger";

export interface CodeToken {
  text: string;
  kind: CodeTokenKind;
}

/** Các nhịp của màn diễn "AI gõ, bạn soát, bạn sửa" trong editor hero */
export type ReviewDemoPhase =
  "typing" | "reviewing" | "flagged" | "fixing" | "done";

/** Trạng thái editor tại một thời điểm của màn diễn */
export interface ReviewDemoFrame {
  phase: ReviewDemoPhase;
  /** Số ký tự AI đã gõ, tính trên toàn bộ đoạn code */
  typedCharCount: number;
  /** 0 → 1: thanh soát chạy từ dòng đầu tới dòng lỗi */
  scanProgress: number;
  /** Số ký tự của dòng sửa đã gõ */
  fixedCharCount: number;
}

export interface ReviewDemoMessage {
  icon: LucideIcon;
  title: string;
  text: string;
  className: string;
}

/** Kiểu một dòng code trong editor màn diễn */
export type ReviewDemoLineTone = "normal" | "flagged" | "removed" | "added";

export interface ReviewDemoPhaseStyle {
  label: string;
  className: string;
}
