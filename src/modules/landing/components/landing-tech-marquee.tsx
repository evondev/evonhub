import { cn } from "@/shared/utils";
import { LANDING_CONTAINER_CLASS_NAME, techStackItems } from "../constants";

// Hai bản giống nhau nối đuôi: trôi hết một bản là quay về đầu, không giật
const MARQUEE_COPY_INDEXES: number[] = [0, 1];

/** Dải công nghệ của các khóa chạy ngang, mờ hai mép; rê chuột vào thì dừng */
export function LandingTechMarquee() {
  return (
    <section
      aria-label="Công nghệ trong các khóa học"
      className={cn(LANDING_CONTAINER_CLASS_NAME, "pb-16")}
    >
      <p className="text-center text-sm text-muted">
        Các khóa học xoay quanh những công nghệ đang dùng ngoài kia
      </p>
      <div className="group mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee [animation-duration:40s] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {MARQUEE_COPY_INDEXES.map((copyIndex) => (
            <ul
              key={copyIndex}
              aria-hidden={copyIndex > 0}
              className="flex shrink-0 gap-3 pr-3"
            >
              {techStackItems.map((techName) => (
                <li
                  key={techName}
                  className="whitespace-nowrap rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-foreground"
                >
                  {techName}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
