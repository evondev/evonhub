import { CourseItemData } from "@/modules/course/types";
import { LANDING_CONTAINER_CLASS_NAME } from "../constants";
import { HeroIntro } from "./hero-intro";
import { NeonBackdrop } from "./neon-backdrop";
import { HeroEditorStage } from "./hero-editor-stage";

interface LandingHeroProps {
  /** Khóa mới nhất, báo ở viên "Mới" trên tiêu đề */
  newestCourse?: CourseItemData;
  freeCourseCount: number;
}

/**
 * Hero nền tối: Aurora, chữ, rồi editor diễn cảnh "AI gõ, bạn soát, bạn sửa"
 * dưới tia laser tím rọi xuống, viền có vệt sáng chạy vòng. Đáy section mờ
 * dần (mask) để ánh laser tan vào nền, không cắt thành một đường ngang
 */
export function LandingHero({
  newestCourse,
  freeCourseCount,
}: LandingHeroProps) {
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-14 [mask-image:linear-gradient(to_bottom,black_calc(100%-6rem),transparent)] sm:pb-28 sm:pt-24">
      <NeonBackdrop />
      <div className={LANDING_CONTAINER_CLASS_NAME}>
        <HeroIntro
          newestCourse={newestCourse}
          freeCourseCount={freeCourseCount}
        />
        <div className="relative mx-auto mt-16 max-w-3xl motion-safe:animate-hero-rise motion-safe:[animation-delay:700ms] sm:mt-32">
          <HeroEditorStage />
        </div>
      </div>
    </section>
  );
}
