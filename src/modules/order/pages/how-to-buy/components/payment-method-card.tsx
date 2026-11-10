import { Clock } from "lucide-react";
import { HowToBuyPaymentMethod } from "../../../types/how-to-buy.types";

interface PaymentMethodCardProps {
  method: HowToBuyPaymentMethod;
}

/** Một cách trả tiền trong bước chuyển khoản. Dòng mở khóa bám đáy thẻ */
export function PaymentMethodCard({ method }: PaymentMethodCardProps) {
  const { icon: Icon } = method;

  return (
    <li className="flex flex-col rounded-xl border border-border p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-foreground/5 text-foreground">
        <Icon aria-hidden className="size-4" />
      </span>
      <h4 className="mt-3 font-medium text-foreground">{method.title}</h4>
      <p className="mt-1 flex-1 text-pretty text-muted">
        {method.description}
      </p>
      <p className="mt-3 flex items-start gap-1.5 text-pretty text-xs text-muted">
        <Clock aria-hidden className="mt-px size-3.5 shrink-0" />
        {method.unlockNote}
      </p>
    </li>
  );
}
