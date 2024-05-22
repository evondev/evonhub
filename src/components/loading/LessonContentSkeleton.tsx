const LessonContentSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="h-12 mb-5 skeleton rounded-lg"></div>
        <div className="flex flex-col gap-1">
          <div className="h-12 skeleton rounded-lg"></div>
          <div className="h-12 skeleton rounded-lg"></div>
        </div>
        <div className="h-12 mb-5 skeleton rounded-lg"></div>
        <div className="flex flex-col gap-1">
          <div className="h-12 skeleton rounded-lg"></div>
          <div className="h-12 skeleton rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default LessonContentSkeleton;
