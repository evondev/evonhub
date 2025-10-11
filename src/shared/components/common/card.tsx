import { cn } from "@/shared/utils";

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("border borderDarkMode bgDarkMode", className)}>
      {children}
    </div>
  );
}
