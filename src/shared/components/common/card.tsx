import { cn } from "@/shared/utils";

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "border border-grayed shadow-[inset_0_0_0px_4px_#ededed6b] dark:border-opacity-10 dark:shadow-[inset_0_0_0px_4px_#12131A6b] p-1",
        className
      )}
    >
      {children}
    </div>
  );
}
