import { EmailText, TruncateTooltip } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { OrderManageStudent } from "../../../types/order-manage.types";

interface OrderStudentProps {
  student: OrderManageStudent;
  className?: string;
}

/** Tên học viên (mở trang sửa thành viên) trên email. Chưa đặt tên thì email lên dòng trên */
export function OrderStudent({ student, className }: OrderStudentProps) {
  const hasName = Boolean(student.name);

  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <TruncateTooltip
        content={hasName ? student.name : <EmailText email={student.email} />}
      >
        <Link
          href={`/admin/user/update?email=${encodeURIComponent(student.email)}`}
          className="truncate text-sm text-foreground underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground"
        >
          {hasName ? student.name : student.email}
        </Link>
      </TruncateTooltip>
      {hasName && (
        <TruncateTooltip content={<EmailText email={student.email} />}>
          <span className="truncate text-xs text-muted">{student.email}</span>
        </TruncateTooltip>
      )}
    </div>
  );
}
