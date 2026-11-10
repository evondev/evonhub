import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { howToBuyPaymentMethods } from "../../../constants/how-to-buy.constants";
import { HowToBuyStep } from "../../../types/how-to-buy.types";
import { PaymentMethodCard } from "./payment-method-card";

interface HowToBuyStepItemProps {
  step: HowToBuyStep;
  stepNumber: number;
  isLast: boolean;
}

/**
 * Một bước: vòng số bên trái, đường nối xuống bước sau. Khuôn mượn dòng thời
 * gian, dòng đầu nằm giữa tâm vòng (`pt-1.5`).
 */
export function HowToBuyStepItem({
  step,
  stepNumber,
  isLast,
}: HowToBuyStepItemProps) {
  return (
    <li className="relative flex gap-3 pb-6 last:pb-0">
      {!isLast && (
        <span
          aria-hidden
          className="absolute bottom-1 left-[15px] top-10 w-0.5 rounded-full bg-foreground/10"
        />
      )}
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground/5 font-medium tabular-nums text-foreground">
        {stepNumber}
      </span>
      <div className="min-w-0 flex-1 pt-1.5">
        <h3 className="font-medium text-foreground">{step.title}</h3>
        <p className="mt-1 max-w-[60ch] text-pretty text-muted">
          {step.description}
        </p>

        {step.codeExample && (
          <p className="mt-1 text-xs text-muted">
            Mã đơn có dạng{" "}
            <span className="font-mono font-medium text-foreground">
              {step.codeExample}
            </span>
          </p>
        )}

        {step.hasPaymentMethods && (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {howToBuyPaymentMethods.map((method) => (
              <PaymentMethodCard key={method.title} method={method} />
            ))}
          </ul>
        )}

        {step.link && (
          <Link
            href={step.link.href}
            className="mt-1 inline-flex h-8 items-center gap-1 font-medium text-primary hover:underline"
          >
            {step.link.label}
            <ArrowRight aria-hidden className="size-4 shrink-0" />
          </Link>
        )}
      </div>
    </li>
  );
}
