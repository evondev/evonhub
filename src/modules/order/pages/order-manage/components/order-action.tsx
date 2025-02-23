import { cn } from "@/shared/utils";

export interface OrderActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function OrderAction({
  children,
  onClick,
  className = "",
}: OrderActionProps) {
  return (
    <button
      type="button"
      className={cn(
        "size-8 flex items-center justify-center border borderDarkMode rounded p-2 transition-all hover:text-gray-500 dark:hover:text-opacity-80",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
