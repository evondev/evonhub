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
import {
  Heading,
  IconArrowLeft,
  IconArrowRight,
  IconPlus,
} from "@/shared/components";
import { LabelStatus, PaginationControl } from "@/shared/components/common";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useQueryEmails } from "../../services";

export interface EmailManagePageProps {}

export function EmailManagePage(_props: EmailManagePageProps) {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
  });
  const { data: emails } = useQueryEmails({
    search: filters.search,
    page: filters.page,
    limit: ITEMS_PER_PAGE,
  });

  return (
    <div>
      <Heading>Quản lý thông báo</Heading>
      <div className="mb-2 flex items-center justify-between px-3 py-2 bgDarkMode borderDarkMode rounded-lg flex-wrap gap-3">
        <div className="flex items-center gap-5"></div>
        <div className="flex gap-3">
          <Input
            placeholder="Tìm kiếm thông báo"
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
              disabled={Number(emails?.length) <= 0}
            >
              <IconArrowRight />
            </PaginationControl>
          </div>
        </div>
        <Input
          placeholder="Tìm kiếm thông báo"
          className="lg:hidden w-full lg:w-[300px] h-10"
          onChange={(e) => setFilters({ search: e.target.value })}
        />
      </div>
      <Link
        href="/admin/email/create"
        className="fixed bottom-10 right-10 z-50 size-10 bg-primary text-white hidden lg:flex items-center justify-center rounded-full"
      >
        <IconPlus />
      </Link>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Đã gửi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails &&
            emails.length > 0 &&
            emails.map((item) => (
              <TableRow key={item.title}>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.content,
                    }}
                    className="line-clamp-5 max-w-sm"
                  ></div>
                </TableCell>
                <TableCell>
                  <LabelStatus className="capitalize">
                    {item.status}
                  </LabelStatus>
                </TableCell>
                <TableCell>
                  <strong>{item.recipients.length}</strong> emails
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
