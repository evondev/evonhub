import { getYoutubeEmbedId } from "@/modules/course/utils";
import { CourseCover } from "@/shared/components/course";

export interface CourseBuyMediaProps {
  title: string;
  intro?: string;
  image?: string;
}

/** Đầu thẻ mua: video giới thiệu nếu có, không thì ảnh bìa */
export default function CourseBuyMedia({
  title,
  intro,
  image,
}: CourseBuyMediaProps) {
  if (intro) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${getYoutubeEmbedId(intro)}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="block aspect-video w-full"
      />
    );
  }

  return (
    <CourseCover
      image={image}
      className="aspect-video w-full"
      sizes="(min-width: 1280px) 360px, 100vw"
    />
  );
}
