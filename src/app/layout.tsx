import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getUserById } from "@/lib/actions/user.action";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId: userId || "" });
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
              <Providers initialUser={JSON.parse(JSON.stringify(mongoUser))}>
                {children}
              </Providers>
            </ThemeProvider>
          </div>
          <ToastContainer autoClose={1500}></ToastContainer>
        </body>
      </html>
    </ClerkProvider>
  );
}
