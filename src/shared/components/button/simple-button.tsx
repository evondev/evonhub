import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
export type SimpleButtonVariants = "primary";
export interface SimpleButtonProps
  extends Omit<ComponentProps<"button">, "className"> {
  variants?: SimpleButtonVariants;
  className?: string;
}

export function SimpleButton({
  variants = "primary",
  className = "",
  ...rest
}: SimpleButtonProps) {
  const variantsClassNames: Record<SimpleButtonVariants, string> = {
    primary: "bg-primary text-white bg-primary button-styles",
  };
  return (
    <button
      className={cn(
        "rounded-lg h-12 inline-flex items-center justify-center text-center px-5 font-bold min-w-[120px] transition-all text-sm flex-shrink-0",
        className,
        variantsClassNames[variants]
      )}
      {...rest}
    ></button>
  );
}
