"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  actionClassName,
  baseButtonClassName,
  primaryButtonClassName,
} from "@/constants";
import { ICourse } from "@/database/course.model";
import { updateCourse } from "@/lib/actions/course.action";
import { cn } from "@/lib/utils";
import { ECourseInfo } from "@/types/enums";
import { updateCourseSchema } from "@/utils/formSchema";
import { UploadDropzone } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import { z } from "zod";
import { IconDelete, IconViews } from "../icons";
import IconAddMeta from "../icons/IconAddMeta";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export default function UpdateCourseForm({
  data,
  slug: courseSlug,
}: {
  data: ICourse;
  slug: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof updateCourseSchema>>({
    resolver: zodResolver(updateCourseSchema),
    defaultValues: {
      title: data.title,
      slug: data.slug,
      price: data.price.toString(),
      salePrice: data.salePrice.toString(),
      intro: data.intro,
      desc: data.desc,
      level: data.level,
      image: data.image,
      status: data.status,
      cta: data.cta,
      ctaLink: data.ctaLink,
      seoKeywords: data.seoKeywords,
      free: data.free,
    },
  });
  const [infoData, setInfoData] = useImmer({
    requirements: data.info.requirements || [],
    qa: data.info.qa || [],
    gained: data.info.gained || [],
  });
  const handleInfoData = (type: ECourseInfo) => {
    if (type === ECourseInfo.QA) {
      setInfoData((draft) => {
        draft.qa.push({ question: "", answer: "" });
      });
      return;
    }
    setInfoData((draft) => {
      draft[type].push("");
    });
  };

  async function onSubmit(values: z.infer<typeof updateCourseSchema>) {
    setIsSubmitting(true);
    try {
      const res = await updateCourse({
        slug: values.slug || "",
        courseSlug,
        updateData: {
          ...values,
          price: parseInt(values.price || "0"),
          salePrice: parseInt(values.salePrice || "0"),
          category: data.category,
          info: {
            requirements: infoData.requirements.filter((item) => item !== ""),
            qa: infoData.qa,
            gained: infoData.gained,
          },
        },
        path: `/course/${values.slug || courseSlug}`,
      });
      if (values.slug !== data.slug) {
        router.replace(`/admin/course/update?slug=${values.slug}`);
      }
      if (res?.type === "error") {
        return toast.error(res.message);
      }
      toast.success("Cập nhật khóa học thành công");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }
  const image = useWatch({
    control: form.control,
    name: "image",
  });
  const slug = useWatch({
    control: form.control,
    name: "slug",
  });
  return (
    <div className="l-container">
      <Breadcrumb className="mb-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/course/manage">
              Quản lý khóa học
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cập nhật khóa học</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đường dẫn</FormLabel>
                  <FormControl>
                    <Input placeholder="Đường dẫn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá khuyến mãi</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Giá khuyến mãi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá gốc</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Giá gốc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Call to action</FormLabel>
                  <FormControl>
                    <Input placeholder="Call to action" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ctaLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CTA Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://fb.com/someone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trình độ</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trình độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Dễ</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="expert">Khó</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục</FormLabel>
                  <FormControl>
                    <Input placeholder="Danh mục" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intro URL</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Video youtube URL only"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div></div>
            {/* <FormField
            control={form.control}
            name="free"
            render={({ field }) => (
              <FormItem>
                <FormLabel>&nbsp;</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="free-course"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="free-course">Khóa học miễn phí</Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

            <FormField
              control={form.control}
              name="seoKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO keywords</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="SEO keywords" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Đã duyệt</SelectItem>
                        <SelectItem value="pending">Đang chờ duyệt</SelectItem>
                        <SelectItem value="rejected">Bị từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả"
                      {...field}
                      className="h-[250px] focus-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh đại diện</FormLabel>
                  <FormControl>
                    <>
                      {image && (
                        <div className="relative group">
                          <Image
                            src={image}
                            alt="Course Image"
                            width={800}
                            height={400}
                            className="w-full h-[250px] rounded-lg object-cover"
                          />
                          <button
                            className={cn(
                              actionClassName,
                              "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hover:bg-red-500 hover:!text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                            )}
                            onClick={() => form.setValue("image", "")}
                          >
                            <IconDelete />
                          </button>
                        </div>
                      )}
                      {!image && (
                        <UploadDropzone
                          className="justify-center items-center bg-white dark:bg-grayDarker rounded-lg h-[250px]"
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            form.setValue("image", res[0].url);
                          }}
                          onUploadError={(error: Error) => {
                            alert(`ERROR! ${error.message}`);
                          }}
                          config={{
                            mode: "auto",
                          }}
                        />
                      )}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    Yêu cầu
                    <IconAddMeta
                      className="text-primary"
                      onClick={() => handleInfoData(ECourseInfo.REQUIREMENTS)}
                    />
                  </FormLabel>
                  <FormControl>
                    <>
                      {infoData.requirements.map((item, index) => (
                        <Input
                          key={index}
                          placeholder={`Yêu cầu số ${index + 1}`}
                          value={item}
                          onChange={(e) => {
                            setInfoData((draft) => {
                              draft.requirements[index] = e.target.value;
                            });
                          }}
                        />
                      ))}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gained"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    Kết quả đạt được
                    <IconAddMeta
                      className="text-primary"
                      onClick={() => handleInfoData(ECourseInfo.GAINED)}
                    />
                  </FormLabel>
                  <FormControl>
                    <>
                      {infoData.gained.map((item, index) => (
                        <Input
                          key={index}
                          placeholder={`Lợi ích số ${index + 1}`}
                          value={item}
                          onChange={(e) => {
                            setInfoData((draft) => {
                              draft.gained[index] = e.target.value;
                            });
                          }}
                        />
                      ))}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="qa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    Q/A
                    <IconAddMeta
                      className="text-primary"
                      onClick={() => handleInfoData(ECourseInfo.QA)}
                    />
                  </FormLabel>
                  <FormControl>
                    <>
                      {infoData.qa.map((item, index) => (
                        <div key={index} className="grid grid-cols-2 gap-5">
                          <Input
                            placeholder={`Câu hỏi số ${index + 1}`}
                            value={item.question}
                            onChange={(e) => {
                              setInfoData((draft) => {
                                draft.qa[index].question = e.target.value;
                              });
                            }}
                          />
                          <Input
                            placeholder={`Trả lời số ${index + 1}`}
                            value={item.answer}
                            onChange={(e) => {
                              setInfoData((draft) => {
                                draft.qa[index].answer = e.target.value;
                              });
                            }}
                          />
                        </div>
                      ))}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-10 flex justify-end gap-2">
            <Button
              type="submit"
              className={primaryButtonClassName}
              isLoading={isSubmitting}
            >
              Cập nhật
            </Button>
            <Link
              href={`/course/${slug}`}
              target="_blank"
              type="submit"
              className={cn(baseButtonClassName, "gap-2 text-sm")}
            >
              <IconViews />
              Preview
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
