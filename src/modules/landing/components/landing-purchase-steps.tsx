import { cn } from "@/shared/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  LANDING_CONTAINER_CLASS_NAME,
  LANDING_SECTION_CLASS_NAME,
  purchaseSteps,
} from "../constants";
import { LandingSectionHeading } from "./landing-section-heading";

/** Ba bước đăng ký học, đánh số; nói rõ khóa miễn phí và khóa trả phí */
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
      <ol className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-3">
        {purchaseSteps.map((step, index) => (
          <li
            key={step.title}
            className="reveal-on-scroll flex flex-col gap-3 rounded-3xl border border-border bg-surface p-6 sm:p-8"
          >
            <span className="flex size-10 items-center justify-center rounded-full border border-border-strong font-display text-sm font-semibold tabular-nums text-primary">
              {index + 1}
            </span>
            <h3 className="mt-2 text-base font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="text-pretty text-sm leading-6 text-muted">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex justify-center">
        <Link
          href="/how-to-buy"
          className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-primary hover:underline"
        >
          Hướng dẫn mua khóa trả phí, có ảnh
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
