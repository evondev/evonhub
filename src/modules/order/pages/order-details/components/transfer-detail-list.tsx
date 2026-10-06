import { cn } from "@/shared/utils";
import { TransferDetailRow } from "../../../types";
import { CopyValueButton } from "./copy-value-button";

interface TransferDetailListProps {
  rows: TransferDetailRow[];
}

/**
 * Thông tin chuyển khoản, nhãn trên giá trị dưới: cột này hẹp (cạnh QR, cột
 * chính ở 1280px). Dòng khách phải gõ lại thì có nút sao chép ở mép phải.
 */
export function TransferDetailList({ rows }: TransferDetailListProps) {
  return (
    <dl className="space-y-4 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <dt className="text-muted">{row.label}</dt>
            <dd
              className={cn(
                "mt-0.5 font-medium tabular-nums text-foreground [overflow-wrap:anywhere]",
                row.isMono && "font-mono",
                row.isEmphasized && "text-base font-semibold",
              )}
            >
              {row.value}
            </dd>
            {row.hint && (
              <dd className="mt-0.5 text-pretty text-xs text-muted">
                {row.hint}
              </dd>
            )}
          </div>
          {row.copyValue && (
            <CopyValueButton
              value={row.copyValue}
              label={row.label.toLowerCase()}
            />
          )}
        </div>
      ))}
    </dl>
  );
}
