export interface LoadingProps {}

export function Loading(_props: LoadingProps) {
  return (
    <div className="w-full">
      <div className="w-full aspect-video mb-5 lg:min-h-[400px]">
        <div className="w-full h-full skeleton rounded-xl"></div>
      </div>
      <div className="flex justify-end mb-5 gap-3 p-2 lg:p-0">
        <div className="w-10 h-10 lg:h-12 lg:w-[120px] skeleton rounded-xl"></div>
        <div className="w-10 h-10 lg:h-12 lg:w-[120px] skeleton rounded-xl"></div>
      </div>
      <div className="p-2 lg:p-0">
        <div className="h-8 w-full skeleton"></div>
      </div>
    </div>
  );
}
