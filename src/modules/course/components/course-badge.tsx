import Image from "next/image";

export interface CourseBadgeProps {
  orderCount: number;
  isFree?: boolean;
}

export function CourseBadge({ orderCount, isFree }: CourseBadgeProps) {
  let url = "";
  if (orderCount >= 100) url = "/rewards.png";
  if (orderCount >= 120) url = "/star-medal.png";
  if (isFree) url = "/free.png";
  if (!url) return null;
  return (
    <Image
      alt=""
      src={url}
      width={40}
      height={40}
      className="absolute top-4 right-4 pointer-events-none z-10"
    />
  );
}
