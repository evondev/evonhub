"use client";

import { COURSE_CURRICULUM_SECTION_ID } from "@/modules/course/constants";
import { useCoursePurchase } from "@/modules/course/hooks/use-course-purchase";
import { useIsElementPassed } from "@/modules/course/hooks/use-is-element-passed";
import type { CourseItemData } from "@/modules/course/types";
import {
  getAverageRating,
  getCurriculumStats,
  getTrialChapterValues,
  isCourseFree,
} from "@/modules/course/utils";
import type { RatingItemData } from "@/modules/rating/types";
import { CourseStatus } from "@/shared/constants/course.constants";
import { LessonDetailsOutlineData } from "@/shared/types";
import { useRef, useState } from "react";
import CourseBuyBar from "./course-buy-bar";
import CourseBuyCard from "./course-buy-card";
import CourseCurriculum from "./course-curriculum";
import CourseDetailsHeader from "./course-details-header";
import CourseLearningOutcomes from "./course-learning-outcomes";
import CourseListItem from "./course-list-item";
import CourseQa from "./course-qa";
import CourseReviews from "./course-reviews";
import CourseSection from "./course-section";

export interface CourseDetailsViewProps {
  course: CourseItemData;
  lectures: LessonDetailsOutlineData[];
  reviews: RatingItemData[];
  isOwned: boolean;
}

/**
 * Hai cột từ xl: bên trái đầu trang và các khối nội dung, bên phải thẻ mua dính
 * khi cuộn. Màn hẹp một cột (đầu trang → thẻ mua → nội dung), thêm thanh mua
 * dưới màn khi nút mua trong thẻ đã cuộn qua.
 */
export default function CourseDetailsView({
  course,
  lectures,
  reviews,
  isOwned,
}: CourseDetailsViewProps) {
  const { _id, title, slug, price, salePrice, free, info, cta, status } =
    course;
  const courseId = _id.toString();
  const purchase = useCoursePurchase({ courseId, slug, price });
  const buyActionsRef = useRef<HTMLDivElement>(null);
  const isBuyActionsPassed = useIsElementPassed(buyActionsRef);
  const [openChapters, setOpenChapters] = useState<string[]>([]);

  const stats = getCurriculumStats(lectures);
  const ratingAverage = getAverageRating(
    reviews.map((review) => review.rating),
  );
  const firstLessonId = lectures[0]?.lessons?.[0]?._id || "";
  const buyButtonProps = {
    purchase,
    isFree: isCourseFree({ price, free }),
    isComingSoon: status === CourseStatus.Pending,
    isOwned,
    cta,
    firstLessonHref: `/${slug}/lesson?id=${firstLessonId}`,
  };

  // "Học thử N bài": mở các chương có bài học thử rồi cuộn tới khối nội dung
  function handleTrialClick() {
    setOpenChapters(getTrialChapterValues(lectures));
    document
      .getElementById(COURSE_CURRICULUM_SECTION_ID)
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    // .wrapper đã chừa 64px đáy cho thanh điều hướng (ẩn ở trang này); thêm 16px
    // cho đủ chiều cao thanh mua (68px) để nó không che khối cuối
    <div className="pb-4 lg:pb-0">
      <div className="grid grid-cols-1 gap-6 [grid-template-areas:'head'_'card'_'body'] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-x-8 xl:[grid-template-areas:'head_card'_'body_card']">
        <div className="[grid-area:head]">
          <CourseDetailsHeader
            title={title}
            ratingAverage={ratingAverage}
            ratingCount={reviews.length}
            level={course.level}
            stats={stats}
          />
        </div>
        {/* Header nổi cao 80px: dính ở 96px để thẻ cách header 16px như khe sidebar */}
        <aside className="self-start [grid-area:card] xl:sticky xl:top-24">
          <CourseBuyCard
            ref={buyActionsRef}
            {...buyButtonProps}
            title={title}
            intro={course.intro}
            image={course.image}
            price={price}
            salePrice={salePrice}
            stats={stats}
            onTrialClick={handleTrialClick}
          />
        </aside>
        <div className="flex min-w-0 flex-col gap-8 [grid-area:body]">
          <CourseLearningOutcomes items={info.gained} />
          <CourseCurriculum
            lectures={lectures}
            stats={stats}
            courseSlug={slug}
            isOwned={isOwned}
            openChapters={openChapters}
            onOpenChaptersChange={setOpenChapters}
          />
          {info.requirements.length > 0 && (
            <CourseSection title="Yêu cầu">
              <ul className="flex flex-col gap-2 text-sm/6 text-foreground/80">
                {info.requirements.map((requirement) => (
                  <CourseListItem key={requirement} title={requirement} />
                ))}
              </ul>
            </CourseSection>
          )}
          {course.desc && (
            <CourseSection title="Mô tả">
              {/* lesson-content (globals.scss) giữ kiểu danh sách, code trong mô tả, nhưng ép
                  17px đậm 500 cho trang học; ở đây về cỡ chữ nội dung như các khối khác */}
              <div
                className="lesson-content max-w-[70ch] !text-sm/7 !font-normal text-foreground/80 [&>*:last-child]:mb-0 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: course.desc }}
              />
            </CourseSection>
          )}
          <CourseReviews reviews={reviews} ratingAverage={ratingAverage} />
          <CourseQa items={info.qa} />
        </div>
      </div>
      <CourseBuyBar
        {...buyButtonProps}
        price={price}
        salePrice={salePrice}
        isVisible={isBuyActionsPassed}
      />
    </div>
  );
}
