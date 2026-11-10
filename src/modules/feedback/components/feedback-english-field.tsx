"use client";

import { feedbackEnglishOptions } from "../constants";
import { getFeedbackOptionClassName } from "../utils";

interface FeedbackEnglishFieldProps {
  value?: boolean;
  onChange: (wantsEnglish: boolean) => void;
}

/** Có muốn cải thiện tiếng Anh giao tiếp không: hai thẻ chọn, không bắt buộc */
export function FeedbackEnglishField({
  value,
  onChange,
}: FeedbackEnglishFieldProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-foreground">
        Bạn có muốn cải thiện tiếng Anh giao tiếp không?
      </legend>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {feedbackEnglishOptions.map((option) => (
          <label
            key={option.label}
            className={getFeedbackOptionClassName(value === option.value)}
          >
            <input
              type="radio"
              name="wantsEnglish"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
