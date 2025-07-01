"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  CourseList,
  Heading,
  IconArrowLeft,
  IconArrowRight,
} from "@/shared/components";
import { PaginationControl } from "@/shared/components/common";
import { CourseStatus } from "@/shared/constants/course.constants";
import { debounce } from "lodash";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { CourseItem } from "../../components";
import { useQueryCourses } from "../../services";

export interface ExplorePageProps {}

export function ExplorePage(_props: ExplorePageProps) {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    page: parseAsInteger.withDefault(1),
    isFree: parseAsBoolean.withDefault(false),
  });
  const { data: courses, isFetching } = useQueryCourses({
    status: CourseStatus.Approved,
    limit: 8,
    page: filters.page,
    search: filters.search,
    isFree: filters.isFree,
  });
  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({ search: value });
  }, 500);

  return (
    <div>
      <Heading>Khám phá</Heading>
      <div className="mb-8 flex items-center justify-between px-3 py-2 bgDarkMode borderDarkMode rounded-lg flex-wrap gap-3">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 text-sm font-medium">
            <Switch
              checked={filters.isFree}
              onCheckedChange={(checked) => setFilters({ isFree: checked })}
            />
            <Label
              htmlFor="paidUser"
              className="hidden lg:flex items-center gap-2 cursor-pointer"
            >
              <span>Khóa học miễn phí</span>
            </Label>
          </div>
        </div>
        <div className="flex gap-3">
          <Input
            placeholder="Tìm kiếm khóa học"
            className="hidden lg:block w-full lg:w-[300px] h-10"
            onChange={handleSearch}
            defaultValue={filters.search}
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
              disabled={Number(courses?.length) <= 0}
            >
              <IconArrowRight />
            </PaginationControl>
          </div>
        </div>
        <Input
          placeholder="Tìm kiếm khóa học"
          className="lg:hidden w-full lg:w-[300px] h-10"
          onChange={handleSearch}
          defaultValue={filters.search}
        />
      </div>
      <CourseList isLoading={isFetching}>
        {courses?.map((course, index) => (
          <CourseItem key={index} data={course}></CourseItem>
        ))}
      </CourseList>
    </div>
  );
}
