"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  actionClassName,
  baseStatusClassName,
  commonStatus,
} from "@/constants";
import { deleteComment, updateComment } from "@/lib/actions/comment.action";
import { cn } from "@/lib/utils";
import { ICommentParams } from "@/types";
import { ECommonStatus } from "@/types/enums";
import { formUrlQuery, formatDate } from "@/utils";
import { debounce } from "lodash";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { IconDelete } from "../icons";
import { Input } from "../ui/input";

const CommentManage = ({ commentList }: { commentList: ICommentParams[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleFilter = (filter: string) => {
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "search",
      value: filter,
    });
    router.push(newUrl);
  };
  const handleChangeStatus = async (
    id: string,
    status: ECommonStatus,
    userId: string
  ) => {
    try {
      Swal.fire({
        title: "Bạn chắc chứ?",
        text: "Bạn có chắc muốn thay đổi trạng thái của bình luận này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await updateComment({
            commentId: id,
            userId,
            updateData: {
              status:
                status === ECommonStatus.APPROVED
                  ? ECommonStatus.PENDING
                  : ECommonStatus.APPROVED,
            },
            path: "/admin/comment/manage",
          });
          toast.success("Thay đổi trạng thái thành công");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="hidden lg:block">
      <div className="mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">Quản lý thảo luận</h1>
        <Input
          placeholder="Tìm kiếm..."
          className="w-full lg:w-[300px]"
          onChange={debounce((e) => handleFilter(e.target.value), 300)}
        />
      </div>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox />
            </TableHead>
            <TableHead>Thông tin</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead>Bài học</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commentList.length === 0 && (
            <TableRow>
              <TableCell colSpan={999} className="text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
          {commentList.map((comment) => (
            <TableRow key={comment._id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <h4 className="font-bold text-xs lg:text-base">
                    {comment.user?.username}
                  </h4>
                  <span className="text-slate-400 font-medium">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              </TableCell>
              <TableCell>{comment.content}</TableCell>
              <TableCell className="whitespace-nowrap">
                <h4 className="font-bold">{comment.course?.title}</h4>
                <Link
                  href={`/${comment.course.slug}/lesson?slug=${comment.lesson.slug}`}
                  target="_blank"
                  className="transition-all underline text-primary"
                >
                  {comment.lesson?.title}
                </Link>
              </TableCell>
              <TableCell>
                <button
                  className={cn(
                    baseStatusClassName,
                    commonStatus[comment.status].className
                  )}
                  onClick={() =>
                    handleChangeStatus(
                      comment._id,
                      comment.status,
                      comment.user._id
                    )
                  }
                >
                  {commonStatus[comment.status].text}
                </button>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4 justify-center text-gray-400 dark:text-white">
                  <button
                    className={cn(actionClassName)}
                    onClick={() => {
                      Swal.fire({
                        title: "Bạn chắc chứ?",
                        text: "Bạn có chắc muốn xóa bình luận này?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Đồng ý",
                        cancelButtonText: "Hủy",
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          await deleteComment(comment._id);
                          toast.success("Xóa bình luận thành công");
                        }
                      });
                    }}
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
};

export default CommentManage;
