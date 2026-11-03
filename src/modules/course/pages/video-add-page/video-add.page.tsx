"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { convertSlug } from "@/utils";
import { createVideoSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createVideo } from "../../actions";
import { COURSE_FORM_CONTROL_CLASS_NAME } from "../../constants";
import type { VideoCreateFormValues } from "../../types";
import { buildVideoUpdateHref } from "../../utils/course-manage.utils";
import { CourseUpdateHeader } from "../update-page/components";
import { CourseField } from "../update-page/components/course-field";
import { CourseFormSection } from "../update-page/components/course-form-section";
import { InputWithAddon } from "../update-page/components/input-with-addon";

/** Tạo video lẻ chỉ cần tiêu đề và đường dẫn, phần còn lại sửa ở trang sau */
export function VideoAddPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<VideoCreateFormValues>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  });

  async function handleSubmit(values: VideoCreateFormValues) {
    setIsSubmitting(true);
    const title = values.title.trim();
    const slug = convertSlug(values.slug?.trim() || title);

    try {
      const response = await createVideo({ title, slug });

      if (response.type === "error") {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push(buildVideoUpdateHref(slug));
    } catch (error) {
      console.log(error);
      toast.error("Chưa tạo được video, thử lại sau");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <CourseUpdateHeader title="Thêm video" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          autoComplete="off"
          className="flex flex-col gap-6"
        >
          <CourseFormSection
            title="Video mới"
            description="Video lẻ bán riêng, không cần tạo chương và bài. Tạo xong sẽ sang trang điền video, nội dung và giá."
          >
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <CourseField label="Tiêu đề" hint="Tối thiểu 10 ký tự" isRequired>
                    <Input
                      className={COURSE_FORM_CONTROL_CLASS_NAME}
                      {...field}
                    />
                  </CourseField>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <CourseField
                    label="Đường dẫn"
                    hint="Để trống thì tự tạo từ tiêu đề"
                  >
                    <InputWithAddon leadingText="/video/" {...field} />
                  </CourseField>
                )}
              />
            </div>
          </CourseFormSection>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              className="h-11 md:h-10"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Tạo video
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
