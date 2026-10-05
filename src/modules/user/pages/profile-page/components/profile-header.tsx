import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export interface ProfileHeaderProps {
  /** Link trang công khai theo username đã lưu, không theo ô đang gõ */
  publicPath: string;
}

export function ProfileHeader({ publicPath }: ProfileHeaderProps) {
  return (
    // Nút viền đứng thẳng trên nền trang xám: nền rê #f1f1f3 của card tan vào
    // nền trang, nên khối này lấy bậc đậm hơn (#e4e4e7, vẫn tách khỏi viền)
    <header className="flex items-center justify-between gap-3 [--button-hover:#e4e4e7] dark:[--button-hover:rgb(255_255_255/0.08)]">
      <h1 className="text-balance text-xl font-semibold text-foreground">
        Hồ sơ
      </h1>
      <Button asChild variant="outline" className="h-11 shrink-0 md:h-10">
        <Link href={publicPath}>
          <Eye className="size-4 shrink-0" />
          Xem trang công khai
        </Link>
      </Button>
    </header>
  );
}
