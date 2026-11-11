import { Radio } from "@/components/ui/radio";
import { Textarea } from "@/components/ui/textarea";
import {
  USER_LOCK_REASON_MAX_LENGTH,
  UserLockDuration,
  userLockDurationOptions,
} from "@/shared/constants/user.constants";
import { UserLockInput } from "@/shared/types/user.types";
import { cn } from "@/shared/utils";

interface UserLockFieldsProps {
  value: UserLockInput;
  isDisabled: boolean;
  onChange: (value: UserLockInput) => void;
}

/** Chọn thời hạn khoá và ghi lý do (người bị khoá sẽ đọc được) */
export function UserLockFields({
  value,
  isDisabled,
  onChange,
}: UserLockFieldsProps) {
  function handleDurationChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, duration: event.target.value as UserLockDuration });
  }

  function handleReasonChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange({ ...value, reason: event.target.value });
  }

  return (
    <div className="flex flex-col gap-4">
      <fieldset disabled={isDisabled}>
        <legend className="text-sm font-medium text-foreground">
          Khoá trong
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {userLockDurationOptions.map((option) => {
            const isChecked = option.value === value.duration;

            return (
              <label
                key={option.value}
                className={cn(
                  "flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm text-foreground transition-colors",
                  isChecked && "border-primary bg-primary/5",
                  !isChecked && "border-border-strong hover:bg-foreground/5",
                )}
              >
                <Radio
                  size="sm"
                  name="user-lock-duration"
                  value={option.value}
                  checked={isChecked}
                  onChange={handleDurationChange}
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">
          Lý do{" "}
          <span className="font-normal text-muted">
            (người bị khoá sẽ thấy)
          </span>
        </span>
        <Textarea
          value={value.reason}
          maxLength={USER_LOCK_REASON_MAX_LENGTH}
          disabled={isDisabled}
          placeholder="Vd: Spam tin nhắn quảng cáo"
          onChange={handleReasonChange}
          className="min-h-[72px] text-sm"
        />
      </label>
    </div>
  );
}
