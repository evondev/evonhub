"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/shared/utils";
import dayjs from "dayjs";
import { CalendarDays, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  ACTIVITY_DATE_ALL_LABEL,
  ACTIVITY_DATE_FORMAT,
  ACTIVITY_RETENTION_DAYS,
} from "../../../constants";
import { ActivityDateRange } from "../../../types";
import {
  buildActivityDatePresets,
  findActivityDatePreset,
  formatActivityDateRangeLabel,
} from "../../../utils";

interface ActivityDateFilterProps {
  /** YYYY-MM-DD; rỗng là không chặn đầu */
  from: string;
  /** YYYY-MM-DD, tính cả ngày này; rỗng là không chặn cuối */
  to: string;
  onChange: (dateRange: ActivityDateRange) => void;
  className?: string;
}

const emptyDateRange: ActivityDateRange = { from: "", to: "" };

const presetItemClassName =
  "h-9 w-full justify-between gap-2 rounded-lg px-2.5 text-sm font-normal";

// Ghi đè màu slate mặc định của Calendar bằng màu của app
const calendarClassNames = {
  head_cell: "w-9 rounded-md text-[0.8rem] font-normal text-muted",
  cell: "relative size-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md [&:has([aria-selected].day-range-end)]:rounded-r-md",
  day_selected:
    "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white",
  day_today: "font-semibold text-primary",
  day_range_middle:
    "aria-selected:bg-transparent aria-selected:text-foreground aria-selected:font-normal",
  day_outside: "day-outside text-muted opacity-50",
  day_disabled: "text-muted opacity-40",
};

function toCalendarDate(date: string): Date | undefined {
  return date ? dayjs(date).toDate() : undefined;
}

/**
 * Nút "Ngày" mở menu: lựa chọn nhanh bên trái, lịch bên phải. Trên lịch, bấm
 * lần đầu là lọc luôn ngày đó (menu vẫn mở), bấm thêm ngày nữa là thành khoảng
 * và đóng menu
 */
export function ActivityDateFilter({
  from,
  to,
  onChange,
  className,
}: ActivityDateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Ngày bấm đầu tiên trên lịch, đang chờ ngày thứ hai để thành khoảng
  const [pendingStartDate, setPendingStartDate] = useState("");

  const today = dayjs();
  const presets = buildActivityDatePresets(today);
  const activePreset = findActivityDatePreset(presets, from, to);
  const rangeLabel = formatActivityDateRangeLabel(presets, from, to);
  const hasDateFilter = Boolean(from || to);
  const oldestDate = today
    .subtract(ACTIVITY_RETENTION_DAYS - 1, "day")
    .startOf("day")
    .toDate();

  function handleOpenChange(nextIsOpen: boolean) {
    setIsOpen(nextIsOpen);
    setPendingStartDate("");
  }

  function applyDateRange(dateRange: ActivityDateRange) {
    onChange(dateRange);
    handleOpenChange(false);
  }

  function handleDayPick(pickedDay: Date) {
    const pickedDate = dayjs(pickedDay).format(ACTIVITY_DATE_FORMAT);

    if (!pendingStartDate) {
      setPendingStartDate(pickedDate);
      onChange({ from: pickedDate, to: pickedDate });
      return;
    }

    const isBeforeStart = pickedDate < pendingStartDate;

    applyDateRange({
      from: isBeforeStart ? pickedDate : pendingStartDate,
      to: isBeforeStart ? pendingStartDate : pickedDate,
    });
  }

  return (
    // modal={false}: menu mở không khoá cuộn trang, như nút lọc khoá học
    <Popover open={isOpen} onOpenChange={handleOpenChange} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-11 min-w-0 shrink-0 gap-1.5 whitespace-nowrap px-3 hover:bg-surface data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/15 md:h-10",
            className,
          )}
        >
          <CalendarDays className="size-4 shrink-0 text-muted" />
          {/* Giờ server và trình duyệt có thể khác ngày, chữ "Hôm nay" lệch lúc hydrate */}
          <span
            suppressHydrationWarning
            className={cn("text-foreground", hasDateFilter && "font-medium")}
          >
            {rangeLabel || "Ngày"}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex w-auto flex-col rounded-xl border-border bg-surface p-0 text-foreground shadow-lg dark:border-border dark:bg-surface dark:text-foreground sm:flex-row"
      >
        <div className="flex flex-col gap-1 border-b border-border p-1 sm:w-44 sm:border-b-0 sm:border-r">
          <Button
            variant="ghost"
            onClick={() => applyDateRange(emptyDateRange)}
            aria-current={!hasDateFilter ? "true" : undefined}
            className={cn(
              presetItemClassName,
              !hasDateFilter && "bg-item-active font-medium",
              hasDateFilter && "text-foreground/80 hover:bg-item-hover",
            )}
          >
            {ACTIVITY_DATE_ALL_LABEL}
            <Check
              aria-hidden
              className={cn("size-4 shrink-0", hasDateFilter && "invisible")}
            />
          </Button>
          {presets.map((preset) => {
            const isCurrent = preset.key === activePreset?.key;

            return (
              <Button
                key={preset.key}
                variant="ghost"
                onClick={() =>
                  applyDateRange({ from: preset.from, to: preset.to })
                }
                aria-current={isCurrent ? "true" : undefined}
                className={cn(
                  presetItemClassName,
                  isCurrent && "bg-item-active font-medium",
                  !isCurrent && "text-foreground/80 hover:bg-item-hover",
                )}
              >
                {preset.label}
                <Check
                  aria-hidden
                  className={cn("size-4 shrink-0", !isCurrent && "invisible")}
                />
              </Button>
            );
          })}
        </div>
        <div className="flex flex-col items-center">
          <Calendar
            mode="range"
            selected={{ from: toCalendarDate(from), to: toCalendarDate(to) }}
            onSelect={(_range, pickedDay) => handleDayPick(pickedDay)}
            defaultMonth={toCalendarDate(to) || today.toDate()}
            disabled={[{ after: today.toDate() }, { before: oldestDate }]}
            weekStartsOn={1}
            classNames={calendarClassNames}
          />
          <p className="px-3 pb-3 text-xs text-muted">
            {pendingStartDate
              ? "Bấm thêm một ngày để chọn khoảng"
              : `Nhật ký giữ ${ACTIVITY_RETENTION_DAYS} ngày gần nhất`}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
