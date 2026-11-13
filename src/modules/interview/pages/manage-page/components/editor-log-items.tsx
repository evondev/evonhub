import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { INTERVIEW_LOG_ITEM_LIMITS, INTERVIEW_TEXT_LIMITS } from "../../../constants";
import { moveItem, removeItemAt, replaceItemAt } from "../../../utils";

interface EditorLogItemsProps {
  logItems: string[];
  onChange: (logItems: string[]) => void;
}

/** Các dòng log theo đúng thứ tự in ra. Học viên thấy chúng đã bị trộn */
export function EditorLogItems({ logItems, onChange }: EditorLogItemsProps) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-foreground">
        Dòng log <span className="font-normal text-muted">· đúng thứ tự in ra, học viên thấy đã trộn</span>
      </legend>
      <div className="flex flex-col gap-2">
        {logItems.map((logItem, index) => (
          // Dòng log chưa có id; đổi chỗ thì cả hai ô cùng nhận giá trị mới nên key theo vị trí vẫn đúng
          <div key={index} className="flex items-center gap-1">
            <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted">{index + 1}</span>
            <Input
              value={logItem}
              maxLength={INTERVIEW_TEXT_LIMITS.logItem}
              aria-label={`Dòng log ${index + 1}`}
              placeholder="render 1"
              className="ml-1 font-mono font-normal"
              onChange={(event) => onChange(replaceItemAt(logItems, index, event.target.value))}
            />
            <Button type="button" variant="ghost" size="icon" className="shrink-0" aria-label={`Đưa dòng ${index + 1} lên`} disabled={index === 0} onClick={() => onChange(moveItem(logItems, index, -1))}>
              <ArrowUp className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="shrink-0" aria-label={`Đưa dòng ${index + 1} xuống`} disabled={index === logItems.length - 1} onClick={() => onChange(moveItem(logItems, index, 1))}>
              <ArrowDown className="size-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="shrink-0" aria-label={`Bỏ dòng ${index + 1}`} disabled={logItems.length <= INTERVIEW_LOG_ITEM_LIMITS.min} onClick={() => onChange(removeItemAt(logItems, index))}>
              <X className="size-4" />
            </Button>
          </div>
        ))}
        {logItems.length < INTERVIEW_LOG_ITEM_LIMITS.max && (
          <Button type="button" variant="ghost" size="sm" className="w-fit" onClick={() => onChange([...logItems, ""])}>
            <Plus className="size-4" />
            Thêm dòng log
          </Button>
        )}
      </div>
    </fieldset>
  );
}
