import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/shared/utils";
import {
  PROFILE_ROW_CLASS_NAME,
  PROFILE_ROW_LABEL_CLASS_NAME,
} from "../../../constants";
import { ProfileFieldHint } from "./profile-field-hint";

export interface ProfileFieldProps {
  label: string;
  hint?: React.ReactNode;
  counter?: React.ReactNode;
  isCounterOver?: boolean;
  isRequired?: boolean;
  /** Một phần tử nhận id, aria-invalid từ FormControl */
  children: React.ReactNode;
}

/** Hàng ô nhập: nhãn trái, ô và dòng gợi ý phải */
export function ProfileField({
  label,
  hint,
  counter,
  isCounterOver,
  isRequired,
  children,
}: ProfileFieldProps) {
  return (
    <FormItem className={cn(PROFILE_ROW_CLASS_NAME, "space-y-0")}>
      <div className={PROFILE_ROW_LABEL_CLASS_NAME}>
        <FormLabel className="cursor-pointer text-sm font-medium leading-5 text-foreground">
          {label}
          {isRequired && (
            <span aria-hidden="true" className="text-red-600 dark:text-red-400">
              {" "}
              *
            </span>
          )}
        </FormLabel>
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <FormControl>{children}</FormControl>
        <ProfileFieldHint
          hint={hint}
          counter={counter}
          isCounterOver={isCounterOver}
        />
      </div>
    </FormItem>
  );
}
