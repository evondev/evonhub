import { Button } from "@/components/ui/button";
import { CatalogStats, CourseItemData } from "@/modules/course/types";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { HERO_DESCRIPTION, LANDING_CONTAINER_CLASS_NAME } from "../constants";
import { buildHeroHighlights } from "../utils";
import { HeroBackground } from "./hero-background";
import { HeroShowcase } from "./hero-showcase";
import { HeroTitle } from "./hero-title";

interface LandingHeroProps {
  /** Khóa mới nhất, báo ở viên "Mới" trên tiêu đề */
  newestCourse?: CourseItemData;
  stats: CatalogStats;
}

export function LandingHero({ newestCourse, stats }: LandingHeroProps) {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-14 sm:pb-20 sm:pt-24">
      <HeroBackground />
      <div className={LANDING_CONTAINER_CLASS_NAME}>
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          {newestCourse && (
            <Link
              href={`/course/${newestCourse.slug}`}
              className="mb-8 inline-flex max-w-full items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-button-hover motion-safe:animate-hero-rise"
            >
              <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                Mới
              </span>
              <span className="truncate motion-safe:text-shine motion-safe:animate-shine">
                {newestCourse.title}
              </span>
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
              variant="primary"
              size="lg"
              className="shrink-0 whitespace-nowrap rounded-full"
            >
              <Link href="/explore">
                Xem các khóa học
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="shrink-0 whitespace-nowrap rounded-full"
            >
              <Link href="/videos">Xem video miễn phí</Link>
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted motion-safe:animate-hero-rise motion-safe:[animation-delay:600ms]">
            {buildHeroHighlights(stats.freeCourseCount).map((highlight) => (
              <li key={highlight} className="flex items-center gap-1.5">
                <Check className="size-4 shrink-0 text-primary" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
        <HeroShowcase stats={stats} />
      </div>
    </section>
  );
}
