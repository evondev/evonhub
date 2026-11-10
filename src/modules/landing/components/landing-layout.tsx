import { ReactNode } from "react";
import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";

interface LandingLayoutProps {
  children: ReactNode;
}

/**
 * Bọc các trang marketing: header cố định, nội dung, footer. Landing luôn nền
 * tối neon dù app đang ở giao diện sáng: lớp "dark" ép token tối cho cả cây,
 * nền gần đen ngả tím. Wrapper gốc đã chừa pt-16 cho header nên kéo nền lên phủ
 */
export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div
      data-landing
      className="dark -mt-16 min-h-screen overflow-x-clip bg-surface pt-16 text-foreground [--background:7_6_13] [--surface:7_6_13] [color-scheme:dark]"
    >
      <LandingHeader />
      <main>{children}</main>
      <LandingFooter />
    </div>
  );
}
