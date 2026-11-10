import { Button } from "@/components/ui/button";
import { commonPath } from "@/constants";
import { ProductLogo } from "@/shared/components/product-logo";
import { DASHBOARD_PATH } from "@/shared/constants/common.constants";
import { cn } from "@/shared/utils";
import { ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import {
  LANDING_CONTAINER_CLASS_NAME,
  landingNavLinks,
  NEON_BUTTON_SMALL_CLASS_NAME,
  NEON_PRIMARY_BUTTON_CLASS_NAME,
} from "../constants";

/**
 * Header của landing. Nút bên phải đổi theo trạng thái đăng nhập ngay ở client
 * (SignedIn / SignedOut), để trang vẫn tạo tĩnh được, không phải gọi auth().
 * Landing luôn nền tối nên không có nút đổi giao diện
 */
export function LandingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.08] bg-surface/70 backdrop-blur-xl">
      <div
        className={cn(
          LANDING_CONTAINER_CLASS_NAME,
          "flex h-16 items-center justify-between gap-6",
        )}
      >
        <Link
          href="/"
          aria-label="EvonHub, về trang chủ"
          className="flex shrink-0 items-center gap-2.5"
        >
          <ProductLogo />
          <span className="text-base font-semibold text-foreground">
            EvonHub
          </span>
        </Link>
        <nav
          aria-label="Điều hướng chính"
          className="hidden items-center gap-7 lg:flex"
        >
          {landingNavLinks.map((navLink) => (
            <Link
              key={navLink.url}
              href={navLink.url}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {navLink.title}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          {/* Giữ chỗ lúc Clerk chưa biết đăng nhập hay chưa, header khỏi nhảy */}
          <ClerkLoading>
            <span aria-hidden="true" className="h-9 w-24" />
          </ClerkLoading>
          <SignedOut>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden rounded-full text-muted hover:bg-white/[0.06] hover:text-foreground sm:inline-flex"
            >
              <Link href={commonPath.LOGIN}>Đăng nhập</Link>
            </Button>
            <Button
              asChild
              className={cn(
                NEON_PRIMARY_BUTTON_CLASS_NAME,
                NEON_BUTTON_SMALL_CLASS_NAME,
              )}
            >
              <Link href="/sign-up">Đăng ký</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button
              asChild
              className={cn(
                NEON_PRIMARY_BUTTON_CLASS_NAME,
                NEON_BUTTON_SMALL_CLASS_NAME,
              )}
            >
              <Link href={DASHBOARD_PATH}>Vào học</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
