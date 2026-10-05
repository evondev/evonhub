import { AppTooltip } from "@/shared/components/common";
import { SEARCH_KEYWORD_MAX_LENGTH } from "@/shared/constants/search.constants";
import { truncateKeyword } from "@/shared/utils";

interface OrderSearchKeywordProps {
  keyword: string;
}

/** Từ khoá trong câu báo rỗng, trong ngoặc kép; dài quá thì cắt, rê vào thấy đủ */
export function OrderSearchKeyword({ keyword }: OrderSearchKeywordProps) {
  const shownKeyword = truncateKeyword(keyword, SEARCH_KEYWORD_MAX_LENGTH);
  const keywordLabel = (
    <span className="text-foreground">“{shownKeyword}”</span>
  );

  if (shownKeyword === keyword) return keywordLabel;

  return (
    <AppTooltip content={keyword} isWrapped>
      {keywordLabel}
    </AppTooltip>
  );
}
