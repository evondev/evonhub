import { cn } from "@/shared/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  LANDING_CONTAINER_CLASS_NAME,
  LANDING_SECTION_CLASS_NAME,
  purchaseSteps,
} from "../constants";
import { LandingSectionHeading } from "./landing-section-heading";

/**
 * Ba bước đăng ký học trên một đường nối có tia sáng chạy qua (từ md). Nói rõ
 * khóa miễn phí và khóa trả phí
 */
export function LandingPurchaseSteps() {
  return (
    <section
      className={cn(LANDING_SECTION_CLASS_NAME, LANDING_CONTAINER_CLASS_NAME)}
    >
      <LandingSectionHeading
        eyebrow="Đăng ký học"
        title="Ba bước là vào học."
        mutedTitle="Khóa miễn phí không cần chuyển khoản."
        isCentered
      />
      <div className="relative mt-12 sm:mt-16">
        {/* Đường nối tâm vòng số đầu tới tâm vòng số cuối (mỗi cột rộng 1/3) */}
        <div
          aria-hidden="true"
          className="absolute left-[16.67%] right-[16.67%] top-6 hidden h-px overflow-hidden bg-white/10 md:block"
        >
          <div className="h-full w-1/4 bg-gradient-to-r from-transparent via-violet-300 to-transparent motion-safe:animate-beam-travel motion-reduce:hidden" />
        </div>
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {purchaseSteps.map((step, index) => (
            <li
              key={step.title}
              className="reveal-on-scroll relative flex flex-col items-center gap-3 text-center"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-surface font-mono text-sm font-semibold tabular-nums text-violet-200 shadow-[0_0_28px_-4px_rgb(139_92_246/0.8)] ring-1 ring-inset ring-violet-400/50">
                {index + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="max-w-xs text-pretty text-sm leading-6 text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-12 flex justify-center">
        <Link
          href="/how-to-buy"
          className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-violet-300 hover:underline"
        >
          Hướng dẫn mua khóa trả phí, có ảnh
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
