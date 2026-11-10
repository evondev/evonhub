import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { SignedOut } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  FACEBOOK_SUPPORT_URL,
  LANDING_CONTAINER_CLASS_NAME,
  NEON_GHOST_BUTTON_CLASS_NAME,
  NEON_PRIMARY_BUTTON_CLASS_NAME,
} from "../constants";
import { getFinalCtaMutedTitle } from "../utils";
import { CtaPixelGrid } from "./cta-pixel-grid";

interface LandingFinalCtaProps {
  freeCourseCount: number;
}

/**
 * Cuối trang: khối lớn giữa trang trên lưới ô vuông, đáy hắt sáng tím lên dần
 * tới mép dưới gần như trắng, không viền
 */
export function LandingFinalCta({ freeCourseCount }: LandingFinalCtaProps) {
  return (
    <section className={cn(LANDING_CONTAINER_CLASS_NAME, "pb-20 sm:pb-28")}>
      <div className="reveal-on-scroll relative isolate flex flex-col items-center overflow-hidden rounded-[2rem] px-6 pb-40 pt-20 text-center shadow-[inset_0_-90px_120px_-50px_rgb(167_139_250/0.55)] sm:px-12 sm:pb-48 sm:pt-28">
        <CtaPixelGrid />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[radial-gradient(ellipse_90%_100%_at_50%_100%,rgb(124_58_237/0.55),rgb(91_33_182/0.18)_45%,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-violet-100/60 via-violet-400/20 to-transparent"
        />
        <h2 className="max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            Bắt đầu học hôm nay.
          </span>{" "}
          <span className="block text-muted">
            {getFinalCtaMutedTitle(freeCourseCount)}
          </span>
        </h2>
        <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button
            asChild
            className={cn(NEON_PRIMARY_BUTTON_CLASS_NAME, "shrink-0")}
          >
            <Link href="/explore">
              Xem các khóa học
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <SignedOut>
            <Button
              asChild
              className={cn(NEON_GHOST_BUTTON_CLASS_NAME, "shrink-0")}
            >
              <Link href="/sign-up">Tạo tài khoản</Link>
            </Button>
          </SignedOut>
        </div>
        <p className="mt-6 text-sm text-muted">
          Còn thắc mắc?{" "}
          <a
            href={FACEBOOK_SUPPORT_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-violet-300 hover:underline"
          >
            Nhắn evondev qua Facebook
          </a>
        </p>
      </div>
    </section>
  );
}
