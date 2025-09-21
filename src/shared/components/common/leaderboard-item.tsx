import { formatNumberToK } from "@/lib/utils";
import { cn } from "@/shared/utils";
import Image from "next/image";
import { IconStarFilled } from "../icons";

export interface LeaderboardItemProps {
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  score: number;
  index: number;
  className?: string;
}

export function LeaderboardItem({
  user,
  score,
  index,
  className,
}: LeaderboardItemProps) {
  return (
    <div key={user._id} className={cn("flex items-center gap-2", className)}>
      <strong>{index + 1}</strong>
      <Image
        src={user.avatar}
        width={32}
        height={32}
        alt={user.username}
        className="size-8 rounded-full object-cover border borderDarkMode"
      />
      <strong className="text-sm truncate max-w-[120px]">
        {user.username}
      </strong>
      <span className="shrink-0 ml-auto font-bold text-xs text-primary px-2 py-1 rounded-full border borderDarkMode flex items-center gap-2 w-[70px] justify-center">
        <IconStarFilled className="size-4 shrink-0" />
        {formatNumberToK(score)}
      </span>
    </div>
  );
}
