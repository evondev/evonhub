import { TruncateTooltip } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { OrderManageRow } from "../../../types/order-manage.types";

interface OrderCourseLabelProps {
  order: OrderManageRow;
  /** Danh sách dòng: tên khoá là thứ nhận ra đơn, cho xuống hai dòng thay vì cắt */
  isMultiline?: boolean;
  className?: string;
}

/** Tên khoá trên một dòng; đơn gói thành viên cũ thì tên gói, khoá đã gỡ thì nói rõ */
export function OrderCourseLabel({
  order,
  isMultiline = false,
  className,
}: OrderCourseLabelProps) {
  const lineClassName = isMultiline ? "line-clamp-2 text-pretty" : "truncate";

  if (order.courseTitle) {
    return (
      <TruncateTooltip content={order.courseTitle}>
        <p className={cn(lineClassName, "text-sm text-foreground", className)}>
          {order.courseTitle}
        </p>
      </TruncateTooltip>
    );
  }

  if (order.planName) {
    return (
      <p className={cn(lineClassName, "text-sm text-foreground", className)}>
        {order.planName}
        <span className="text-muted"> · gói cũ</span>
      </p>
    );
  }

  return (
    <p className={cn(lineClassName, "text-sm text-muted", className)}>
      Khoá đã gỡ
    </p>
  );
}
