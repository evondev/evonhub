import Image from "next/image";

export interface CourseBadgeProps {
  orderCount: number;
}

export function CourseBadge({ orderCount }: CourseBadgeProps) {
  let url = "";
  if (orderCount >= 100) url = "/rewards.png";
  if (orderCount >= 120) url = "/star-medal.png";
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
