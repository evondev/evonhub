import { PreviewStateSwitcher } from "@/shared/components/common";
import { PREVIEW_EXPLORE_STATE_LINKS } from "../../constants";
import { ExploreFilters, ExplorePreviewState } from "../../types";
import { buildPreviewExploreResult } from "../../utils";
import {
  ExploreFilterBar,
  ExploreLoadError,
  ExploreResults,
  ExploreSkeleton,
} from "./components";

interface ExplorePreviewPageProps {
  state: ExplorePreviewState;
  filters: ExploreFilters;
}

/**
 * Trang xem trước trang Khóa học bằng khóa giả. Không đọc hay ghi DB. Route chỉ
 * mở ở dev.
 */
export function ExplorePreviewPage({
  state,
  filters,
}: ExplorePreviewPageProps) {
  const linkBase = { basePath: "/explore-preview", fixedParams: { tt: state } };
  // Trạng thái "không có kết quả" cần một từ khóa để khác trạng thái "chưa có khóa"
  const shownFilters =
    state === "khong-ket-qua" && !filters.search
      ? { ...filters, search: "React Native" }
      : filters;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PreviewStateSwitcher
        links={PREVIEW_EXPLORE_STATE_LINKS}
        currentState={state}
      />
      <ExploreFilterBar filters={shownFilters} linkBase={linkBase} />
      {state === "dang-tai" && <ExploreSkeleton />}
      {state === "loi" && <ExploreLoadError />}
      {!["dang-tai", "loi"].includes(state) && (
        <ExploreResults
          result={buildPreviewExploreResult(state, shownFilters)}
          filters={shownFilters}
          linkBase={linkBase}
        />
      )}
    </div>
  );
}
