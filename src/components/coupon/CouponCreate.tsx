"use client";

import { primaryButtonClassName } from "@/constants";
import { createCoupon } from "@/lib/actions/coupon.action";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useImmer } from "use-immer";
import { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
const createCouponSchema = z.object({
  title: z.string(),
  code: z.string(),
  amount: z.number(),
  limit: z.number().optional(),
  course: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});
const CouponCreate = ({ courses }: { courses: any[] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourses, setSelectedCourses] = useImmer<any[]>([]);
  console.log("CouponCreate ~ selectedCourses:", selectedCourses);
  const router = useRouter();
  const form = useForm<z.infer<typeof createCouponSchema>>({
    resolver: zodResolver(createCouponSchema),
    defaultValues: {},
  });
  async function onSubmit(values: z.infer<typeof createCouponSchema>) {
    setIsSubmitting(true);
    try {
      const res = await createCoupon(values);
    } catch (error) {}
  }
  const [date, setDate] = useState<Date>();
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-10 mb-10">
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
                    <Input placeholder="PTS20K" {...field} />
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
                      valueIsNumericString
                      thousandSeparator
                      className={cn(
                        "flex h-10 file:border-0 file:bg-transparent file:text-sm file:font-medium   focus-primary form-styles w-40"
                      )}
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
                          {date ? format(date, "PPP") : <span>Chọn ngày</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
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
                          {date ? format(date, "PPP") : <span>Chọn ngày</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
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
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khóa học</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value: any) => {
                        setSelectedCourses((draft) => {
                          // filterr if course already exists
                          if (
                            !draft.find((course) => course.slug === value.slug)
                          ) {
                            draft.push(value);
                          } else {
                            draft = draft.filter(
                              (course) => course.slug !== value.slug
                            );
                          }
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khóa học" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course._id} value={course}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                  <div className="flex gap-2 flex-wrap">
                    {selectedCourses.map((course) => (
                      <div
                        key={course.slug}
                        className="px-3 py-1 rounded bgDarkMode borderDarkMode font-semibold text-sm flex items-center gap-3"
                      >
                        {course.title}
                        <button
                          type="button"
                          className="text-slate-400"
                          onClick={() => {
                            setSelectedCourses((draft) => {
                              draft = draft.filter(
                                (item) => item.slug !== course.slug
                              );
                            });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className={cn(primaryButtonClassName, "ml-auto w-fit flex")}
            isLoading={isSubmitting}
          >
            Tạo mã giảm giá
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CouponCreate;
