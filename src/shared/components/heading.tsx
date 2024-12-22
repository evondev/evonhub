import { cn } from "@/lib/utils";

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function Heading({ children, className }: HeadingProps) {
  return (
    <h1
      className={cn(
        "text-2xl lg:text-3xl font-extrabold mb-8 flex items-baseline gap-1",
        className
      )}
    >
      <div className="w-5 h-2 bg-primary"></div>
      {children}
    </h1>
  );
}
