import { cn } from "@/lib/utils";

const LabelStatus = ({
  className,
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
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
};

export default LabelStatus;
