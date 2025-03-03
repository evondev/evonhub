import { cn } from "@/lib/utils";

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  squareClassName?: string;
}

export function Heading({
  children,
  className = "",
  squareClassName = "",
}: HeadingProps) {
  return (
    <h1
      className={cn(
        "text-2xl lg:text-3xl font-bold mb-8 flex items-center gap-2 relative w-max text-textPrimary dark:text-white",
        className
      )}
    >
      <div
        className={cn(
          "absolute bottom-1.5 w-1/3 h-2 from-[#ba97f7] to-[#ff979a] bg-gradient-to-r",
          squareClassName
        )}
      ></div>
      <span className="relative z-10">{children}</span>
    </h1>
  );
}
