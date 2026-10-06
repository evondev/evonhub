import { NotFoundState } from "@/shared/components/not-found";

// Sai đường dẫn ngoài khung app: trang đứng riêng, có logo. `.wrapper` ở layout
// gốc chừa pt-16 cho header dashboard, kéo margin âm bù lại
export default function NotFound() {
  return (
    <main className="-mb-16 -mt-16 min-h-dvh px-4 pt-24 sm:pt-40 lg:mb-0">
      <NotFoundState isStandalone />
    </main>
  );
}
