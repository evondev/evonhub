"use client";

import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
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

  console.info(" email-manage.page.tsx:20 - EmailManagePage - emails:", emails);

  return <div>EmailManagePage</div>;
}
