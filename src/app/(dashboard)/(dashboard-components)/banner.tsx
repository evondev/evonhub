import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export interface BannerProps {}

export async function Banner(_props: BannerProps) {
  return (
    <section className="relative h-auto lg:h-[400px]">
      <div className="absolute max-w-xl rounded-md bg-gray-400/10 bg-clip-padding backdrop-filter backdrop-blur-sm p-5 lg:p-10 inset-[5px] lg:inset-10 bottom-auto lg:bottom-auto flex flex-col gap-2 z-10 border border-gray-100/10 text-white">
        <h2 className="font-extrabold text-lg lg:text-4xl">
          Học qua videos ngắn
        </h2>
        <div>
          Tập trung vào nội dung ngắn gọn và dễ hiểu. Giúp các bạn học nhanh và
          hiệu quả.
        </div>
        <Link href="/explore-videos" className="mt-5 w-fit">
          <Button variant="primary" className="rounded-full px-10 font-bold">
            Khám phá ngay
          </Button>
        </Link>
      </div>
      <Image
        src="/banner.jpg"
        alt="Banner"
        width={1280}
        height={300}
        className="rounded-lg object-cover size-full"
      />
    </section>
  );
}
