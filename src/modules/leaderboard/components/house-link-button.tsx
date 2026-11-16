import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

import { buildHousePath } from "../utils/estate.utils";

interface HouseLinkButtonProps {
  username: string;
  name: string;
  /** Dòng bảng: chỉ icon. Bục top 3: icon kèm chữ "Xem nhà" */
  isCompact?: boolean;
}

/** Nút "Xem nhà" dẫn tới đảo 3D của một người. Không có username thì không hiện */
export function HouseLinkButton({ username, name, isCompact = false }: HouseLinkButtonProps) {
  if (!username) return null;

  if (isCompact) {
    return (
      <Button asChild variant="ghost" size="icon" className="size-8 shrink-0 rounded-lg">
        <Link href={buildHousePath(username)} aria-label={`Xem nhà của ${name}`} title="Xem nhà">
          <Home aria-hidden className="size-4" />
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 px-2.5 text-xs">
      <Link href={buildHousePath(username)} aria-label={`Xem nhà của ${name}`}>
        <Home aria-hidden className="size-3.5" />
        Xem nhà
      </Link>
    </Button>
  );
}
