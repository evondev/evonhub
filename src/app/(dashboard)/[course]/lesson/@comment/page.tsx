import CommentForm from "@/components/comment/CommentForm";
import { getCommentsByLesson } from "@/lib/actions/comment.action";
import { getLessonBySlug } from "@/lib/actions/lesson.action";
import CommentField from "./comment-field";

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
  const comments = await getCommentsByLesson(lessonDetails._id);
  const rootComments = comments?.filter((item) => !item.parentId);
  const commentLessonId = lessonDetails?._id.toString() || "";

  if (!lessonDetails.courseId) return null;

  return (
    <div>
      <CommentForm lessonId={commentLessonId}></CommentForm>
      {!!rootComments && rootComments?.length > 0 && (
        <div className="mt-10 hidden lg:flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <span>Comments</span>
              <span className="flex items-center justify-center rounded-full bg-primary px-4 py-0.5 text-sm font-semibold text-white">
                {comments?.length}
              </span>
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            {rootComments?.map((item) => (
              <CommentField
                key={item._id.toString()}
                comment={item}
                comments={comments || []}
                lessonId={commentLessonId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
