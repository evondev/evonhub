import { fetchRatingsPublic } from "@/modules/rating/actions";
import { Heading } from "@/shared/components";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { RatingStatus } from "@/shared/constants/rating.constants";
import Image from "next/image";

export interface RatingProps {}

export async function Rating(_props: RatingProps) {
  const ratings = await fetchRatingsPublic({
    page: 1,
    limit: ITEMS_PER_PAGE,
    status: RatingStatus.Active,
  });
  return (
    <section className="w-full flex flex-col gap-5">
      <Heading className="text-lg lg:text-2xl">Cảm nhận từ học viên</Heading>
      <div className="flex flex-wrap gap-3">
        {ratings?.map((rating, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm p-3 bgDarkMode borderDarkMode rounded-xl"
          >
            <Image
              width={20}
              height={20}
              alt={rating.user?.name || "User Avatar"}
              src={rating.user?.avatar || "/default.jpg"}
              className="object-cover shrink-0 size-5 rounded-full"
            />
            <div>{rating.content}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
