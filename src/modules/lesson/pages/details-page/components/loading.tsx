export interface LoadingProps {}

export function Loading(_props: LoadingProps) {
  return (
    <div className="w-full mb-8">
      <div className="w-full aspect-video mb-5 min-h-[400px]">
        <div className="w-full h-full skeleton rounded-lg"></div>
      </div>
      <div className="flex justify-end mb-5 gap-3">
        <div className="h-12 w-[120px] skeleton rounded-lg"></div>
        <div className="h-12 w-[120px] skeleton rounded-lg"></div>
      </div>
      <div className="h-8 w-full mb-5 skeleton"></div>
    </div>
  );
}
