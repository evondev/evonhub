import Link from "next/link";

export function MyOrdersEmpty() {
  return (
    <section className="rounded-2xl border border-border bg-surface px-4 py-6 text-center text-sm text-muted">
      Bạn chưa có đơn hàng nào.{" "}
      <Link
        href="/explore"
        className="whitespace-nowrap font-medium text-foreground underline underline-offset-4"
      >
        Xem các khóa học
      </Link>
    </section>
  );
}
