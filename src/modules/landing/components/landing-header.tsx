import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { commonPath } from "@/constants";
import { ProductLogo } from "@/shared/components/product-logo";
import { DASHBOARD_PATH } from "@/shared/constants/common.constants";
import { ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { landingNavLinks } from "../constants";

/**
 * Header của landing. Nút bên phải đổi theo trạng thái đăng nhập ngay ở client
 * (SignedIn / SignedOut), để trang vẫn tạo tĩnh được, không phải gọi auth()
 */
export function LandingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
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
          <ModeToggle className="rounded-full" />
          {/* Giữ chỗ lúc Clerk chưa biết đăng nhập hay chưa, header khỏi nhảy */}
          <ClerkLoading>
            <span aria-hidden="true" className="h-9 w-24" />
          </ClerkLoading>
          <SignedOut>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden rounded-full sm:inline-flex"
            >
              <Link href={commonPath.LOGIN}>Đăng nhập</Link>
            </Button>
            <Button
              asChild
              variant="primary"
              size="sm"
              className="rounded-full"
            >
              <Link href="/sign-up">Đăng ký</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button
              asChild
              variant="primary"
              size="sm"
              className="rounded-full"
            >
              <Link href={DASHBOARD_PATH}>Vào học</Link>
            </Button>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
