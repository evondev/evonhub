import { cn } from "@/lib/utils";

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function Heading({ children, className }: HeadingProps) {
  return (
    <h1
      className={cn(
        "text-2xl lg:text-3xl font-extrabold mb-8 flex items-baseline gap-2",
        className
      )}
    >
      <div className="size-4 lg:size-5 relative top-[1px] from-[#ba97f7] to-[#978df8] bg-gradient-to-tl rounded"></div>
      {children}
    </h1>
  );
}
