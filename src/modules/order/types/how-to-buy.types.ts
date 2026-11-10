import { LucideIcon } from "lucide-react";

export interface HowToBuyLink {
  label: string;
  href: string;
}

export interface HowToBuyStep {
  title: string;
  description: string;
  /** Mã đơn mẫu, in mono dưới mô tả để khách nhận ra mã khi thấy */
  codeExample?: string;
  /** Bước chuyển khoản: hiện hai cách trả tiền ngay dưới mô tả */
  hasPaymentMethods?: boolean;
  link?: HowToBuyLink;
}

export interface HowToBuyPaymentMethod {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Khi nào khóa mở: dòng nhỏ cuối thẻ */
  unlockNote: string;
}

export interface HowToBuyTrouble {
  title: string;
  description: string;
}
