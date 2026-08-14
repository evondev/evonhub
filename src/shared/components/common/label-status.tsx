import { cn } from "@/shared/utils";
import { ComponentProps } from "react";

export interface LabelStatusProps extends ComponentProps<"span"> {
  children: React.ReactNode;
  className?: string;
}

export function LabelStatus({
  children,
  className,
  ...props
}: LabelStatusProps) {
  return (
    <span
      className={cn(
        className,
        // inline-flex + w-fit để badge ôm sát chữ khi nằm trong flex column,
        // justify-center + text-center để chữ vẫn nằm giữa nếu có chỗ nào đó
        // ép badge rộng hơn nội dung
        "inline-flex items-center justify-center text-center self-start w-fit py-1 px-3 rounded-xl font-bold border border-current text-xs whitespace-nowrap bg-opacity-10"
      )}
      {...props}
    >
      {children}
    </span>
  );
}
