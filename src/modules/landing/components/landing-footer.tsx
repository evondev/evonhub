import { ProductLogo } from "@/shared/components/product-logo";
import { cn } from "@/shared/utils";
import Link from "next/link";
import {
  EVONDEV_URL,
  LANDING_CONTAINER_CLASS_NAME,
  landingFooterColumns,
} from "../constants";
import { LandingFooterLink } from "./landing-footer-link";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div
        className={cn(
          LANDING_CONTAINER_CLASS_NAME,
          "grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]",
        )}
      >
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <ProductLogo />
            <span className="text-base font-semibold text-foreground">
              EvonHub
            </span>
          </Link>
          <p className="max-w-xs text-pretty text-sm leading-6 text-muted">
            Nền tảng học lập trình Frontend thực chiến của evondev.
          </p>
        </div>
        {landingFooterColumns.map((footerColumn) => (
          <div key={footerColumn.title} className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground">
              {footerColumn.title}
            </p>
            <ul className="flex flex-col gap-2.5">
              {footerColumn.links.map((footerLink) => (
                <li key={footerLink.url}>
                  <LandingFooterLink footerLink={footerLink} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <p
          className={cn(
            LANDING_CONTAINER_CLASS_NAME,
            "py-6 text-xs text-muted",
          )}
        >
          © {currentYear} EvonHub · Làm bởi{" "}
          <a
            href={EVONDEV_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            evondev
          </a>
        </p>
      </div>
    </footer>
  );
}
