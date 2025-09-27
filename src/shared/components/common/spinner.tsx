import { cn } from "@/shared/utils";

export interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <div className={cn("py-10", className)}>
      <div
        className={cn(
          "animate-spin size-10 border-4 border-y-transparent rounded-full border-primary mx-auto"
        )}
      ></div>
    </div>
  );
}
