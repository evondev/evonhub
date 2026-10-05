"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "react-toastify";
import {
  PROFILE_SAVE_ERROR_MESSAGE,
  PROFILE_SAVED_HINT_MS,
} from "../../../constants";
import { ProfileSaveResult } from "../../../types";
import { ProfileSection } from "./profile-section";

export interface ProfileFormSectionProps<TValues extends FieldValues> {
  title: string;
  description?: React.ReactNode;
  form: UseFormReturn<TValues>;
  /** Trả kết quả thất bại thì khối hiện lỗi: theo ô dưới ô, lỗi chung bằng toast */
  onSave: (values: TValues) => Promise<ProfileSaveResult | void>;
  children: React.ReactNode;
}

/**
 * Khối có ô chữ: một nút Lưu ở chân khối, khoá khi chưa đổi gì.
 * Lưu xong hiện "Đã lưu" xám cạnh nút chừng hai giây.
 */
export function ProfileFormSection<TValues extends FieldValues>({
  title,
  description,
  form,
  onSave,
  children,
}: ProfileFormSectionProps<TValues>) {
  const [isJustSaved, setIsJustSaved] = useState(false);
  const { isDirty, isSubmitting } = form.formState;

  useEffect(() => {
    if (!isJustSaved) return;

    const hideSavedTimer = setTimeout(
      () => setIsJustSaved(false),
      PROFILE_SAVED_HINT_MS,
    );

    return () => clearTimeout(hideSavedTimer);
  }, [isJustSaved]);

  async function handleSave(values: TValues) {
    try {
      const saveResult = await onSave(values);

      if (saveResult && !saveResult.isSuccess) {
        showSaveErrors(saveResult);
        return;
      }

      form.reset(values);
      setIsJustSaved(true);
    } catch (error) {
      console.error(error);
      toast.error(PROFILE_SAVE_ERROR_MESSAGE);
    }
  }

  function showSaveErrors(saveResult: ProfileSaveResult) {
    const fieldErrorEntries = Object.entries(saveResult.fieldErrors || {});

    if (!fieldErrorEntries.length) {
      toast.error(saveResult.message || PROFILE_SAVE_ERROR_MESSAGE);
      return;
    }

    for (const [fieldName, message] of fieldErrorEntries) {
      form.setError(
        fieldName as Path<TValues>,
        { message },
        { shouldFocus: true },
      );
    }
  }

  const isSavedHintVisible = isJustSaved && !isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} noValidate>
        <ProfileSection
          title={title}
          description={description}
          footer={
            <>
              <span role="status" className="text-xs text-muted">
                {isSavedHintVisible && (
                  <span className="inline-flex items-center gap-1">
                    <Check className="size-3.5" />
                    Đã lưu
                  </span>
                )}
              </span>
              <Button
                type="submit"
                variant="primary"
                className="h-11 md:h-10"
                disabled={!isDirty}
                isLoading={isSubmitting}
              >
                Lưu
              </Button>
            </>
          }
        >
          {children}
        </ProfileSection>
      </form>
    </Form>
  );
}
