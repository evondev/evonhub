import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CHECKBOX_HIT_AREA_CLASS_NAME } from "@/shared/constants/moderation.constants";
import { ModerationAction } from "@/shared/types";
import { cn, formatThoundsand } from "@/shared/utils";
import { Check, X } from "lucide-react";

interface ModerationListHeaderProps {
  /** Chữ của hàng khi chưa chọn gì, ví dụ "Bình luận" */
  label: string;
  /** Đơn vị trong câu, ví dụ "bình luận" */
  itemLabel: string;
  /** Tên tab đang xem, chữ thường, ví dụ "chờ duyệt"; tab "Tất cả" thì rỗng */
  scopeLabel: string;
  /** Số mục trên trang đang xem */
  itemCount: number;
  /** Số mục khớp bộ lọc trên mọi trang */
  totalCount: number;
  selectedCount: number;
  /** Mọi mục trên trang đang xem đều được chọn */
  isPageFullySelected: boolean;
  isAllMatchingSelected: boolean;
  /** Trong các mục đã chọn có mục chưa duyệt / chưa từ chối */
  canApprove: boolean;
  canReject: boolean;
  /** Việc hàng loạt đang chạy trên đúng các mục đã chọn */
  runningAction?: ModerationAction;
  isDisabled: boolean;
  /** Nút bên phải khi chưa chọn gì, ví dụ "Xoá vĩnh viễn tất cả" ở tab Từ chối */
  trailing?: React.ReactNode;
  onToggleSelectAll: () => void;
  onSelectAllMatching: () => void;
  onClearSelection: () => void;
  onApprove: () => void;
  onReject: () => void;
}

// Dưới sm bỏ icon, nút sát lại: một hàng 375px vừa "Đã chọn 10" và hai nút
const bulkButtonClassName =
  "h-9 whitespace-nowrap rounded-lg px-2.5 sm:h-8 sm:px-3";

// Gói một khối để lúc lưu nút giữ nguyên bề rộng (xem moderation-actions)
const bulkContentClassName = "inline-flex items-center gap-1.5";

// Nút nằm trong câu: chữ đậm gạch chân khi rê, như link
const inlineButtonClassName =
  "inline h-auto min-h-0 p-0 align-baseline font-medium text-foreground underline-offset-4 hover:bg-transparent hover:text-foreground hover:underline";

/**
 * Hàng đầu danh sách: chọn cả trang. Có mục được chọn thì chính hàng này thành
 * thanh hàng loạt, cùng chiều cao, danh sách bên dưới không xô. Đã chọn cả
 * trang mà bộ lọc còn mục ở trang khác thì có thêm một dòng mời chọn cả bộ lọc,
 * như hộp thư: dọn rác hàng chục mục không phải lật từng trang
 */
export function ModerationListHeader({
  label,
  itemLabel,
  scopeLabel,
  itemCount,
  totalCount,
  selectedCount,
  isPageFullySelected,
  isAllMatchingSelected,
  canApprove,
  canReject,
  runningAction,
  isDisabled,
  trailing,
  onToggleSelectAll,
  onSelectAllMatching,
  onClearSelection,
  onApprove,
  onReject,
}: ModerationListHeaderProps) {
  const hasItems = itemCount > 0;
  const hasSelection = selectedCount > 0;
  const hasMorePages = totalCount > itemCount;
  const isOfferingAllMatching =
    !isAllMatchingSelected && isPageFullySelected && hasMorePages;
  const scopeSuffix = scopeLabel ? ` ${scopeLabel}` : "";

  function getSelectAllState() {
    if (hasItems && isPageFullySelected) return true;
    if (hasSelection) return "indeterminate";

    return false;
  }

  return (
    // Đang chọn thì cả khối dính ngay dưới header: chọn mục ở cuối trang vẫn
    // thấy nút duyệt hàng loạt
    <div
      className={cn(
        "border-b border-border bg-surface",
        hasSelection && "sticky top-16 z-10 lg:top-20",
      )}
    >
      <div className="flex h-14 items-center gap-2 px-4 sm:h-12 sm:gap-3 sm:px-5">
        {/* Không có mục thì ẩn ô chọn nhưng giữ chỗ, chữ không xê dịch */}
        <Checkbox
          size="sm"
          checked={getSelectAllState()}
          onCheckedChange={onToggleSelectAll}
          disabled={!hasItems}
          aria-label={
            hasSelection ? "Bỏ chọn tất cả" : "Chọn tất cả trong trang"
          }
          className={cn(CHECKBOX_HIT_AREA_CLASS_NAME, !hasItems && "invisible")}
        />
        {!hasSelection && (
          <>
            <span className="text-xs font-medium text-muted">{label}</span>
            {trailing && <div className="ml-auto">{trailing}</div>}
          </>
        )}
        {hasSelection && (
          <>
            <span className="whitespace-nowrap text-sm font-medium tabular-nums text-foreground">
              Đã chọn {formatThoundsand(selectedCount)}
            </span>
            <Button
              variant="ghost"
              onClick={onClearSelection}
              // Dưới sm không đủ chỗ: bấm ô chọn tất cả (đang chọn dở) cũng là bỏ chọn
              className="-ml-1 hidden h-8 whitespace-nowrap rounded-lg px-2 text-sm font-normal text-muted hover:bg-foreground/5 hover:text-foreground sm:inline-flex"
            >
              Bỏ chọn
            </Button>
            <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
              {canReject && (
                <Button
                  variant="ghost"
                  disabled={isDisabled}
                  isLoading={runningAction === "reject"}
                  onClick={onReject}
                  className={cn(
                    bulkButtonClassName,
                    "text-foreground/70 hover:bg-foreground/[0.08] hover:text-foreground",
                  )}
                >
                  <span className={bulkContentClassName}>
                    <X className="hidden size-4 sm:block" />
                    Từ chối
                    <span className="hidden tabular-nums sm:inline">
                      {formatThoundsand(selectedCount)}
                    </span>
                  </span>
                </Button>
              )}
              {canApprove && (
                <Button
                  variant="primary"
                  disabled={isDisabled}
                  isLoading={runningAction === "approve"}
                  onClick={onApprove}
                  className={bulkButtonClassName}
                >
                  <span className={bulkContentClassName}>
                    <Check className="hidden size-4 sm:block" />
                    Duyệt
                    <span className="hidden tabular-nums sm:inline">
                      {formatThoundsand(selectedCount)}
                    </span>
                  </span>
                </Button>
              )}
            </div>
          </>
        )}
      </div>
      {(isOfferingAllMatching || isAllMatchingSelected) && (
        <p className="text-pretty border-t border-border bg-foreground/[0.03] px-4 py-2.5 text-center text-sm text-muted sm:px-5">
          {isOfferingAllMatching && (
            <>
              Đã chọn {formatThoundsand(itemCount)} {itemLabel} ở trang này.{" "}
              <Button
                variant="ghost"
                disabled={isDisabled}
                onClick={onSelectAllMatching}
                className={inlineButtonClassName}
              >
                Chọn cả {formatThoundsand(totalCount)} {itemLabel}
                {scopeSuffix}
              </Button>
            </>
          )}
          {isAllMatchingSelected && (
            <>
              Đã chọn cả {formatThoundsand(selectedCount)} {itemLabel}
              {scopeSuffix}, kể cả các trang khác.{" "}
              <Button
                variant="ghost"
                disabled={isDisabled}
                onClick={onClearSelection}
                className={inlineButtonClassName}
              >
                Bỏ chọn
              </Button>
            </>
          )}
        </p>
      )}
    </div>
  );
}
