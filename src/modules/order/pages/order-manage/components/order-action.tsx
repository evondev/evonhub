export interface OrderActionProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function OrderAction({ children, onClick }: OrderActionProps) {
  return (
    <span
      className="size-8 flex items-center justify-center bg-gray-100 dark:bg-grayDarkest rounded  p-2 transition-all  hover:text-gray-500 dark:hover:text-opacity-80"
      onClick={onClick}
    >
      {children}
    </span>
  );
}
