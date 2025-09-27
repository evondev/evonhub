import { DetailsPageLayout } from "@/modules/lesson/pages";

export interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <DetailsPageLayout>{children}</DetailsPageLayout>;
}
