import { LandingPage } from "@/modules/landing/pages/landing-page";

// Trang tĩnh, làm mới số liệu mỗi giờ: không phụ thuộc người đang xem
export const revalidate = 3600;

export default function HomePage() {
  return <LandingPage />;
}
