"use client";

import { useUserContext } from "@/components/user-context";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { invalidateQueriesByKeys } from "@/shared/helpers/query-helper";
import { cn } from "@/shared/utils";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import {
  SUPPORT_ADMIN_FRAME_HEIGHT_CLASS_NAME,
  supportInboxFilters,
} from "../../constants";
import { useSupportChannel } from "../../hooks/use-support-channel";
import { useQuerySupportInbox } from "../../services/data";
import { SupportInboxFilter } from "../../types";
import {
  SupportConversationPanel,
  SupportConversationPlaceholder,
  SupportInboxList,
} from "./components";

/**
 * Hộp thư của Admin. Màn rộng: danh sách bên trái, khung chat bên phải. Màn
 * hẹp: chọn hội thoại thì khung chat thay chỗ danh sách. Hội thoại đang mở lưu
 * trên URL để tải lại trang vẫn đúng chỗ
 */
export function SupportInboxPage() {
  const { userInfo } = useUserContext();
  const [params, setParams] = useQueryStates({
    conversation: parseAsString.withDefault(""),
    filter: parseAsStringLiteral(supportInboxFilters).withDefault("all"),
  });
  const {
    data: inbox,
    isPending,
    refetch,
  } = useQuerySupportInbox(params.filter);
  const hasSelection = Boolean(params.conversation);

  useSupportChannel(userInfo?._id ? String(userInfo._id) : "", () => {
    invalidateQueriesByKeys(
      QUERY_KEYS.GET_SUPPORT_INBOX,
      QUERY_KEYS.GET_SUPPORT_CONVERSATION,
    );
  });

  function handleFilterChange(filter: SupportInboxFilter) {
    setParams({ filter });
  }

  function handleSelect(conversationId: string) {
    setParams({ conversation: conversationId });
  }

  function handleBack() {
    setParams({ conversation: "" });
  }

  return (
    <section
      className={cn(
        "flex overflow-hidden rounded-2xl border border-border bg-surface",
        SUPPORT_ADMIN_FRAME_HEIGHT_CLASS_NAME,
      )}
    >
      <div
        className={cn(
          "min-h-0 w-full flex-col border-border lg:flex lg:w-80 lg:shrink-0 lg:border-r",
          hasSelection && "hidden",
          !hasSelection && "flex",
        )}
      >
        <SupportInboxList
          inbox={inbox}
          filter={params.filter}
          selectedConversationId={params.conversation}
          isLoading={isPending}
          onFilterChange={handleFilterChange}
          onSelect={handleSelect}
          onRetry={refetch}
        />
      </div>
      <div
        className={cn(
          "min-h-0 min-w-0 flex-1 flex-col lg:flex",
          hasSelection && "flex",
          !hasSelection && "hidden",
        )}
      >
        {hasSelection && (
          // key: đổi hội thoại thì ô soạn và hộp khoá về trạng thái mới
          <SupportConversationPanel
            key={params.conversation}
            conversationId={params.conversation}
            onBack={handleBack}
          />
        )}
        {!hasSelection && <SupportConversationPlaceholder />}
      </div>
    </section>
  );
}
