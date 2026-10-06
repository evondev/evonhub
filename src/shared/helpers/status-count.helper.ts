import type { FilterQuery, PipelineStage } from "mongoose";
import { FacetCountItem, StatusCountGroup } from "../types/count.types";

/**
 * Đếm số tài liệu của từng trạng thái trong một lần aggregate, thay cho mỗi tab
 * một countDocuments. Lưu ý: $match không tự ép chuỗi sang ObjectId như find(),
 * bộ lọc theo id phải truyền sẵn ObjectId.
 */
export function buildStatusCountPipeline(
  match: FilterQuery<unknown>,
  statusField = "status",
): PipelineStage[] {
  return [
    { $match: match },
    { $group: { _id: `$${statusField}`, count: { $sum: 1 } } },
  ];
}

/** Đổi kết quả $group sang Map trạng thái → số tài liệu */
export function toStatusCountMap(
  groups: StatusCountGroup[],
): Map<string, number> {
  return new Map(groups.map((group) => [String(group._id), group.count]));
}

/**
 * Số tài liệu của một trạng thái; không truyền trạng thái thì cộng mọi nhóm,
 * kể cả tài liệu thiếu trường trạng thái (đúng như countDocuments không lọc)
 */
export function getStatusCount(
  statusCountMap: Map<string, number>,
  status?: string,
): number {
  if (status) return statusCountMap.get(status) ?? 0;

  let totalCount = 0;

  statusCountMap.forEach((count) => {
    totalCount += count;
  });

  return totalCount;
}

/** Số đếm của một nhánh $facet kết thúc bằng $count, nhánh rỗng là 0 */
export function readFacetCount(facetItems?: FacetCountItem[]): number {
  return facetItems?.[0]?.count ?? 0;
}
