import { Input } from "@/components/ui/input";
import {
  INTERVIEW_DIFFICULTY_OPTIONS,
  INTERVIEW_TEXT_LIMITS,
  INTERVIEW_TYPE_OPTIONS,
} from "../../../constants";
import { InterviewFieldLabel } from "../../../components/interview-field-label";
import { InterviewSegmentedControl } from "../../../components/interview-segmented-control";
import { InterviewQuestionFormValues } from "../../../types";

interface EditorMetaFieldsProps {
  values: InterviewQuestionFormValues;
  onChange: (changes: Partial<InterviewQuestionFormValues>) => void;
}

/** Dạng bài, độ khó, phiên bản, câu hỏi, code */
export function EditorMetaFields({ values, onChange }: EditorMetaFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <InterviewFieldLabel>Dạng bài</InterviewFieldLabel>
          <InterviewSegmentedControl
            label="Dạng bài"
            options={INTERVIEW_TYPE_OPTIONS}
            value={values.type}
            onChange={(type) => onChange({ type })}
          />
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <InterviewFieldLabel>Độ khó</InterviewFieldLabel>
            <InterviewSegmentedControl
              label="Độ khó"
              options={INTERVIEW_DIFFICULTY_OPTIONS}
              value={values.difficulty}
              onChange={(difficulty) => onChange({ difficulty })}
            />
          </div>
          <div className="w-40">
            <InterviewFieldLabel htmlFor="interview-version">Phiên bản</InterviewFieldLabel>
            <Input
              id="interview-version"
              value={values.version}
              maxLength={INTERVIEW_TEXT_LIMITS.version}
              placeholder="React 18+"
              className="font-normal"
              onChange={(event) => onChange({ version: event.target.value })}
            />
          </div>
        </div>
      </div>
      <div>
        <InterviewFieldLabel htmlFor="interview-prompt" isRequired>
          Câu hỏi
        </InterviewFieldLabel>
        <Input
          id="interview-prompt"
          value={values.prompt}
          maxLength={INTERVIEW_TEXT_LIMITS.prompt}
          placeholder="Bấm nút một lần, nút hiện số mấy?"
          className="font-normal"
          onChange={(event) => onChange({ prompt: event.target.value })}
        />
      </div>
      <div>
        <InterviewFieldLabel htmlFor="interview-code" hint="tối đa khoảng 15 dòng">
          Code
        </InterviewFieldLabel>
        <textarea
          id="interview-code"
          rows={10}
          value={values.code}
          maxLength={INTERVIEW_TEXT_LIMITS.code}
          spellCheck={false}
          className="w-full resize-y rounded-xl border border-transparent bg-zinc-900 p-4 font-mono text-xs leading-6 text-zinc-100 outline-none [font-variant-ligatures:none] focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm dark:bg-black/40"
          onChange={(event) => onChange({ code: event.target.value })}
        />
      </div>
    </>
  );
}
