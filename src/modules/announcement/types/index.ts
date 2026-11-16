import type { LucideIcon } from "lucide-react";

export interface FeatureAnnouncementItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}
