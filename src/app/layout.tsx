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
  title: "EvonHub",
  description:
    "EvonHub is a platform for developers to learn, share, and grow together.",
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
