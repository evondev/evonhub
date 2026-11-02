import { lessonCatalog } from "@/features/lessons/constants/lessons";
import LessonPage from "@/features/lessons/pages/lesson-page";

export function generateStaticParams() {
  return lessonCatalog.map((lesson) => ({ slug: lesson.slug }));
}

// Không await params ở đây: để LessonPage đọc nó bên trong <Suspense>, khung trang hiện ngay.
export default function Page({ params }: PageProps<"/lessons/[slug]">) {
  const lessonSlugPromise = params.then((routeParams) => routeParams.slug);

  return <LessonPage lessonSlugPromise={lessonSlugPromise} />;
}
