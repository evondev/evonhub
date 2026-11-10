import { howToBuyTroubles } from "../../../constants/how-to-buy.constants";

/** Các ca lệch khỏi luồng chuẩn: mỗi ca một tên và cách xử lý */
export function HowToBuyTroubles() {
  return (
    <section
      aria-labelledby="how-to-buy-troubles-title"
      className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
    >
      <h2
        id="how-to-buy-troubles-title"
        className="text-base font-semibold text-foreground"
      >
        Khi gặp sự cố
      </h2>
      <dl className="mt-4 divide-y divide-border text-sm">
        {howToBuyTroubles.map((trouble) => (
          <div key={trouble.title} className="py-4 first:pt-0 last:pb-0">
            <dt className="font-medium text-foreground">{trouble.title}</dt>
            <dd className="mt-1 max-w-[60ch] text-pretty text-muted">
              {trouble.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
