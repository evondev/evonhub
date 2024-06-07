import { cn } from "@/lib/utils";
import React from "react";

const ButtonGradient = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: {
    wrapper?: string;
    inside?: string;
    main?: string;
  };
}) => {
  return (
    <div className={cn("button-gradient group", className?.wrapper)}>
      <div className={cn("button-inside", className?.inside)}>
        <div
          className={cn(
            "button-main group-hover:text-opacity-70 text-grayDarkest dark:text-white",
            className?.main
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ButtonGradient;
