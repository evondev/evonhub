export interface ProfileSectionProps {
  title: string;
  description?: React.ReactNode;
  /** Chân khối: nút Lưu của đúng khối này */
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/** Một khối của trang hồ sơ: tiêu đề, các hàng chia kẻ, chân khối nếu có */
export function ProfileSection({
  title,
  description,
  footer,
  children,
}: ProfileSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface">
      <header className="px-4 pt-4 sm:px-5 sm:pt-5">
        <h2 className="text-balance text-base font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-pretty text-sm text-muted">{description}</p>
        )}
      </header>

      <div className="mt-2 divide-y divide-border">{children}</div>

      {footer && (
        <footer className="flex items-center justify-end gap-3 border-t border-border px-4 py-3 sm:px-5">
          {footer}
        </footer>
      )}
    </section>
  );
}
