export interface LoadingOutlineProps {}

export function LoadingOutline(_props: LoadingOutlineProps) {
  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="h-14 skeleton rounded-lg"></div>
        <div className="flex flex-col gap-1">
          <div className="h-14 skeleton rounded-lg"></div>
          <div className="h-14 skeleton rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
