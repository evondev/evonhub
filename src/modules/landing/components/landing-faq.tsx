import { cn } from "@/shared/utils";
import {
  faqItems,
  FACEBOOK_SUPPORT_URL,
  LANDING_CONTAINER_CLASS_NAME,
  LANDING_SECTION_CLASS_NAME,
  LANDING_SECTION_IDS,
} from "../constants";
import { LandingFaqItem } from "./landing-faq-item";
import { LandingSectionHeading } from "./landing-section-heading";

/** Hỏi đáp hai cột: tiêu đề bên trái, danh sách câu hỏi bên phải */
export function LandingFaq() {
  return (
    <section
      id={LANDING_SECTION_IDS.faq}
      className={cn(
        LANDING_SECTION_CLASS_NAME,
        LANDING_CONTAINER_CLASS_NAME,
        "grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]",
      )}
    >
      <div className="flex flex-col gap-4">
        <LandingSectionHeading
          eyebrow="Hỏi đáp"
          title="Hỏi trước khi học."
          mutedTitle="Mấy câu hay gặp nhất."
        />
        <p className="text-sm text-muted">
          Chưa thấy câu bạn cần?{" "}
          <a
            href={FACEBOOK_SUPPORT_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Nhắn evondev qua Facebook
          </a>
        </p>
      </div>
      <div className="reveal-on-scroll">
        {faqItems.map((faqItem) => (
          <LandingFaqItem key={faqItem.question} faqItem={faqItem} />
        ))}
      </div>
    </section>
  );
}
