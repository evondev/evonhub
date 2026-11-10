import { LandingLayout } from "@/modules/landing/components";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return <LandingLayout>{children}</LandingLayout>;
}
