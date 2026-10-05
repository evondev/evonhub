import { Fragment } from "react";
import { partnerLinks } from "../constants";

export function PartnerFooter() {
  return (
    <footer className="border-t border-border pt-4 text-xs text-muted">
      Đối tác:{" "}
      {partnerLinks.map((partner, index) => (
        <Fragment key={partner.name}>
          {index > 0 && " · "}
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            {partner.name}
          </a>
        </Fragment>
      ))}
    </footer>
  );
}
