import { cn } from "@/shared/utils";
import { CTA_PIXEL_COUNT } from "../constants";
import { getCtaPixelClassName } from "../utils";

const PIXEL_INDEXES: number[] = Array.from(
  { length: CTA_PIXEL_COUNT },
  (_, pixelIndex) => pixelIndex,
);

/**
 * Lưới ô vuông nền khối CTA cuối trang: vài ô sáng nhấp nháy, rê chuột qua ô
 * nào thì ô đó sáng tím rồi tắt dần. Toàn CSS, không JavaScript
 */
export function CtaPixelGrid() {
  return (
    <div className="absolute inset-0 -z-10 grid grid-cols-[repeat(auto-fill,56px)] justify-center [mask-image:radial-gradient(ellipse_75%_80%_at_50%_45%,black_35%,transparent_85%)]">
      {PIXEL_INDEXES.map((pixelIndex) => (
        <span
          key={pixelIndex}
          className={cn(
            "size-14 border-b border-r border-white/[0.05] transition-colors duration-1000 hover:bg-violet-400/25 hover:duration-0",
            getCtaPixelClassName(pixelIndex),
          )}
        />
      ))}
    </div>
  );
}
