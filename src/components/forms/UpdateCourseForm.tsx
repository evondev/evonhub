"use client";

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
import { UploadDropzone } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import { z } from "zod";
import { IconDelete, IconViews } from "../icons";
import IconAddMeta from "../icons/IconAddMeta";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  title: z.string().min(10, {
    message: "Tiêu đề phải có ít nhất 10 ký tự",
  }),
  slug: z.string().optional(),
  price: z.string().optional(),
  salePrice: z.string().optional(),
  intro: z.string().optional(),
  image: z.string().optional(),
  desc: z.string().optional(),
  content: z.string().optional(),
  level: z.string().optional(),
  category: z.string().optional(),
  qa: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
  requirements: z.array(z.string()).optional(),
  gained: z.array(z.string()).optional(),
});
type TInfo = "requirements" | "qa" | "gained";
export default function UpdateCourseForm({ data }: { data: ICourse }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title,
      slug: data.slug,
      price: data.price.toString(),
      salePrice: data.salePrice.toString(),
      intro: data.intro,
      desc: data.desc,
      level: data.level,
      image: data.image,
    },
  });
  const [infoData, setInfoData] = useImmer({
    requirements: data.info.requirements || [],
    qa: data.info.qa || [],
    gained: data.info.gained || [],
  });
  const handleInfoData = (type: TInfo) => {
    if (type === "qa") {
      setInfoData((draft) => {
        draft.qa.push({ question: "", answer: "" });
      });
      return;
    }
    setInfoData((draft) => {
      draft[type].push("");
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await updateCourse({
        slug: data.slug,
        updateData: {
          ...values,
          info: {
            requirements: infoData.requirements.filter((item) => item !== ""),
            qa: infoData.qa,
            gained: infoData.gained,
          },
        },
      });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid grid-cols-2 gap-10 mb-10">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề*</FormLabel>
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
                <FormLabel>Giá khóa học</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Giá khóa học" {...field} />
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
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trình độ</FormLabel>
                <FormControl>
                  <Input placeholder="Trình độ" {...field} />
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
                  <Input type="text" placeholder="Intro URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div></div>
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
                          width={200}
                          height={150}
                          className="w-full h-[250px] rounded-lg object-cover"
                        />
                        <button
                          className={cn(
                            actionClassName,
                            "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hover:bg-red-500 opacity-0 invisible group-hover:opacity-100 group-hover:visible"
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
                    onClick={() => handleInfoData("requirements")}
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
                    onClick={() => handleInfoData("gained")}
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
                    onClick={() => handleInfoData("qa")}
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
  );
}
