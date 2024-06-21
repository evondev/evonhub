import CommentForm from "@/components/comment/CommentForm";
import { getAllComments } from "@/lib/actions/comment.action";
import { getLessonBySlug } from "@/lib/actions/lesson.action";
import { ECommentStatus } from "@/types/enums";

const page = async ({
  searchParams,
  params,
}: {
  params: {
    course: string;
  };
  searchParams: {
    slug: string;
  };
}) => {
  const lessonDetails = await getLessonBySlug(searchParams.slug, params.course);
  if (!lessonDetails) return null;
  const comments =
    (await getAllComments({
      lesson: lessonDetails._id.toString(),
      status: ECommentStatus.APPROVED,
    })) || [];
  if (!lessonDetails.courseId) return null;
  return (
    <CommentForm
      course={JSON.parse(JSON.stringify(lessonDetails.courseId))}
      comments={JSON.parse(JSON.stringify(comments))}
      lessonId={lessonDetails._id.toString()}
    ></CommentForm>
  );
};

export default page;
