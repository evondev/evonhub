import { formatNumberToK } from "@/lib/utils";
import { cn } from "@/shared/utils";
import Image from "next/image";
import Link from "next/link";

export interface LeaderboardItemProps {
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  score: number;
  index: number;
  className?: string;
  rank?: number;
}

export function LeaderboardItem({
  user,
  score,
  index,
  className,
  rank = 0,
}: LeaderboardItemProps) {
  let gemImage = "/gems/gem-blue.png";
  switch (rank) {
    case 1:
      gemImage = "/gems/gem-rank1.png";
      break;
    case 2:
      gemImage = "/gems/gem-rank2.png";
      break;
    case 3:
      gemImage = "/gems/gem-rank3.png";
      break;
  }
  return (
    <Link
      href={`/user-profile/${user.username}`}
      key={user._id}
      className={cn("group flex items-center gap-3", className)}
    >
      <strong>{index + 1}</strong>
      <Image
        src={user.avatar}
        width={32}
        height={32}
        alt={user.username}
        className="size-8 rounded-xl object-cover"
      />
      <span className="text-sm font-medium truncate max-w-[120px]">
        {user.username}
      </span>
      <span className="shrink-0 ml-auto font-bold text-xs px-2 py-1 rounded-full flex items-center gap-2 w-[70px] justify-center">
        <Image
          src={gemImage}
          alt="score"
          width={20}
          height={20}
          className="size-5 group-hover:animate-bounce"
        />
        {formatNumberToK(score)}
      </span>
    </Link>
  );
}
