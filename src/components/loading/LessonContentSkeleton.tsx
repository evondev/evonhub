const LessonContentSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="h-3 skeleton rounded-lg"></div>
        <div className="h-14 skeleton rounded-lg"></div>
        <div className="flex flex-col gap-1">
          <div className="h-14 skeleton rounded-lg"></div>
          <div className="h-14 skeleton rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default LessonContentSkeleton;
