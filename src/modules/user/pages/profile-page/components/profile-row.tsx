import { cn } from "@/shared/utils";
import {
  PROFILE_ROW_CLASS_NAME,
  PROFILE_ROW_LABEL_CLASS_NAME,
} from "../../../constants";

export interface ProfileRowProps {
  label: string;
  /** Hàng ảnh đại diện căn giữa: avatar không có dòng đầu để thẳng theo */
  isCentered?: boolean;
  children: React.ReactNode;
}

/** Hàng không phải ô nhập: ảnh đại diện, chữ chỉ đọc kèm nút */
export function ProfileRow({ label, isCentered, children }: ProfileRowProps) {
  return (
    <div
      className={cn(PROFILE_ROW_CLASS_NAME, isCentered && "sm:items-center")}
    >
      <div className={PROFILE_ROW_LABEL_CLASS_NAME}>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
