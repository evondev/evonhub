import { Button } from "@/components/ui/button";
import { CourseItemData } from "@/modules/course/types";
import { cn } from "@/shared/utils";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  HERO_DESCRIPTION,
  NEON_GHOST_BUTTON_CLASS_NAME,
  NEON_PRIMARY_BUTTON_CLASS_NAME,
} from "../constants";
import { buildHeroHighlights } from "../utils";
import { HeroTitle } from "./hero-title";

interface HeroIntroProps {
  newestCourse?: CourseItemData;
  freeCourseCount: number;
}

/** Phần chữ của hero: viên Mới, tiêu đề, mô tả, hai nút, các điểm nổi bật */
export function HeroIntro({ newestCourse, freeCourseCount }: HeroIntroProps) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
      {newestCourse && (
        <Link
          href={`/course/${newestCourse.slug}`}
          className="border-beam mb-8 inline-flex max-w-full items-center gap-2 rounded-full bg-surface/60 px-3 py-1.5 text-sm text-foreground ring-1 ring-inset ring-border-strong backdrop-blur-md transition-colors hover:bg-surface motion-safe:animate-hero-rise"
        >
          <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            Mới
          </span>
          <span className="truncate">{newestCourse.title}</span>
          <ChevronRight className="size-4 shrink-0 text-muted" />
        </Link>
      )}
      <HeroTitle />
      <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-muted motion-safe:animate-hero-rise motion-safe:[animation-delay:400ms] sm:text-lg sm:leading-8">
        {HERO_DESCRIPTION}
      </p>
      <div className="mt-8 flex w-full flex-col justify-center gap-3 motion-safe:animate-hero-rise motion-safe:[animation-delay:500ms] sm:w-auto sm:flex-row">
        <Button
          asChild
          className={cn("shrink-0", NEON_PRIMARY_BUTTON_CLASS_NAME)}
        >
          <Link href="/explore">
            Xem các khóa học
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button
          asChild
          className={cn("shrink-0", NEON_GHOST_BUTTON_CLASS_NAME)}
        >
          <Link href="/videos">Xem video miễn phí</Link>
        </Button>
      </div>
      <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted motion-safe:animate-hero-rise motion-safe:[animation-delay:600ms]">
        {buildHeroHighlights(freeCourseCount).map((highlight) => (
          <li key={highlight} className="flex items-center gap-1.5">
            <Check className="size-4 shrink-0 text-violet-300" />
            {highlight}
          </li>
        ))}
      </ul>
    </div>
  );
}
