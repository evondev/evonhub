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
import { actionClassName, primaryButtonClassName } from "@/constants";
import { ICourse } from "@/database/course.model";
import { updateCourse } from "@/lib/actions/course.action";
import { cn } from "@/lib/utils";
import { UploadDropzone } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import { z } from "zod";
import { IconDelete } from "../icons";
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
  const [infoType, setInfoType] = useState<TInfo>("requirements");
  const [infoData, setInfoData] = useImmer({
    requirements: data.info.requirements || [],
    qa: data.info.qa || [],
    gained: data.info.gained || [],
  });
  const handleInfoData = (type: TInfo) => {
    if (type === "qa") return;
    setInfoData((draft) => {
      draft[type].push("");
    });
  };
  // useEffect(() => {
  //   form.setValue("title", data.title);
  //   form.setValue("slug", data.slug);
  // }, [data]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
    }
  }
  const image = useWatch({
    control: form.control,
    name: "image",
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
                    className="h-[250px]"
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
                      <div className="relative">
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
                            "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
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
                  <IconAddMeta onClick={() => handleInfoData("requirements")} />
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
                  <IconAddMeta onClick={() => handleInfoData("gained")} />
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
                <FormLabel>Q/A</FormLabel>
                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-10 flex justify-end">
          <Button type="submit" className={primaryButtonClassName}>
            Cập nhật
          </Button>
        </div>
      </form>
    </Form>
  );
}
