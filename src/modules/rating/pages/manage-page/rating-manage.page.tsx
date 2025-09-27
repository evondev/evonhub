"use client";

import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { reactions } from "@/constants";
import { cn } from "@/lib/utils";
import {
  Heading,
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
} from "@/shared/components";
import { PaginationControl } from "@/shared/components/common";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import {
  RatingStatus,
  ratingStatusActions,
} from "@/shared/constants/rating.constants";
import { formatDate } from "@/utils";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import Swal from "sweetalert2";
import { userMutationRatingStatus } from "../../services/data/mutation-rating-status.data";
import { useQueryRatings } from "../../services/data/query-ratings";
import { RatingItemData } from "../../types";

export interface RatingManagePageProps {}

export function RatingManagePage(_props: RatingManagePageProps) {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
    status: parseAsString.withDefault(""),
  });
  const { data: ratings } = useQueryRatings({
    page: filters.page,
    limit: ITEMS_PER_PAGE,
    status: filters.status as RatingStatus,
  });

  const mutationRatingStatus = userMutationRatingStatus();

  const handleRatingStatusChange = async (rating: RatingItemData) => {
    Swal.fire({
      title: "Bạn chắc chứ?",
      text: "Bạn có chắc muốn thay đổi trạng thái của đánh giá này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await mutationRatingStatus.mutateAsync({
          ratingId: rating._id,
          status: rating.status,
        });
      }
    });
  };

  return (
    <>
      <Heading className="lg:min-h-10 mb-5">Quản lý đánh giá</Heading>
      <div className="mb-2 flex items-center justify-between px-3 py-2 bgDarkMode borderDarkMode rounded-lg flex-wrap gap-3">
        <div className="flex items-center gap-5">
          <div className="flex gap-3">
            {ratingStatusActions.map((item, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-2 h-7",
                  item.className
                )}
                onClick={() => setFilters({ status: item.value })}
              >
                {item.text}
                {filters.status === item.value && (
                  <IconCircleCheck className="size-4" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex justify-end gap-3">
            <PaginationControl
              onClick={debounce(
                () => setFilters({ page: filters.page - 1 }),
                300
              )}
              disabled={filters.page <= 1}
            >
              <IconArrowLeft />
            </PaginationControl>
            <PaginationControl
              onClick={debounce(
                () => setFilters({ page: filters.page + 1 }),
                300
              )}
              disabled={Number(ratings?.length) <= 0}
            >
              <IconArrowRight />
            </PaginationControl>
          </div>
        </div>
      </div>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratings &&
            ratings.length > 0 &&
            ratings
              .filter((rating) => !!rating.course?.slug)
              .map((rating) => {
                const icon = reactions.find(
                  (reaction) => reaction.rating === rating.rating
                )?.icon;
                return (
                  <TableRow key={rating._id}>
                    <TableCell>
                      <Link
                        href={`/course/${rating.course?.slug}`}
                        className="flex items-center gap-3"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Image
                          className="size-10 rounded-md border borderDarkMode object-cover shrink-0"
                          src={rating.course?.image}
                          alt={rating.course?.title}
                          width={40}
                          height={40}
                        ></Image>
                        <div className="text-xs lg:text-sm font-semibold w-[200px]">
                          {rating.course?.title}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/user/manage?search=${rating.user?.email}`}
                        className="flex items-center gap-3 whitespace-nowrap"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          alt=""
                          src={rating.user?.avatar}
                          className="size-8 rounded-full object-cover border borderDarkMode"
                          width={32}
                          height={32}
                          loading="lazy"
                        />
                        <div className="text-xs lg:text-sm font-semibold">
                          {rating.user?.username}
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell>
                      <div className="max-w-md text-left lg:text-balance font-medium leading-relaxed w-[300px] lg:w-auto">
                        {rating.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={rating.status === RatingStatus.Active}
                        onCheckedChange={() => handleRatingStatusChange(rating)}
                      />
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {formatDate(rating.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </>
  );
}
