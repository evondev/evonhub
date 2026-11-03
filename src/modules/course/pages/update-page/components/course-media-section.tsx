import { Button, buttonVariants } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/shared/utils";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { ImageIcon, ImageUp, Trash2 } from "lucide-react";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import {
  COURSE_FORM_CONTROL_CLASS_NAME,
  COURSE_IMAGE_HINT,
  DEFAULT_COURSE_IMAGE,
} from "../../../constants";
import type { CourseUpdateFormValues } from "../../../types";
import { CourseField } from "./course-field";
import { CourseFormSection } from "./course-form-section";

export function CourseMediaSection() {
  const { control, setValue } = useFormContext<CourseUpdateFormValues>();
  const image = useWatch({ control, name: "image" });

  function handleClearImage() {
    setValue("image", "", { shouldDirty: true });
  }

  function handleUseDefaultImage() {
    setValue("image", DEFAULT_COURSE_IMAGE, { shouldDirty: true });
  }

  function handleUploadComplete(files: { url: string }[]) {
    setValue("image", files[0].url, { shouldDirty: true });
  }

  function handleUploadError(error: Error) {
    toast.error(`Chưa tải được ảnh lên: ${error.message}`);
  }

  return (
    <CourseFormSection title="Ảnh và video giới thiệu">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium leading-5 text-foreground">
            Ảnh đại diện
          </p>

          {image && (
            <div className="flex flex-col gap-1.5 sm:max-w-md">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-background ring-1 ring-border">
                <Image
                  src={image}
                  alt="Ảnh đại diện khóa học"
                  fill
                  sizes="(min-width: 640px) 448px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-pretty text-xs text-muted">
                  {COURSE_IMAGE_HINT}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  {/* Tải ảnh mới đè lên ảnh cũ, ảnh cũ giữ nguyên tới khi tải xong */}
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    content={{
                      button: ({ isUploading }) =>
                        isUploading ? (
                          "Đang tải ảnh"
                        ) : (
                          <span className="flex items-center gap-2">
                            <ImageUp className="size-4 shrink-0" aria-hidden />
                            Đổi ảnh
                          </span>
                        ),
                    }}
                    appearance={{
                      container: "flex-row",
                      button: cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "w-auto focus-within:ring-0 after:bg-primary/20 ut-uploading:cursor-wait",
                      ),
                      allowedContent: "hidden",
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleClearImage}
                  >
                    <Trash2 className="size-4 shrink-0" aria-hidden />
                    Xóa ảnh
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!image && (
            <div className="flex flex-col gap-1.5 sm:max-w-md">
              <UploadDropzone
                endpoint="imageUploader"
                config={{ mode: "auto" }}
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                content={{
                  label: "Kéo thả ảnh vào đây",
                  allowedContent: COURSE_IMAGE_HINT,
                  button: "Chọn ảnh",
                }}
                appearance={{
                  container:
                    "m-0 flex aspect-video w-full cursor-pointer sm:max-w-md flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-background/60 px-6 py-8 text-center transition-colors hover:bg-item-hover",
                  uploadIcon: "size-8 text-muted",
                  label:
                    "mt-3 text-sm font-medium text-foreground hover:text-foreground [@media(hover:none)]:hidden",
                  allowedContent: "mt-1 h-auto text-pretty text-sm text-muted",
                  button:
                    "mt-4 h-9 w-auto rounded-lg border border-border-strong bg-surface px-3 text-sm font-medium text-foreground after:bg-primary/20 ut-uploading:cursor-wait",
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="self-start"
                onClick={handleUseDefaultImage}
              >
                <ImageIcon className="size-4 shrink-0" aria-hidden />
                Dùng ảnh mặc định
              </Button>
            </div>
          )}
        </div>

        <FormField
          control={control}
          name="intro"
          render={({ field }) => (
            <CourseField label="Video giới thiệu" hint="Chỉ nhận link YouTube">
              <Input
                inputMode="url"
                className={COURSE_FORM_CONTROL_CLASS_NAME}
                {...field}
              />
            </CourseField>
          )}
        />
      </div>
    </CourseFormSection>
  );
}
