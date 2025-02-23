import { ComponentProps } from "react";

export interface PaginationControlProps extends ComponentProps<"button"> {}

export function PaginationControl(props: PaginationControlProps) {
  return (
    <button
      {...props}
      className="size-10 rounded-md flex items-center justify-center bg-primary text-white"
    />
  );
}
