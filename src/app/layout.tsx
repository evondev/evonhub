import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserProvider } from "@/components/user-context";
import { ReactQueryProvider } from "@/shared/libs";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "prismjs/themes/prism.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";

// Be Vietnam Pro không có bản variable nên phải khai đủ các độ đậm đang dùng.
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

// Font cho heading lớn (dùng qua class font-display). Bản variable có trục opsz
// nên chữ cỡ to tự gọn nét hơn, có subset tiếng Việt.
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://evonhub.dev"),
  title: "EvonHub - Nền tảng học lập trình trực tuyến",
  description:
    "Nền tảng học lập trình trực tuyến với các khóa học từ cơ bản đến nâng cao về Frontend dành cho người mới bắt đầu và người đã có kinh nghiệm. Được phát triển và xây dựng bởi Evondev.",
  keywords:
    "evonhub, evondev, học lập trình, khóa học lập trình, frontend, khóa học frontend, khóa học html css, khóa học javascript, khóa học reactjs, khóa học nextjs, khóa học html, khóa học css, khóa học figma, khóa học ui ux",
  applicationName: "EvonHub",
  openGraph: {
    title: "EvonHub - Nền tảng học lập trình trực tuyến",
    description:
      "Nền tảng học lập trình trực tuyến với các khóa học từ cơ bản đến nâng cao về Frontend dành cho người mới bắt đầu và người đã có kinh nghiệm. Được phát triển và xây dựng bởi Evondev.",
    images: ["/seo-cover.jpg"],
  },
  other: {
    "google-site-verification": "jVBTbT71E76dExUgIo5fpClsPpHqU47POlZ4EUuB2rM",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${beVietnamPro.className} ${bricolageGrotesque.variable}`}
        >
          <div className="wrapper relative">
            <ReactQueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem={false}
                disableTransitionOnChange
              >
                <Providers>
                  <UserProvider>
                    <NuqsAdapter>{children}</NuqsAdapter>
                  </UserProvider>
                </Providers>
              </ThemeProvider>
            </ReactQueryProvider>
          </div>
          <ToastContainer
            autoClose={4000}
            position="top-right"
            className="min-w-[350px] max-w-full top-0 right-0"
            bodyClassName={`${beVietnamPro.className} font-semibold`}
          ></ToastContainer>
          <Script
            id="mux-uploader"
            src="https://cdn.jsdelivr.net/npm/@mux/mux-uploader@1.0.0-beta.6"
          ></Script>
          <SpeedInsights></SpeedInsights>
          <Analytics></Analytics>
        </body>
      </html>
    </ClerkProvider>
  );
}
