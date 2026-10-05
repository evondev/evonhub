"use client";

import { Button } from "@/components/ui/button";
import { buildPaginationItems, cn, formatThoundsand } from "@/shared/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  formatUserRange,
  getUserManageTotalPages,
} from "../../../utils/user-manage.utils";

interface UserTablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

const pageButtonClassName =
  "h-9 min-w-9 rounded-lg border border-transparent px-2 text-sm font-medium tabular-nums";

/** Đếm bên trái, ‹ trang › bên phải. Dưới sm chỉ còn tổng và "‹ 3 / 435 ›" */
export function UserTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
}: UserTablePaginationProps) {
  const totalPages = getUserManageTotalPages(total, pageSize);
  const hasManyPages = totalPages > 1;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 sm:px-5">
      <p className="text-sm tabular-nums text-muted">
        {hasManyPages && (
          <span className="hidden sm:inline">
            {formatUserRange(page, pageSize, total)} trong{" "}
          </span>
        )}
        {formatThoundsand(total)} thành viên
      </p>
      {hasManyPages && (
        <nav aria-label="Phân trang" className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Trang trước"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="size-9 rounded-lg text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="px-2 text-sm tabular-nums text-foreground sm:hidden">
            {page} / {formatThoundsand(totalPages)}
          </span>
          <div className="hidden items-center gap-1 sm:flex">
            {buildPaginationItems(page, totalPages).map((item, index) => {
              if (item === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    aria-hidden="true"
                    className="grid size-9 place-items-center text-sm text-muted"
                  >
                    …
                  </span>
                );
              }

              const isCurrent = item === page;

              return (
                <Button
                  key={item}
                  variant="ghost"
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={() => onPageChange(item)}
                  className={cn(
                    pageButtonClassName,
                    isCurrent &&
                      "bg-item-active text-foreground hover:bg-item-active hover:text-foreground",
                    !isCurrent &&
                      "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                  )}
                >
                  {formatThoundsand(item)}
                </Button>
              );
            })}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Trang sau"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="size-9 rounded-lg text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </Button>
        </nav>
      )}
    </div>
  );
}
