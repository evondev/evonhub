import { fetchRatingsPublic } from "@/modules/rating/actions";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { RatingStatus } from "@/shared/constants/rating.constants";
import Image from "next/image";
import { getFirstName } from "../utils";
import { SectionHeading } from "./section-heading";

export async function StudentRatings() {
  const ratings = await fetchRatingsPublic({
    page: 1,
    limit: ITEMS_PER_PAGE,
    status: RatingStatus.Active,
  });

  if (!ratings || ratings.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeading title="Cảm nhận từ học viên" />
      <ul className="flex flex-wrap gap-2">
        {ratings.map((rating) => {
          const authorName = rating.user?.name || rating.user?.username || "";

          return (
            <li
              key={rating._id}
              className="flex max-w-full items-start gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground"
            >
              {rating.user?.avatar ? (
                <Image
                  width={20}
                  height={20}
                  alt=""
                  src={rating.user.avatar}
                  className="mt-0.5 size-5 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold uppercase text-primary">
                  {getFirstName(authorName).charAt(0) || "?"}
                </span>
              )}
              <span className="min-w-0">{rating.content}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
