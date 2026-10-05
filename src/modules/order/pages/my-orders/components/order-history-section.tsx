"use client";

import { useState } from "react";
import { MyOrderHistoryItem, MyOrdersHistoryFilter } from "../../../types";
import {
  buildMyOrdersHistoryTabs,
  filterMyOrdersHistory,
} from "../../../utils";
import { OrderHistoryRow } from "./order-history-row";
import { OrderHistoryTabs } from "./order-history-tabs";

interface OrderHistorySectionProps {
  historyItems: MyOrderHistoryItem[];
  /** Mốc "bây giờ" lấy từ server để ngày hiển thị khớp lúc hydrate */
  referenceTime: number;
}

const historyListId = "order-history-list";

export function OrderHistorySection({
  historyItems,
  referenceTime,
}: OrderHistorySectionProps) {
  const [activeFilter, setActiveFilter] =
    useState<MyOrdersHistoryFilter>("all");
  const tabs = buildMyOrdersHistoryTabs(historyItems);
  // Chỉ một trạng thái thì lọc không có gì để chọn
  const hasTabs = tabs.length > 2;
  const visibleItems = filterMyOrdersHistory(historyItems, activeFilter);
  const now = new Date(referenceTime);

  return (
    <section
      aria-labelledby="order-history-title"
      className="rounded-2xl border border-border bg-surface p-2 sm:p-3"
    >
      <div className="flex flex-col gap-3 px-2 pb-2 pt-2 sm:min-h-11 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-3 sm:pt-1">
        <h2
          id="order-history-title"
          className="text-base font-semibold text-foreground"
        >
          Lịch sử đơn hàng
        </h2>
        {hasTabs && (
          <OrderHistoryTabs
            tabs={tabs}
            activeFilter={activeFilter}
            onChange={setActiveFilter}
            controlsId={historyListId}
          />
        )}
      </div>
      <ul id={historyListId} className="flex flex-col gap-0.5">
        {visibleItems.map((historyItem) => (
          <OrderHistoryRow
            key={historyItem.order.id}
            historyItem={historyItem}
            now={now}
          />
        ))}
      </ul>
    </section>
  );
}
