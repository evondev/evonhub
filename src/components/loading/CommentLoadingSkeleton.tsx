const CommentLoadingSkeleton = () => {
  return (
    <div>
      <div className="mb-5 h-[200px] skeleton rounded-lg"></div>
      <div className="w-[120px] ml-auto rounded-lg skeleton"></div>
    </div>
  );
};

export default CommentLoadingSkeleton;
