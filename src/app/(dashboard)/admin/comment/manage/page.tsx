import CommentManage from "@/components/comment/CommentManage";
import { getAllComments } from "@/lib/actions/comment.action";
import { auth } from "@clerk/nextjs/server";

const page = async () => {
  const { userId } = auth();
  const commentList = await getAllComments({
    userId: userId || "",
  });
  return (
    <>
      <CommentManage
        commentList={commentList ? JSON.parse(JSON.stringify(commentList)) : []}
      ></CommentManage>
    </>
  );
};

export default page;
