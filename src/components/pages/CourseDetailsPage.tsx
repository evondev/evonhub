"use client";
import PageNotFound from "@/app/not-found";
import {
  IconClock,
  IconCube,
  IconLevel,
  IconPlay,
  IconStudy,
  IconUser,
  IconVideo,
  IconViews,
} from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { boxDetailClassName, courseLevel, widgetClassName } from "@/constants";
import { ICourse } from "@/database/course.model";
import { getFreeCourse } from "@/lib/actions/course.action";
import { userBuyCourse } from "@/lib/actions/order.action";
import { useGlobalStore } from "@/store";
import { ECourseStatus, Role } from "@/types/enums";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ButtonGradient from "../button/ButtonGradient";

const techStack = [
  "NextJS14",
  "Typescript",
  "TailwindCSS",
  "Shadcn",
  "Clerk",
  "Mongoose",
  "Git",
  "Github",
  "React hook form",
  "Toastify",
  "Uploadthing",
  "Player",
  "TinyMCE",
  "Sweetalert",
  "Zustand",
  "And more...",
];

const CourseDetailsPage = ({
  data,
  lessonCount,
}: {
  data: Omit<ICourse, "lecture"> & {
    _id: string;
    lecture: {
      _id: string;
      title: string;
      lessons: {
        _id: string;
        title: string;
        duration: number;
        order: number;
      }[];
    }[];
  };
  lessonCount: number;
}) => {
  const { userRole, currentUser } = useGlobalStore();
  const userCourses = currentUser?.courses?.map((item: any) => item._id) || [];
  const router = useRouter();
  const handleEnrollFree = async (slug: string) => {
    if (!currentUser?._id) {
      router.push("/sign-in");
      return;
    }
    try {
      const res = await getFreeCourse(slug);
      if (res?.type === "success") {
        toast.success(res?.message);
        return;
      }
      toast.error(res?.message);
    } catch (error) {}
  };
  const handleBuyCourse = async (slug: string) => {
    if (!currentUser?._id) {
      router.push("/sign-in");
      return;
    }
    const res = await userBuyCourse({
      user: currentUser?._id,
      course: data._id,
      amount: data.price,
      total: data.price,
    });
    if (res?.error) {
      toast.error(res?.error);
      return;
    }
    router.push(`/order/${res?.order.code}`);
  };
  if (!data) return <PageNotFound />;
  if (
    data.status !== ECourseStatus.APPROVED &&
    userRole !== Role.ADMIN &&
    userRole !== Role.EXPERT
  )
    return <PageNotFound />;
  const lectures = data?.lecture || [];
  const totalMinutes = lectures.reduce((acc, cur) => {
    return acc + cur.lessons.reduce((acc, cur) => acc + cur.duration, 0);
  }, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMinutesLeft = totalMinutes % 60;
  const embed = data?.intro?.includes("v=")
    ? data?.intro?.split("v=")[1]?.split("&")[0]
    : data?.intro?.split("/").at(-1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr),400px] gap-8 items-start relative">
      <div>
        <div className="aspect-video relative mb-8">
          {data.intro ? (
            <>
              <iframe
                src={`https://www.youtube.com/embed/${embed}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full object-cover rounded-lg aspect-video"
              ></iframe>
            </>
          ) : (
            <Image
              alt=""
              width={1200}
              height={600}
              src={data.image}
              priority
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
        <h1 className="font-bold text-2xl lg:text-3xl mb-8">{data.title}</h1>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-bold">Mô tả</h2>
            <p className="text-slate-700 dark:text-text5 leading-relaxed">
              {data.desc}
            </p>
          </div>
          {data.slug.includes("nextjs") && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold">Công nghệ sử dụng</h2>
              <div className="flex flex-wrap gap-4 text-sm">
                {techStack.map((item, index) => (
                  <div className="flex items-center gap-2" key={item}>
                    <div className="size-5 text-primary">
                      <IconCube />
                    </div>
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-5">
            <h2 className="text-xl font-bold">Chi tiết</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <DetailsItem
                title="Bài học"
                icon={<IconVideo className="size-4" />}
              >
                {lessonCount}
              </DetailsItem>
              <DetailsItem title="Mức độ" icon={<IconLevel />}>
                {courseLevel[data.level]}
              </DetailsItem>
              <DetailsItem title="Tổng thời gian" icon={<IconClock />}>
                {totalHours}h{totalMinutesLeft}p
              </DetailsItem>
              <DetailsItem title="Lượt xem" icon={<IconViews />}>
                {data.views || 0}
              </DetailsItem>
            </div>
          </div>
          {lectures.length > 0 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold">Nội dung</h2>
              {lectures?.map((item, index) => (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  key={item._id}
                >
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-bold dark:text-text5">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="bg-white dark:bg-grayDarker rounded-lg mt-5">
                      {item.lessons.map((lesson, index) => (
                        <div
                          key={lesson._id}
                          className="text-sm mb-5 pb-5 border-b border-dashed last:pb-0 last:mb-0 last:border-b-0 font-medium flex items-center gap-2 dark:text-text5
                        "
                        >
                          <IconPlay />
                          {lesson.title}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}
          <BoxList title="Yêu cầu" data={data.info.requirements}></BoxList>
          <BoxList title="Lợi ích" data={data.info.gained}></BoxList>
          {data.info.qa.length > 0 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold">Q/A</h2>
              <div className="flex flex-col gap-3">
                {data.info.qa.map((item, index) => (
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
                      <AccordionContent className="font-medium bg-white rounded-lg dark:bg-grayDarker  dark:text-text5 text-sm">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-5 sticky top-5 xl:top-[104px] right-0">
        <div className={widgetClassName}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {data.price === 0 || data.free ? (
                <strong className="text-xl text-primary">Miễn phí</strong>
              ) : (
                <>
                  <strong className="text-lg lg:text-xl text-secondary">
                    {formatThoundsand(data.price)} VNĐ
                  </strong>
                  <span className="text-sm line-through text-slate-400">
                    {formatThoundsand(data.salePrice)} VNĐ
                  </span>
                </>
              )}
            </div>
            <span className="inline-block py-1 px-3 rounded-lg bg-secondary bg-opacity-20 text-secondary text-xs font-bold">
              {data.price === 0 || data.free
                ? "-100%"
                : `-${100 - Math.floor((data.price / data.salePrice) * 100)} %`}
            </span>
          </div>
          <h4 className="text-base font-semibold mb-3">Khóa học bao gồm:</h4>
          <div className="flex flex-col gap-3 text-sm text-slate-600 mb-5">
            <WidgetItem>
              <div className="size-5">
                <IconPlay />
              </div>
              <p>{totalHours} giờ học</p>
            </WidgetItem>
            <WidgetItem>
              <div className="size-5">
                <IconPlay />
              </div>
              <p>Video quay Full HD</p>
            </WidgetItem>
            <WidgetItem>
              <div className="size-5">
                <IconUser />
              </div>
              <p>Có nhóm hỗ trợ</p>
            </WidgetItem>
            <WidgetItem>
              <div className="size-5">
                <IconStudy />
              </div>
              <p>Tài liệu kèm theo</p>
            </WidgetItem>
          </div>
          {!userCourses?.includes(data._id) ? (
            <>
              {data.free ? (
                <button
                  type="button"
                  onClick={() => handleEnrollFree(data.slug)}
                  className="w-full"
                >
                  <ButtonGradient
                    className={{
                      wrapper: "w-full rounded-full",
                      main: "text-sm",
                    }}
                  >
                    Lụm liền
                  </ButtonGradient>
                </button>
              ) : (
                <button
                  className="w-full"
                  onClick={() => handleBuyCourse(data.slug)}
                >
                  <ButtonGradient
                    className={{
                      wrapper: "w-full rounded-full",
                      main: "text-sm",
                    }}
                  >
                    {data.cta || "Đăng ký ngay"}
                  </ButtonGradient>
                </button>
              )}
            </>
          ) : (
            <button type="button" className="w-full" disabled>
              <ButtonGradient
                className={{
                  wrapper: "w-full rounded-full",
                  main: "text-sm",
                }}
              >
                {data.cta || "Đăng ký ngay"}
              </ButtonGradient>
            </button>
          )}
          <div className="text-center mt-5 text-sm">
            Bạn chưa biết cách mua khóa học?{" "}
            <Link
              href="/how-to-buy"
              className="text-primary underline font-semibold"
            >
              Nhấn vào đây nha
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function DetailsItem({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={boxDetailClassName}>
      <h4 className="text-sm text-slate-600 dark:text-slate-400 font-medium">
        {title}
      </h4>
      <div className="flex items-center gap-1 font-semibold text-sm">
        {icon}
        <span>{children}</span>
      </div>
    </div>
  );
}
function WidgetItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 dark:text-white dark:text-opacity-80">
      {children}
    </div>
  );
}

function BoxList({ title, data }: { title: string; data: string[] }) {
  if (data.length === 0) return null;
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold">{title}</h2>
      <ul className="flex flex-col gap-2">
        {data.map((item, index) => (
          <ListItem key={index} title={item} />
        ))}
      </ul>
    </div>
  );
}

function ListItem({ title }: { title: string }) {
  return (
    <li className="flex items-baseline gap-3 dark:text-text5">
      <div className="size-4 p-0.5 flex items-center justify-center rounded bg-primary text-white relative top-0.5 flex-shrink-0">
        <IconCheck />
      </div>
      <p>{title}</p>
    </li>
  );
}

function IconCheck({}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}
export default CourseDetailsPage;
