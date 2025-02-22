"use client";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/components/user-context";
import { userMutationEnrollCourse } from "@/modules/course/services/data/mutation-enroll";
import { userMutationEnrollFree } from "@/modules/course/services/data/mutation-enroll-free.data";
import { IconPlay, IconStudy, IconUsers } from "@/shared/components";
import { formatThoundsand } from "@/utils";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export interface CourseWidgetProps {
  isFree?: boolean;
  price: number;
  salePrice: number;
  cta?: string;
  isComingSoon?: boolean;
  slug: string;
  courseId: string;
}

export default function CourseWidget({
  isFree,
  price,
  salePrice,
  cta,
  isComingSoon,
  slug,
  courseId,
}: CourseWidgetProps) {
  const mutationEnrollFree = userMutationEnrollFree();
  const mutationEnrollCourse = userMutationEnrollCourse();
  const { userInfo } = useUserContext();
  const userId = userInfo?._id.toString() || "";
  const router = useRouter();

  const handleEnrollFree = async () => {
    const response = await mutationEnrollFree.mutateAsync({
      slug,
      userId,
    });
    if (response?.type === "success") {
      toast.success(response?.message);
      return;
    }
    toast.error(response?.message);
  };

  const handleBuyCourse = async () => {
    const response = await mutationEnrollCourse.mutateAsync({
      userId,
      courseId,
      amount: price,
      total: price,
    });
    if (response?.error) {
      toast.error(response?.error);
      return;
    }
    if (response?.order?.code) {
      router.push(`/order/${response?.order?.code}`);
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <>
      <div className="bg-white/30 backdrop-blur-xl border border-white dark:border-white/10 rounded-lg p-3 flex flex-col transition-all relative dark:bg-grayDarkest">
        <div className="p-3 bg-white rounded-lg dark:bg-grayDarker flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isFree ? (
                <strong className="text-xl text-primary">Miễn phí</strong>
              ) : (
                <>
                  <strong className="text-lg lg:text-xl text-primary">
                    {formatThoundsand(price)} VNĐ
                  </strong>
                  <span className="text-sm line-through text-slate-400">
                    {formatThoundsand(salePrice)} VNĐ
                  </span>
                </>
              )}
            </div>
            <span className="inline-block py-1 px-3 rounded-full bg-primary bg-opacity-20 text-primary font-bold">
              {isFree
                ? "-100%"
                : `-${100 - Math.floor((price / salePrice) * 100)} %`}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <IconPlay className="size-4 flex-shrink-0" />
              <span>Video quay full HD</span>
            </div>
            <div className="flex items-center gap-2">
              <IconUsers className="size-4 flex-shrink-0" />
              <span>Hỗ trợ trong quá trình học</span>
            </div>
            <div className="flex items-center gap-2">
              <IconStudy className="size-4 flex-shrink-0" />
              <span>Có tài liệu kèm theo</span>
            </div>
          </div>
          {isFree && !isComingSoon && (
            <button
              type="button"
              onClick={handleEnrollFree}
              className="h-12 rounded-lg px-5 flex items-center justify-center bg-gradient-to-r from-[#cbabff] to-[#ff979a] text-white font-bold shadow-[0_0_1px_3px_rgb(203,_171,_255,0.2)] text-base w-full"
            >
              Lụm liền
            </button>
          )}
          {(!isFree || isComingSoon) && (
            <Button
              className="h-12 rounded-lg px-5 flex items-center justify-center bg-gradient-to-r from-[#cbabff] to-[#ff979a] text-white font-bold shadow-[0_0_1px_3px_rgb(203,_171,_255,0.2)] text-base w-full"
              onClick={() => !isComingSoon && handleBuyCourse()}
              disabled={isComingSoon || mutationEnrollCourse.isPending}
              isLoading={mutationEnrollCourse.isPending}
            >
              {isComingSoon ? "Sắp ra mắt" : cta || "Đăng ký ngay"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
