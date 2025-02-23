import { cn } from "@/shared/utils";

export interface LabelStatusProps {
  children: React.ReactNode;
  className?: string;
}

export function LabelStatus({ children, className }: LabelStatusProps) {
  return (
    <span
      className={cn(
        className,
        "py-1 px-3 rounded-lg font-bold border border-current text-xs whitespace-nowrap bg-opacity-10"
      )}
    >
      {children}
    </span>
  );
}
