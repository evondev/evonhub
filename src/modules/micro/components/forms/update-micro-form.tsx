"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  actionClassName,
  editorOptions,
  primaryButtonClassName,
} from "@/constants";
import { cn } from "@/lib/utils";
import { IconDelete } from "@/shared/components";
import { updateMicroSchema } from "@/utils/formSchema";
import { UploadDropzone } from "@/utils/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { userMutationUpdateMicro } from "../../services";
import { MicroItemData } from "../../types";

export default function UpdateMicroForm({
  data,
  slug: microSlug,
}: {
  data: MicroItemData;
  slug: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef<any>(null);
  const { theme } = useTheme();
  const router = useRouter();
  const mutationUpdateMicro = userMutationUpdateMicro();
  const form = useForm<z.infer<typeof updateMicroSchema>>({
    resolver: zodResolver(updateMicroSchema),
    defaultValues: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      video: data.video,
      image: data.image,
      status: data.status,
      seoKeywords: data.seoKeywords,
      duration: data.duration,
    },
  });

  async function onSubmit(values: z.infer<typeof updateMicroSchema>) {
    setIsSubmitting(true);
    try {
      const response = await mutationUpdateMicro.mutateAsync({
        slug: values.slug || "",
        microSlug,
        updateData: {
          ...values,
        },
      });
      if (values.slug !== data.slug) {
        router.replace(`/admin/micro/update?slug=${values.slug}`);
      }
      if (response?.type === "error") {
        return toast.error(response.message);
      }
      toast.success("Cập nhật video thành công");
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
            <BreadcrumbLink href="/admin/micro/manage">
              Quản lý videos
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Cập nhật video</BreadcrumbPage>
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
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-[1/3]">
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
                            <img
                              src={image}
                              alt="Course Image"
                              width={800}
                              height={400}
                              className="w-full aspect-video rounded-xl object-cover"
                            />
                            <button
                              className={cn(
                                actionClassName,
                                "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hover:bg-red-500 hover:!text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible size-10",
                              )}
                              onClick={() => form.setValue("image", "")}
                            >
                              <IconDelete />
                            </button>
                          </div>
                        )}
                        {!image && (
                          <UploadDropzone
                            className="justify-center items-center bg-white dark:bg-grayDarker rounded-xl h-[250px]"
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
            </div>

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian (phút)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Số (phút)" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className=""
                      placeholder="Video"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="col-[1/3]">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                        // @ts-ignore
                        // onInit={(evt, editor) => (editorRef.current = editor)}
                        onInit={(_evt, editor) => {
                          (editorRef.current = editor).setContent(
                            data.content || "",
                          );
                        }}
                        value={field.value}
                        {...editorOptions(field, theme, 300)}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-2">
            <Button
              type="submit"
              className={primaryButtonClassName}
              isLoading={isSubmitting}
            >
              Cập nhật
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
