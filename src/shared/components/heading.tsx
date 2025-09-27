import { cn } from "@/lib/utils";

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  squareClassName?: string;
  as?: React.ElementType;
}

export function Heading({
  children,
  className = "",
  as: Component = "h1",
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "text-2xl lg:text-3xl font-extrabold text-textPrimary dark:text-white",
        className
      )}
    >
      {children}
    </Component>
  );
}
