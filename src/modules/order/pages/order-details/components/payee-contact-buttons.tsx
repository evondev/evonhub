import { Button } from "@/components/ui/button";
import { ManualPaymentPayee } from "@/shared/types/payment.types";
import { Mail, MessageCircle } from "lucide-react";
import {
  ORDER_SUPPORT_NAME,
  ORDER_SUPPORT_URL,
} from "../../../constants/order-details.constants";

interface PayeeContactButtonsProps {
  payee: ManualPaymentPayee;
  orderCode: string;
}

/**
 * Nút để khách gửi biên lai cho chuyên gia. Chuyên gia không để lại Facebook
 * hay email thì nhờ Evondev chuyển tiếp.
 */
export function PayeeContactButtons({
  payee,
  orderCode,
}: PayeeContactButtonsProps) {
  const hasPayeeContact = Boolean(payee.facebook || payee.email);

  return (
    <>
      {payee.facebook && (
        <Button asChild variant="outline">
          <a href={payee.facebook} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden className="size-4 shrink-0" />
            Nhắn qua Facebook
          </a>
        </Button>
      )}
      {payee.email && (
        <Button asChild variant="outline">
          <a
            href={`mailto:${payee.email}?subject=${orderCode}`}
            title={payee.email}
          >
            <Mail aria-hidden className="size-4 shrink-0" />
            Gửi email
          </a>
        </Button>
      )}
      {!hasPayeeContact && (
        <Button asChild variant="outline">
          <a href={ORDER_SUPPORT_URL} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden className="size-4 shrink-0" />
            Nhắn {ORDER_SUPPORT_NAME} để chuyển tiếp
          </a>
        </Button>
      )}
    </>
  );
}
