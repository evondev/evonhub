export enum RatingStatus {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}
export const ratingStatus: Record<
  RatingStatus,
  {
    text: string;
    className: string;
  }
> = {
  [RatingStatus.Active]: {
    text: "Đã duyệt",
    className: "bg-green-500 text-green-500",
  },
  [RatingStatus.Inactive]: {
    text: "Chờ duyệt",
    className: "bg-orange-500 text-orange-500",
  },
};

export const ratingStatusActions = [
  {
    text: "Tất cả",
    value: "",
    className:
      "bg-gray-100 text-gray-500 border border-gray-500 dark:bg-grayDarkest dark:text-gray-200",
  },
  {
    text: "Đã duyệt",
    value: RatingStatus.Active,
    className: "bg-green-100 text-green-500 border border-green-500",
  },
  {
    text: "Chờ duyệt",
    value: RatingStatus.Inactive,
    className: "bg-orange-100 text-orange-500 border border-orange-500",
  },
];
