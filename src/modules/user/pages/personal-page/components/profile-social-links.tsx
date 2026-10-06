import { ProfileSocialLink } from "../../../types";

interface ProfileSocialLinksProps {
  socialLinks: ProfileSocialLink[];
}

export function ProfileSocialLinks({ socialLinks }: ProfileSocialLinksProps) {
  return (
    <div className="flex items-center gap-1">
      {socialLinks.map((socialLink) => (
        <a
          key={socialLink.name}
          href={socialLink.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={socialLink.label}
          title={socialLink.label}
          className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <socialLink.icon aria-hidden className="size-[18px]" />
        </a>
      ))}
    </div>
  );
}
