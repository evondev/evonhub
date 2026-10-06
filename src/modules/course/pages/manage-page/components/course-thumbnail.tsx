import { ImageOff } from "lucide-react";
import Image from "next/image";

interface CourseThumbnailProps {
  image?: string;
  title: string;
}

/** Ảnh bìa 16:9 rộng 64px; khoá chưa có ảnh thì ô xám có icon, giữ đúng cỡ */
export function CourseThumbnail({ image, title }: CourseThumbnailProps) {
  if (!image) {
    return (
      <span
        aria-hidden="true"
        className="grid h-9 w-16 shrink-0 place-items-center rounded-md bg-foreground/5 text-muted"
      >
        <ImageOff className="size-4" />
      </span>
    );
  }

  return (
    <span className="relative h-9 w-16 shrink-0 overflow-hidden rounded-md ring-1 ring-border">
      <Image
        src={image}
        alt={title}
        fill
        sizes="64px"
        className="object-cover"
      />
    </span>
  );
}
