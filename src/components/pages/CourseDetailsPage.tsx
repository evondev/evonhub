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
import {
  boxDetailClassName,
  commonPath,
  courseLevel,
  primaryButtonClassName,
  widgetClassName,
} from "@/constants";
import { ICourse } from "@/database/course.model";
import { getCouponInfo } from "@/lib/actions/coupon.action";
import { getFreeCourse } from "@/lib/actions/course.action";
import { userBuyCourse } from "@/lib/actions/order.action";
import { cn } from "@/lib/utils";
import { ECourseStatus, Role } from "@/types/enums";
import { formatThoundsand } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  ratings = [],
  user,
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
        slug: string;
      }[];
    }[];
  };
  lessonCount: number;
  ratings: any[];
  user?: any;
}) => {
  const userRole = user?.role || "";
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const userCourses = user?.courses?.map((item: any) => item._id) || [];
  const router = useRouter();
  const handleEnrollFree = async (slug: string) => {
    if (!user?._id) {
      router.push(commonPath.LOGIN);
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
    if (!user?._id) {
      router.push(commonPath.LOGIN);
      return;
    }
    const res = await userBuyCourse({
      user: user?._id,
      course: data._id,
      amount: data.price,
      total: data.price - discount,
      discount,
      couponCode,
    });
    if (res?.error) {
      toast.error(res?.error);
      return;
    }
    router.push(`/order/${res?.order.code}`);
  };
  const handleApplyCoupon = async () => {
    try {
      const couponDetails = await getCouponInfo(couponCode);
      if (
        couponDetails?.amount &&
        couponDetails?.course?.toString() === data._id.toString() &&
        couponDetails?.limit >= couponDetails?.used
      ) {
        setDiscount(couponDetails.amount);
        toast.success("Áp dụng mã giảm giá thành công");
      } else {
        toast.error("Mã giảm giá không hợp lệ");
      }
    } catch (error) {
      console.log(error);
    }
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
        {ratings.length > 0 && (
          <>
            <div className="flex flex-wrap gap-3 mb-5">
              {ratings.map((el, index) => (
                <ButtonGradient
                  key={el.content}
                  className={{
                    wrapper: "rounded-lg",
                  }}
                >
                  <div className="rounded-md px-3 py-1 font-semibold text-sm flex items-center gap-2">
                    <Image
                      width={20}
                      height={20}
                      src={el.user.avatar}
                      alt=""
                      className="border borderDarkMode size-5 p-0.5 object-cover rounded-full"
                    />
                    {el.content}
                  </div>
                </ButtonGradient>
              ))}
            </div>
          </>
        )}
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
                          <div className="line-clamp-1">{lesson.title}</div>
                          <span className="ml-auto font-semibold text-xs flex-shrink-0">
                            {lesson.duration} phút
                          </span>
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
        {userCourses?.includes(data._id) ? (
          <AlreadyEnroll
            course={data.slug}
            lesson={data.lecture[0].lessons[0].slug}
            user={user}
          />
        ) : (
          <div className={widgetClassName}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {data.price === 0 || data.free ? (
                  <strong className="text-xl text-primary">Miễn phí</strong>
                ) : (
                  <>
                    <strong className="text-lg lg:text-xl text-secondary">
                      {formatThoundsand(data.price - discount)} VNĐ
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
                  : `-${
                      100 - Math.floor((data.price / data.salePrice) * 100)
                    } %`}
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
            {!userCourses?.includes(data._id) && (
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
            )}
            <div className="relative h-10 rounded-lg borderDarkMode flex items-center gap-5 p-2 mt-5 justify-between has-[input:focus]:border-primary transition-all">
              <input
                placeholder="Nhập mã giảm giá"
                className="outline-none border-none bg-transparent text-sm uppercase font-bold pr-2 w-full placeholder:font-medium"
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                value={couponCode}
              />
              <button
                className="text-xs font-semibold bg-grayDarkest dark:bg-white dark:text-grayDarkest text-white rounded px-3 h-full flex-shrink-0"
                onClick={handleApplyCoupon}
                disabled={!couponCode}
              >
                Áp dụng
              </button>
            </div>
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
        )}
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

function AlreadyEnroll({
  course,
  lesson,
  user,
}: {
  course: string;
  lesson: string;
  user: any;
}) {
  return (
    <div className={widgetClassName}>
      <div className="relative size-20 rounded-full border borderDarkMode mx-auto mb-5">
        <Image
          src={user.avatar}
          alt=""
          width={80}
          height={80}
          className="w-full h-full object-cover rounded-full"
        />
        <svg
          width={15}
          height={15}
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-5 absolute right-0 bottom-0"
        >
          <path
            d="M8.59024 0.644475L9.97913 3.45026C10.1439 3.78929 10.4735 4.03479 10.8619 4.08156L13.981 4.52581C14.9462 4.66609 15.3228 5.83517 14.6284 6.51323L12.3803 8.69941C12.1096 8.96829 11.9801 9.35409 12.0389 9.72819L12.5686 12.8146C12.7334 13.7615 11.7329 14.4863 10.8737 14.0421L8.08412 12.5924C7.74278 12.4171 7.33082 12.4171 6.98948 12.5924L4.21169 14.0304C3.35246 14.4746 2.35198 13.7498 2.51677 12.8029L3.04643 9.72819C3.11705 9.35409 2.98758 8.96829 2.70509 8.69941L0.456967 6.52493C-0.23748 5.84686 0.150939 4.67779 1.10433 4.5375L4.22346 4.09325C4.60011 4.03479 4.92968 3.80098 5.10623 3.46195L6.49513 0.656165C6.91886 -0.208951 8.16651 -0.208951 8.59024 0.644475Z"
            fill="url(#paint0_linear_693_4755)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_693_4755"
              x1="0.103858"
              y1="7.08658"
              x2="14.9841"
              y2="7.08658"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFAFA7" />
              <stop offset={1} stopColor="#FCD2CB" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div>
        Xin chào <strong>{user.username}</strong>.Bạn đã sở hữu khóa học này
        rồi. Vui lòng vào{" "}
        <Link href="/study" className="text-primary font-bold">
          khu vực học tập
        </Link>{" "}
        để học hoặc
      </div>
      <Link
        href={`/${course}/lesson?slug=${lesson}`}
        className={cn(primaryButtonClassName, "mt-5 w-full")}
      >
        Nhấn vào đây
      </Link>
    </div>
  );
}

export default CourseDetailsPage;
