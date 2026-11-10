import { HowToBuyPage } from "@/modules/order/pages/how-to-buy";
import { Metadata } from "next";

const HOW_TO_BUY_TITLE = "Hướng dẫn mua khóa học tại Evonhub";

const HOW_TO_BUY_DESCRIPTION =
  "Bốn bước mua khóa học tại Evonhub: chọn khóa, tạo đơn, chuyển khoản theo mã đơn và vào học.";

export const metadata: Metadata = {
  title: HOW_TO_BUY_TITLE,
  description: HOW_TO_BUY_DESCRIPTION,
  keywords:
    "evonhub, hướng dẫn mua khóa học tại evonhub, khóa học frontend, khóa học evonhub",
  openGraph: {
    title: HOW_TO_BUY_TITLE,
    description: HOW_TO_BUY_DESCRIPTION,
    images: ["/seo-cover.jpg"],
  },
};

export default function HowToBuyPageRoot() {
  return <HowToBuyPage />;
}
