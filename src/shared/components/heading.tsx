import { cn } from "@/lib/utils";

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  squareClassName?: string;
}

export function Heading({ children, className = "" }: HeadingProps) {
  return (
    <h1
      className={cn(
        "text-2xl lg:text-3xl font-bold mb-8 flex items-center gap-2 relative w-max text-textPrimary dark:text-white",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </h1>
  );
}
