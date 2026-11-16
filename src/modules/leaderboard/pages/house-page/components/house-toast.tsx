interface HouseToastProps {
  text: string;
}

/** Câu báo lên bậc, nổi giữa mép trên khung cảnh */
export function HouseToast({ text }: HouseToastProps) {
  return (
    <div
      role="status"
      className="pointer-events-none absolute inset-x-3 top-36 z-10 mx-auto w-fit max-w-full rounded-xl border border-border bg-surface/95 px-4 py-2.5 text-center text-sm font-semibold text-foreground shadow-sm backdrop-blur sm:top-4 lg:max-w-md"
    >
      {text}
    </div>
  );
}
