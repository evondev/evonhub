import { useUserContext } from "@/components/user-context";
import { IconStarGradient } from "@/shared/components";
import Image from "next/image";
import Link from "next/link";

export interface AlreadyEnrollProps {
  course: string;
  lesson: string;
}

export default function AlreadyEnroll({ course, lesson }: AlreadyEnrollProps) {
  const { userInfo } = useUserContext();
  if (!userInfo) return null;
  return (
    <div className="bg-white/30 backdrop-blur-xl border border-white dark:border-white/10 rounded-lg p-3 flex flex-col transition-all relative dark:bg-grayDarkest">
      <div className="p-3 bg-white rounded-lg dark:bg-grayDarker">
        <div className="relative size-20 rounded-full border borderDarkMode mx-auto mb-5">
          <Image
            src={userInfo.avatar}
            alt=""
            width={80}
            height={80}
            className="w-full h-full object-cover rounded-full"
          />
          <IconStarGradient className="size-5 absolute right-0 bottom-0" />
        </div>
        <div>
          Xin chào <strong>{userInfo.username}</strong>. Bạn đã sở hữu khóa học
          này rồi. Vui lòng vào{" "}
          <Link href="/study" className="text-primary font-bold">
            khu vực học tập
          </Link>{" "}
          để học hoặc
        </div>
        <Link
          href={`/${course}/lesson?id=${lesson}`}
          className="rounded-lg h-12 inline-flex items-center justify-center text-center px-5 font-bold min-w-[120px] transition-all text-sm flex-shrink-0 bg-primary text-white bg-primary button-styles mt-5 w-full"
        >
          Nhấn vào đây
        </Link>
      </div>
    </div>
  );
}
