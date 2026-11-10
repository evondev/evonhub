import Link from "next/link";
import { LandingFooterLinkItem } from "../types";

interface LandingFooterLinkProps {
  footerLink: LandingFooterLinkItem;
}

const FOOTER_LINK_CLASS_NAME =
  "text-sm text-muted transition-colors hover:text-foreground";

/** Link trong footer: trang ngoài mở tab mới, trang trong dùng next/link */
export function LandingFooterLink({ footerLink }: LandingFooterLinkProps) {
  if (footerLink.isExternal) {
    return (
      <a
        href={footerLink.url}
        target="_blank"
        rel="noreferrer"
        className={FOOTER_LINK_CLASS_NAME}
      >
        {footerLink.title}
      </a>
    );
  }

  return (
    <Link href={footerLink.url} className={FOOTER_LINK_CLASS_NAME}>
      {footerLink.title}
    </Link>
  );
}
