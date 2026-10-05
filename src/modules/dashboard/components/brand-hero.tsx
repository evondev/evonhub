import { Button } from "@/components/ui/button";
import { formatRating } from "@/modules/course/utils";
import { cn } from "@/shared/utils";
import { Route } from "lucide-react";
import Link from "next/link";
import { CatalogStats } from "../types";
import { formatCompactCount } from "../utils";

interface BrandHeroProps {
  /** Không truyền là khách; có (kể cả chuỗi rỗng) là người đã đăng nhập */
  firstName?: string;
  stats: CatalogStats;
}

export function BrandHero({ firstName, stats }: BrandHeroProps) {
  const statItems = [
    { value: String(stats.courseCount), label: "khóa học thực chiến" },
    { value: formatCompactCount(stats.totalViews), label: "lượt xem bài học" },
    {
      value: `${formatRating(stats.averageRating)} / 5`,
      label: `từ ${stats.ratingCount} đánh giá`,
      isHidden: stats.ratingCount === 0,
    },
  ].filter((statItem) => !statItem.isHidden);

  return (
    <section className="grid gap-6 rounded-2xl bg-brand-band bg-gradient-to-br from-brand-band to-brand-band-end p-6 text-white sm:p-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
      <div className="min-w-0">
        {firstName && (
          <p className="text-sm font-medium text-white">Chào {firstName}</p>
        )}
        <h2 className="mt-1 max-w-[22ch] text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          AI viết code giúp bạn. Nhưng hậu quả thì bạn chịu.
        </h2>
        <p className="mt-3 max-w-[56ch] text-pretty text-sm text-white sm:text-base">
          Học cách đưa sản phẩm của chính mình lên production, và biết nó sẽ
          lủng ở đâu trước khi người dùng tìm ra.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            asChild
            className="bg-surface text-foreground hover:bg-surface/85 dark:hover:bg-surface/70"
          >
            <Link href="#lo-trinh">
              <Route className="size-4 shrink-0" />
              Bắt đầu với lộ trình
            </Link>
          </Button>
          <Button
            asChild
            className="text-white ring-1 ring-inset ring-white/40 hover:bg-white/15"
          >
            <Link href="/explore">Xem tất cả khóa học</Link>
          </Button>
        </div>
      </div>
      {statItems.length > 0 && (
        <dl
          className={cn(
            "grid gap-px overflow-hidden rounded-xl bg-white/20 lg:grid-cols-1",
            statItems.length === 3 && "grid-cols-3",
            statItems.length === 2 && "grid-cols-2",
          )}
        >
          {statItems.map((statItem) => (
            <div
              key={statItem.label}
              className="min-w-0 bg-brand-band-end px-3 py-3 sm:px-4"
            >
              <dt className="sr-only">{statItem.label}</dt>
              <dd className="whitespace-nowrap text-base font-semibold tabular-nums sm:text-xl">
                {statItem.value}
              </dd>
              <dd className="text-xs text-white">{statItem.label}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
