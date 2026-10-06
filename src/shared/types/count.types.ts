/** Một dòng kết quả $group theo trạng thái: _id là giá trị trạng thái, null nếu tài liệu thiếu trường */
export interface StatusCountGroup {
  _id: unknown;
  count: number;
}

/** Kết quả một nhánh $facet kết thúc bằng $count: mảng rỗng khi không có tài liệu nào khớp */
export interface FacetCountItem {
  count: number;
}
