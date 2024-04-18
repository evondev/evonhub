import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={`${manrope.className} relative`}>
        <main className="grid grid-cols-[300px,minmax(0,1fr)] min-h-screen">
          <Sidebar></Sidebar>
          <section className="px-10 pb-10">
            <Header></Header>
            {children}
          </section>
        </main>
      </body>
    </html>
  );
}
