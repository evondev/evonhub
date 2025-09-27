"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  IconEye,
} from "@/shared/components";
import { PaginationControl } from "@/shared/components/common";
import { CommentStatus } from "@/shared/constants/comment.constants";
import {
  ITEMS_PER_PAGE,
  statusActions,
} from "@/shared/constants/common.constants";
import { cn, formatDate } from "@/shared/utils";
import { debounce } from "lodash";
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
    <>
      <Heading className="lg:min-h-10 mb-5">Quản lý bình luận</Heading>
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
          {/* <Input
            placeholder="Tìm kiếm bình luận"
            className="hidden lg:block w-full lg:w-[300px] h-10"
            onChange={(e) => setFilters({ search: e.target.value })}
          /> */}
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
            <TableHead>Member</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">&nbsp;</TableHead>
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
                      width={32}
                      height={32}
                      className="rounded-full shrink-0 object-cover border borderDarkMode"
                    />
                    <div className="flex flex-col">
                      <h4 className="font-bold text-sm">
                        {comment.user?.name}
                      </h4>
                      <h5 className="text-xs mb-2">{comment.user?.email}</h5>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="whitespace-nowrap pl-10 lg:pl-0">
                    {comment.content.slice(0, 50)}...
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-slate-400 font-medium">
                    {formatDate(comment.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={comment.status === "approved"}
                    onCheckedChange={(checked) =>
                      handleChangeStatus(
                        comment._id,
                        comment.status,
                        comment.user?._id || ""
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-4">
                    <Link
                      href={`/${comment.lesson?.courseId?.slug}/lesson?id=${comment.lesson?._id}#${comment._id}`}
                      target="_blank"
                      className="size-8 flex items-center justify-center"
                    >
                      <IconEye />
                    </Link>
                    <button
                      type="button"
                      className="size-8 flex items-center justify-center"
                    >
                      <IconDelete />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
