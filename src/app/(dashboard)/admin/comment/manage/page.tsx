import CommentManage from "@/components/comment/CommentManage";
import { getAllComments } from "@/lib/actions/comment.action";

const CommentManagePage = async () => {
  const commentList = (await getAllComments({})) || [];
  return (
    <>
      <CommentManage
        commentList={JSON.parse(JSON.stringify(commentList))}
      ></CommentManage>
    </>
  );
};

export default CommentManagePage;
