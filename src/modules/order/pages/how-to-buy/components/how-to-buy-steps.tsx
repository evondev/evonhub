import { howToBuySteps } from "../../../constants/how-to-buy.constants";
import { HowToBuyStepItem } from "./how-to-buy-step-item";

/** Card chính: các bước mua khóa đọc từ trên xuống */
export function HowToBuySteps() {
  const lastStepIndex = howToBuySteps.length - 1;

  return (
    <section
      aria-labelledby="how-to-buy-steps-title"
      className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
    >
      <h2
        id="how-to-buy-steps-title"
        className="text-base font-semibold text-foreground"
      >
        Các bước mua khóa
      </h2>
      <ol className="mt-5 text-sm">
        {howToBuySteps.map((step, index) => (
          <HowToBuyStepItem
            key={step.title}
            step={step}
            stepNumber={index + 1}
            isLast={index === lastStepIndex}
          />
        ))}
      </ol>
    </section>
  );
}
