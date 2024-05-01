import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EvonHub",
  description:
    "EvonHub is a platform for developers to learn, share, and grow together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${manrope.className}`}>
          <div className="wrapper relative">{children}</div>
          <ToastContainer autoClose={1500}></ToastContainer>
        </body>
      </html>
    </ClerkProvider>
  );
}
