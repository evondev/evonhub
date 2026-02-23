import { Heading } from "@/shared/components";

export interface FAQProps {}

export async function FAQ(_props: FAQProps) {
  return (
    <section className="w-full flex flex-col gap-5">
      <Heading className="text-lg lg:text-2xl">Câu hỏi thường gặp</Heading>
      <div className="flex flex-wrap gap-3"></div>
    </section>
  );
}
