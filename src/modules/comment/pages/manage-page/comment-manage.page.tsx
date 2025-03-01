"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserContext } from "@/components/user-context";
import {
  Heading,
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
  IconDelete,
} from "@/shared/components";
import { LabelStatus, PaginationControl } from "@/shared/components/common";
import { CommentStatus } from "@/shared/constants/comment.constants";
import {
  commonStatus,
  ITEMS_PER_PAGE,
  statusActions,
} from "@/shared/constants/common.constants";
import { cn, formatDate } from "@/shared/utils";
import Image from "next/image";
import Link from "next/link";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useQueryCommentsManage } from "../../services";
import { userMutationUpdateComment } from "../../services/data/mutation-update-comment.data";

export interface CommentManagePageProps {}

export function CommentManagePage(_props: CommentManagePageProps) {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    isFree: parseAsBoolean.withDefault(false),
    page: parseAsInteger.withDefault(1),
    status: parseAsString.withDefault(""),
  });
  const { userInfo } = useUserContext();
  const { data: comments } = useQueryCommentsManage({
    userId: userInfo?.clerkId || "",
    search: filters.search,
    page: filters.page,
    limit: ITEMS_PER_PAGE,
    status: filters.status as CommentStatus,
  });

  const mutationUpdateComment = userMutationUpdateComment();

  const handleChangeStatus = (
    commentId: string,
    status: CommentStatus,
    userId: string
  ) => {
    Swal.fire({
      title: "Thay đổi trạng thái bình luận?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await mutationUpdateComment.mutateAsync({
          commentId,
          userId,
          status:
            status === CommentStatus.Approved
              ? CommentStatus.Pending
              : CommentStatus.Approved,
        });
        toast.success("Thay đổi trạng thái thành công");
      }
    });
  };

  return (
    <div>
      <Heading className="lg:min-h-10">Quản lý bình luận</Heading>
      <div className="mb-2 flex items-center justify-between px-3 py-2 bgDarkMode borderDarkMode rounded-lg flex-wrap gap-3">
        <div className="flex items-center gap-5">
          <div className="hidden lg:flex gap-3">
            {statusActions.map((item, index) => (
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
          <Input
            placeholder="Tìm kiếm bình luận"
            className="hidden lg:block w-full lg:w-[300px] h-10"
            onChange={(e) => setFilters({ search: e.target.value })}
          />
          <div className="flex justify-end gap-3">
            <PaginationControl
              onClick={() => setFilters({ page: filters.page - 1 })}
              disabled={filters.page <= 1}
            >
              <IconArrowLeft />
            </PaginationControl>
            <PaginationControl
              onClick={() => setFilters({ page: filters.page + 1 })}
              disabled={Number(comments?.length) <= 0}
            >
              <IconArrowRight />
            </PaginationControl>
          </div>
        </div>
        <Input
          placeholder="Tìm kiếm bình luận"
          className="lg:hidden w-full lg:w-[300px] h-10"
          onChange={(e) => setFilters({ search: e.target.value })}
        />
      </div>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>Thành viên</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments &&
            comments.length > 0 &&
            comments.map((comment) => (
              <TableRow key={comment._id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Image
                      src={comment.user?.avatar}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full shrink-0 object-cover border borderDarkMode"
                    />
                    <div className="flex flex-col">
                      <h4 className="font-bold text-sm lg:text-base">
                        {comment.user?.name}
                      </h4>
                      <h5 className="text-xs lg:text-sm mb-2">
                        {comment.user?.email}
                      </h5>
                      <span className="text-slate-400 text-xs font-medium">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="whitespace-nowrap pl-10 lg:pl-0">
                    {comment.content}
                    <Link
                      href={`/${comment.lesson?.courseId?.slug}/lesson?id=${comment.lesson?._id}#${comment._id}`}
                      className="inline ml-2 font-semibold underline"
                    >
                      Xem bài học
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <LabelStatus
                    className={cn(
                      commonStatus[comment.status].className,
                      "cursor-pointer"
                    )}
                    onClick={() =>
                      handleChangeStatus(
                        comment._id,
                        comment.status,
                        comment.user?._id || ""
                      )
                    }
                  >
                    {commonStatus[comment.status].text}
                  </LabelStatus>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="size-8 flex items-center justify-center border borderDarkMode rounded p-2 transition-all hover:text-gray-500 dark:hover:text-opacity-80"
                    >
                      <IconDelete />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
