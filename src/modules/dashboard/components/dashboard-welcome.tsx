import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import Link from "next/link";
import { getWelcomeHeading } from "../utils";

interface DashboardWelcomeProps {
  /** Đã đăng nhập nhưng chưa có khóa nào. Không truyền thì là khách */
  firstName?: string;
}

export function DashboardWelcome({ firstName }: DashboardWelcomeProps) {
  const heading = getWelcomeHeading(firstName);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
      <h2 className="max-w-[30ch] text-balance text-xl font-semibold text-foreground sm:text-2xl">
        {heading}
      </h2>
      <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted">
        Học cách đưa sản phẩm của chính mình lên production, và biết nó sẽ lủng
        ở đâu trước khi người dùng tìm ra.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild variant="primary">
          <Link href="/explore">
            <Compass className="size-4 shrink-0" />
            Xem các khóa học
          </Link>
        </Button>
      </div>
    </section>
  );
}
