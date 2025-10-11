"use client";

import PageNotFound from "@/app/not-found";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserContext } from "@/components/user-context";
import { useQueryCourseBySlug } from "@/modules/course/services";
import { useQueryLessonDetailsOutline } from "@/modules/lesson/services";
import { useQueryRatingsByCourse } from "@/modules/rating/services";
import { CourseOutline } from "@/shared/components/course";
import { CourseStatus } from "@/shared/constants/course.constants";
import { handleCheckMembership } from "@/shared/utils";
import Image from "next/image";
import { useParams } from "next/navigation";
import AlreadyEnroll from "./already-enroll";
import { CourseDetailsLoading } from "./course-details.loading";
import CourseListItem from "./course-list-item";
import CourseSection from "./course-section";
import CourseWidget from "./course-widget";

export interface CourseDetailsPageContainerProps {}

export function CourseDetailsPageContainer(
  _props: CourseDetailsPageContainerProps
) {
  const params = useParams();
  const { data: courseDetails, isFetching: isFetchingCourse } =
    useQueryCourseBySlug({
      courseSlug: params.slug.toString(),
    });
  const { data: ratings } = useQueryRatingsByCourse({
    courseId: courseDetails?._id.toString() || "",
  });
  const { data: lectures } = useQueryLessonDetailsOutline({
    slug: params.slug.toString(),
  });
  const { userInfo } = useUserContext();
  const isMembershipAlready = handleCheckMembership({
    isMembership: userInfo?.isMembership,
    endDate: userInfo?.planEndDate || new Date().toISOString(),
  });
  if (isFetchingCourse) return <CourseDetailsLoading />;
  if (!courseDetails?._id) return <PageNotFound />;
  const {
    intro,
    image,
    title,
    price,
    free,
    desc,
    info,
    salePrice,
    slug,
    cta,
    status,
  } = courseDetails;

  const embed = intro?.includes("v=")
    ? intro?.split("v=")[1]?.split("&")[0]
    : intro?.split("/").at(-1);

  const isAlreadyEnroll = userInfo?.courses.includes(courseDetails._id);
  const isFree = price === 0 || free;
  const isComingSoon = status === CourseStatus.Pending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr),400px] gap-8 items-start relative">
      <div>
        <div className="aspect-video relative mb-4 lg:mb-8">
          {intro ? (
            <>
              <iframe
                src={`https://www.youtube.com/embed/${embed}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full object-cover rounded-xl aspect-video"
              ></iframe>
            </>
          ) : (
            <Image
              alt={title}
              width={1200}
              height={720}
              src={image}
              className="w-full h-full object-cover rounded-xl"
              priority
            />
          )}
        </div>
        <h1 className="font-extrabold text-xl lg:text-3xl mb-4 !leading-normal">
          {title}
        </h1>
        {ratings && ratings.length > 0 && (
          <>
            <div className="flex flex-wrap mb-10 [&>*:not(:last-child)]:-mr-2">
              <TooltipProvider>
                {ratings.map((el, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger>
                      <div className="rounded-full text-sm font-medium flex items-center gap-2 border borderDarkMode bgDarkMode text-left">
                        <img
                          width={40}
                          height={40}
                          src={el.user.avatar}
                          alt=""
                          className="size-8 p-0.5 object-cover rounded-full flex-shrink-0"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm text-xs text-left">
                      {el.content}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </>
        )}
        <div className="flex flex-col gap-8">
          <CourseSection title="Mô tả">
            <div dangerouslySetInnerHTML={{ __html: desc }}></div>
          </CourseSection>
          <CourseSection title="Nội dung">
            <CourseOutline
              lectures={lectures || []}
              courseId={courseDetails._id}
              courseSlug={slug}
              isExpandedAll
            />
          </CourseSection>
          <CourseSection title="Yêu cầu">
            {info.requirements.length > 0 &&
              info.requirements.map((item, index) => (
                <CourseListItem key={index} title={item} />
              ))}
          </CourseSection>
          <CourseSection title="Lợi ích">
            {info.gained.length > 0 &&
              info.gained.map((item, index) => (
                <CourseListItem key={index} title={item} />
              ))}
          </CourseSection>
          <CourseSection title="Q/A">
            {info.qa.length > 0 && (
              <div className="flex flex-col gap-3">
                {info.qa.map((item, index) => (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    key={item.question}
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="font-bold mb-2">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="font-medium bg-white rounded-xl dark:bg-grayDarker  dark:text-text5 text-sm">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            )}
          </CourseSection>
        </div>
      </div>
      <div className="flex flex-col gap-5 sticky top-5 xl:top-[104px] right-0">
        {isAlreadyEnroll || isMembershipAlready ? (
          <AlreadyEnroll
            course={slug}
            lesson={lectures?.[0]?.lessons?.[0]?._id || ""}
          ></AlreadyEnroll>
        ) : (
          <CourseWidget
            price={price}
            salePrice={salePrice}
            isFree={isFree}
            cta={cta}
            isComingSoon={isComingSoon}
            slug={slug}
            courseId={courseDetails._id.toString()}
          />
        )}
      </div>
    </div>
  );
}
