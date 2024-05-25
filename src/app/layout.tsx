import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";

const manrope = Manrope({ subsets: ["latin"] });

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
    images: ["/cover.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${manrope.className}`}>
          <div className="wrapper relative">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Providers>{children}</Providers>
            </ThemeProvider>
          </div>
          <ToastContainer autoClose={1500}></ToastContainer>
          <Script
            id="mux-uploader"
            src="https://cdn.jsdelivr.net/npm/@mux/mux-uploader@1.0.0-beta.6"
          ></Script>
          <SpeedInsights></SpeedInsights>
        </body>
      </html>
    </ClerkProvider>
  );
}
