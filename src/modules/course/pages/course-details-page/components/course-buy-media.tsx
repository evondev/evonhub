import { CourseCover } from "@/shared/components/course";
import CourseIntroVideo from "./course-intro-video";

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
    return <CourseIntroVideo title={title} intro={intro} image={image} />;
  }

  return (
    <CourseCover
      image={image}
      isPriority
      className="aspect-video w-full"
      sizes="(min-width: 1280px) 360px, 100vw"
    />
  );
}
