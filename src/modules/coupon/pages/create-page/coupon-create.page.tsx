"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useQueryCourses } from "@/modules/course/services";
import { CourseItemData } from "@/modules/course/types";
import { Heading } from "@/shared/components";
import { Tag } from "@/shared/components/tag";
import { CouponStatus, CouponType } from "@/shared/constants/coupon.constants";
import { CourseStatus } from "@/shared/constants/course.constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "react-toastify";
import { createCouponSchema } from "../../schemas";
import { userMutationCreateCoupon } from "../../services";
import { CreateCouponFormValues } from "../../types";

export interface CouponCreatePageProps {}

export function CouponCreatePage(_props: CouponCreatePageProps) {
  const [selectedCourses, setSelectedCourses] = useState<
    {
      courseId: string;
      title: string;
    }[]
  >([]);
  const router = useRouter();

  const mutationCreateCoupon = userMutationCreateCoupon();
  const [isPercentage, setIsPercentage] = useState(false);

  const [date, setDate] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const form = useForm<CreateCouponFormValues>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {},
  });
  const { data: courses } = useQueryCourses({
    status: CourseStatus.Approved,
    isUpdateViews: false,
  });

  async function onSubmit(values: CreateCouponFormValues) {
    try {
      const response = await mutationCreateCoupon.mutateAsync({
        ...values,
        amount: parseInt(values.amount),
        limit: values.limit || 0,
        startDate: date.startDate,
        endDate: date.endDate,
        courses: selectedCourses.map((course) => course.courseId),
        type: isPercentage ? CouponType.Percentage : CouponType.Fixed,
        status: values.status || CouponStatus.Active,
      });

      if (!response) {
        toast.error("Tạo mã giảm giá thất bại");
        return;
      }

      toast.success("Tạo mã giảm giá thành công");
      router.push("/admin/coupon/manage");
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleSelectCourse = (checked: boolean, course: CourseItemData) => {
    if (checked) {
      setSelectedCourses((prev) => [
        ...prev,
        {
          courseId: course._id,
          title: course.title,
        },
      ]);
    } else {
      setSelectedCourses((prev) =>
        prev.filter((item) => item.courseId !== course._id)
      );
    }
  };
  return (
    <div>
      <Heading>Tạo mã giảm giá</Heading>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
          <div className="grid lg:grid-cols-3 gap-5 mb-10">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề *</FormLabel>
                  <FormControl>
                    <Input placeholder="Tiêu đề" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="PTS20K"
                      className="uppercase"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tiền</FormLabel>
                  <FormControl>
                    <NumericFormat
                      className={cn(
                        "flex h-12 file:border-0 file:bg-transparent file:text-sm file:font-medium   focus-primary form-styles w-40"
                      )}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới hạn sử dụng</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="20"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date.startDate, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Calendar
                          mode="single"
                          selected={date.startDate}
                          onSelect={(date) =>
                            date &&
                            setDate((prev) => ({ ...prev, startDate: date }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? (
                            format(date.endDate, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date.endDate}
                          onSelect={(date) =>
                            date &&
                            setDate((prev) => ({ ...prev, endDate: date }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem className="flex items-center gap-2">
              <FormLabel>Coupon phần trăm</FormLabel>
              <FormControl>
                <Switch
                  checked={isPercentage}
                  onCheckedChange={(checked) => {
                    setIsPercentage(checked);
                    form.setValue(
                      "type",
                      checked ? CouponType.Percentage : CouponType.Fixed
                    );
                  }}
                  className="!mt-0"
                />
              </FormControl>
            </FormItem>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Trạng thái</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value === CouponStatus.Active}
                      onCheckedChange={(checked) => {
                        field.onChange(
                          checked ? CouponStatus.Active : CouponStatus.InActive
                        );
                      }}
                      className="!mt-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name="courses"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="w-full">
                        <Button variant="outline">Chọn khóa học</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-full h-[220px] overflow-y-auto"
                      >
                        {courses?.map((course) => (
                          <DropdownMenuCheckboxItem
                            key={course._id}
                            checked={selectedCourses.some(
                              (item) => item.courseId === course._id
                            )}
                            onCheckedChange={(checked) =>
                              handleSelectCourse(checked, course)
                            }
                          >
                            {course.title}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-3">
              {selectedCourses.length > 0 &&
                selectedCourses.map((course) => (
                  <Tag key={course.title}>{course.title}</Tag>
                ))}
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-fit ml-auto flex mt-10"
            isLoading={mutationCreateCoupon.isPending}
          >
            Tạo mã giảm giá
          </Button>
        </form>
      </Form>
    </div>
  );
}
