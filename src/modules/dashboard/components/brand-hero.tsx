import { Button } from "@/components/ui/button";
import { Route } from "lucide-react";
import Link from "next/link";
import { HeroStatItem } from "../types";
import { HeroCodeCard } from "./hero-code-card";

interface BrandHeroProps {
  /** Không truyền là khách; có (kể cả chuỗi rỗng) là người đã đăng nhập */
  firstName?: string;
  statItems: HeroStatItem[];
  hasRoadmap: boolean;
  hasCourses: boolean;
}

export function BrandHero({
  firstName,
  statItems,
  hasRoadmap,
  hasCourses,
}: BrandHeroProps) {
  return (
    <section className="grid gap-8 rounded-2xl bg-brand-band bg-gradient-to-br from-brand-band to-brand-band-end p-5 text-white sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-center [&_a:focus-visible]:outline-white">
      <div className="flex min-w-0 flex-col gap-6">
        <div>
          {firstName && <p className="text-sm font-medium">Chào {firstName}</p>}
          <h2 className="mt-1 text-balance text-3xl font-bold sm:text-4xl">
            AI viết code giúp bạn.
            <br />
            Nhưng hậu quả thì bạn chịu.
          </h2>
          <p className="mt-3 max-w-[56ch] text-pretty text-sm sm:text-base">
            Học cách đưa sản phẩm của chính mình lên production, và biết nó sẽ
            lủng ở đâu trước khi người dùng tìm ra.
          </p>
          {hasCourses && (
            <div className="mt-5 flex flex-wrap gap-2">
              {hasRoadmap && (
                <Button
                  asChild
                  className="bg-surface text-foreground hover:bg-surface/85 dark:hover:bg-surface/70"
                >
                  <Link href="#lo-trinh">
                    <Route className="size-4 shrink-0" />
                    Bắt đầu lộ trình
                  </Link>
                </Button>
              )}
              <Button
                asChild
                className="text-white ring-1 ring-inset ring-white/40 hover:bg-white/15"
              >
                <Link href="/explore">Xem tất cả khóa học</Link>
              </Button>
            </div>
          )}
        </div>
        {statItems.length > 0 && (
          <dl className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4">
            {statItems.map((statItem) => (
              <div key={statItem.label} className="min-w-0">
                <dt className="sr-only">{statItem.label}</dt>
                <dd className="whitespace-nowrap text-lg font-bold tabular-nums sm:text-xl">
                  {statItem.value}
                </dd>
                <dd className="text-balance text-xs text-white">
                  {statItem.label}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <HeroCodeCard />
    </section>
  );
}
