import Image from "next/image";
import { getRatingReaction } from "../../../utils/rating-manage.utils";

interface RatingReactionLabelProps {
  /** Số sao 1–5 */
  rating: number;
}

/** Mức cảm xúc của đánh giá: cùng icon và nhãn với hộp đánh giá khoá học */
export function RatingReactionLabel({ rating }: RatingReactionLabelProps) {
  const reaction = getRatingReaction(rating);

  if (!reaction) return null;

  return (
    <span
      title={`${rating}/5 sao`}
      className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-foreground/80"
    >
      <Image
        src={reaction.icon}
        alt=""
        width={16}
        height={16}
        className="size-4 object-contain"
      />
      {reaction.label}
    </span>
  );
}
