import { Fragment } from "react";
import { partnerLinks } from "../constants";

export function PartnerFooter() {
  return (
    <footer className="text-sm text-muted">
      <span className="font-medium">Đối tác:</span>{" "}
      {partnerLinks.map((partner, index) => (
        <Fragment key={partner.name}>
          {index > 0 && " · "}
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            {partner.name}
          </a>
        </Fragment>
      ))}
    </footer>
  );
}
