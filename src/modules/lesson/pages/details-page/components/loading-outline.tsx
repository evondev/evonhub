export interface LoadingOutlineProps {}

export function LoadingOutline(_props: LoadingOutlineProps) {
  return (
    <div className="w-full lg:w-auto p-2 lg:p-0">
      <div className="flex flex-col gap-2 lg:gap-5">
        <div className="h-12 lg:h-14 skeleton rounded-xl"></div>
        <div className="flex flex-col gap-2 lg:gap-5">
          <div className="h-12 lg:h-14 skeleton rounded-xl"></div>
          <div className="h-12 lg:h-14 skeleton rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
