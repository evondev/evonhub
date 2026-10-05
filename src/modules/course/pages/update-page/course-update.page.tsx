"use client";

import { Form } from "@/components/ui/form";
import { updateCourse } from "@/lib/actions/course.action";
import { updateCourseSchema } from "@/utils/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import type {
  CourseInfoDraft,
  CourseInfoListKey,
  CourseQaItem,
  CourseSelectOption,
  CourseUpdateData,
  CourseUpdateFormValues,
} from "../../types";
import {
  CourseBasicInfoSection,
  CourseDescriptionSection,
  CourseInfoListSection,
  CourseMediaSection,
  CoursePricingSection,
  CoursePublishCard,
  CourseQaSection,
  CourseUpdateHeader,
} from "./components";

export interface CourseUpdatePageProps {
  data: CourseUpdateData;
  slug: string;
  /** Chưa có nguồn danh mục trong dự án: truyền vào khi đã có */
  categoryOptions?: CourseSelectOption[];
}

export function CourseUpdatePage({
  data,
  slug: courseSlug,
  categoryOptions = [],
}: CourseUpdatePageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<CourseUpdateFormValues>({
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
      seoKeywords: data.seoKeywords,
      free: data.free,
    },
  });
  const [infoData, setInfoData] = useImmer<CourseInfoDraft>({
    requirements: data.info.requirements || [],
    gained: data.info.gained || [],
    qa: data.info.qa || [],
  });

  function handleAddInfoItem(key: CourseInfoListKey) {
    setInfoData((draft) => {
      draft[key].push("");
    });
  }

  function handleChangeInfoItem(
    key: CourseInfoListKey,
    index: number,
    value: string,
  ) {
    setInfoData((draft) => {
      draft[key][index] = value;
    });
  }

  function handleRemoveInfoItem(key: CourseInfoListKey, index: number) {
    setInfoData((draft) => {
      draft[key].splice(index, 1);
    });
  }

  function handleAddQa() {
    setInfoData((draft) => {
      draft.qa.push({ question: "", answer: "" });
    });
  }

  function handleChangeQa(index: number, changes: Partial<CourseQaItem>) {
    setInfoData((draft) => {
      Object.assign(draft.qa[index], changes);
    });
  }

  function handleRemoveQa(index: number) {
    setInfoData((draft) => {
      draft.qa.splice(index, 1);
    });
  }

  async function handleSubmit(values: CourseUpdateFormValues) {
    setIsSubmitting(true);

    try {
      const response = await updateCourse({
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

      if (response?.type === "error") {
        return toast.error(response.message);
      }

      toast.success("Cập nhật khóa học thành công");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full max-w-6xl flex-col gap-6">
      <CourseUpdateHeader title={data.title} />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          autoComplete="off"
          className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div className="flex min-w-0 flex-col gap-6">
            <CourseBasicInfoSection categoryOptions={categoryOptions} />
            <CoursePricingSection />
            <CourseMediaSection />
            <CourseDescriptionSection />
            <CourseInfoListSection
              title="Yêu cầu"
              description="Hiện ở mục Yêu cầu trên trang bán. Dòng để trống sẽ bị bỏ khi lưu."
              itemLabel="Yêu cầu"
              placeholder="Ví dụ: Biết HTML, CSS"
              addLabel="Thêm yêu cầu"
              emptyText="Chưa có yêu cầu nào."
              items={infoData.requirements}
              onAdd={() => handleAddInfoItem("requirements")}
              onChange={(index, value) =>
                handleChangeInfoItem("requirements", index, value)
              }
              onRemove={(index) => handleRemoveInfoItem("requirements", index)}
            />
            <CourseInfoListSection
              title="Kết quả đạt được"
              description="Hiện ở mục Bạn sẽ học được trên trang bán."
              itemLabel="Kết quả"
              placeholder="Ví dụ: Tự dựng landing page"
              addLabel="Thêm kết quả"
              emptyText="Chưa có kết quả nào."
              items={infoData.gained}
              onAdd={() => handleAddInfoItem("gained")}
              onChange={(index, value) =>
                handleChangeInfoItem("gained", index, value)
              }
              onRemove={(index) => handleRemoveInfoItem("gained", index)}
            />
            <CourseQaSection
              items={infoData.qa}
              onAdd={handleAddQa}
              onChange={handleChangeQa}
              onRemove={handleRemoveQa}
            />
          </div>

          {/* Từ lg dính dưới header nổi (đáy 80px) để nút Lưu luôn trong tầm tay */}
          <aside className="lg:sticky lg:top-24">
            <CoursePublishCard
              savedSlug={courseSlug}
              isSubmitting={isSubmitting}
            />
          </aside>
        </form>
      </Form>
    </div>
  );
}
