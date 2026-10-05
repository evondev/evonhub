import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export interface OutlineChapterMenuProps {
  chapterTitle: string;
  onRename: () => void;
  onDelete: () => void;
}

const menuItemClassName =
  "flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-foreground focus:bg-item-hover focus:text-foreground dark:focus:bg-item-hover dark:focus:text-foreground";

export function OutlineChapterMenu({
  chapterTitle,
  onRename,
  onDelete,
}: OutlineChapterMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Thao tác với ${chapterTitle}`}
          className="size-8 shrink-0 rounded-lg data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground"
        >
          <MoreHorizontal className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        // Không trả tiêu điểm về nút ⋯ khi đóng: chọn "Đổi tên" thì ô nhập vừa mở đang giữ
        // tiêu điểm, trả về nút sẽ làm ô blur, mà blur là lưu nên ô đóng ngay
        onCloseAutoFocus={(event) => event.preventDefault()}
        className="flex w-44 flex-col gap-1 rounded-xl border-border bg-surface p-1 text-foreground shadow-lg dark:border-border dark:bg-surface dark:text-foreground"
      >
        <DropdownMenuItem className={menuItemClassName} onSelect={onRename}>
          <Pencil className="size-4 text-muted" aria-hidden />
          Đổi tên chương
        </DropdownMenuItem>
        <DropdownMenuSeparator className="mx-0 my-0.5 bg-border dark:bg-border" />
        {/* Mục menu nguy hiểm: trung tính lúc thường, rê vào mới đỏ */}
        <DropdownMenuItem
          className={cn(
            menuItemClassName,
            "focus:bg-rose-500/10 focus:text-rose-700 dark:focus:bg-rose-500/10 dark:focus:text-rose-400 [&:focus>svg]:text-current",
          )}
          onSelect={onDelete}
        >
          <Trash2 className="size-4 text-muted" aria-hidden />
          Xoá chương
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
