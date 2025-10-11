import { ComponentProps } from "react";

export interface OrderPaginationProps extends ComponentProps<"button"> {}

export function OrderPagination(props: OrderPaginationProps) {
  return (
    <button
      {...props}
      className="size-11 rounded-xl flex items-center justify-center bg-primary text-white"
    />
  );
}
