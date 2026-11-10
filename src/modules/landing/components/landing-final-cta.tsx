import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { SignedOut } from "@clerk/nextjs";
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import {
  FACEBOOK_SUPPORT_URL,
  LANDING_CONTAINER_CLASS_NAME,
} from "../constants";
import { getFinalCtaMutedTitle } from "../utils";
import { CtaDotGrid } from "./cta-dot-grid";

interface LandingFinalCtaProps {
  freeCourseCount: number;
}

/** Cuối trang: card mời bắt đầu học có quầng sáng, cạnh card hỏi thêm */
export function LandingFinalCta({ freeCourseCount }: LandingFinalCtaProps) {
  return (
    <section
      className={cn(
        LANDING_CONTAINER_CLASS_NAME,
        "reveal-on-scroll grid gap-4 pb-20 sm:pb-28 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
      )}
    >
      <div className="relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-3xl border border-border bg-surface p-8 sm:p-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_bottom_right,black_20%,transparent_75%)]"
        >
          <CtaDotGrid />
        </div>
        <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Bắt đầu học hôm nay.{" "}
          <span className="block text-muted">
            {getFinalCtaMutedTitle(freeCourseCount)}
          </span>
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="primary" size="lg" className="rounded-full">
            <Link href="/explore">
              Xem các khóa học
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <SignedOut>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link href="/sign-up">Tạo tài khoản</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-surface p-8">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessageCircle className="size-5" />
        </span>
        <h3 className="text-xl font-semibold text-foreground">Còn thắc mắc?</h3>
        <p className="text-pretty text-sm leading-6 text-muted">
          Chưa biết nên học khóa nào, hay cần hỏi về đơn hàng, cứ nhắn trực tiếp
          cho evondev.
        </p>
        <Button asChild variant="outline" className="mt-auto rounded-full">
          <a href={FACEBOOK_SUPPORT_URL} target="_blank" rel="noreferrer">
            Nhắn qua Facebook
            <ArrowUpRight className="size-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}
