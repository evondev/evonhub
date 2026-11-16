import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { CloudLightning, Sun, Volume2, VolumeX } from "lucide-react";

interface HouseControlsProps {
  isNight: boolean;
  isGhost: boolean;
  isAutoRotate: boolean;
  isSoundOn: boolean;
  isStorm: boolean;
  /** Chỉ nhà của mình, chưa ở bậc cao nhất mới có nút xem trước bậc kế */
  canPreviewNext: boolean;
  onToggleNight: () => void;
  onToggleGhost: () => void;
  onToggleAutoRotate: () => void;
  onToggleSound: () => void;
  onToggleStorm: () => void;
}

function getToggleClassName(isPressed: boolean): string {
  // Nền đặc: cảnh đêm phía sau rất tối, nền trong suốt làm chữ chìm mất.
  return cn("bg-surface shadow-sm hover:bg-surface", isPressed && "border-primary text-primary");
}

export function HouseControls({
  isNight,
  isGhost,
  isAutoRotate,
  isSoundOn,
  isStorm,
  canPreviewNext,
  onToggleNight,
  onToggleGhost,
  onToggleAutoRotate,
  onToggleSound,
  onToggleStorm,
}: HouseControlsProps) {
  return (
    <div className="pointer-events-auto flex flex-wrap gap-2">
      {canPreviewNext && (
        <Button variant="outline" size="sm" aria-pressed={isGhost} className={getToggleClassName(isGhost)} onClick={onToggleGhost}>
          Bậc kế có gì
        </Button>
      )}
      <Button variant="outline" size="sm" aria-pressed={isNight} className={getToggleClassName(isNight)} onClick={onToggleNight}>
        Ban đêm
      </Button>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={isAutoRotate}
        className={getToggleClassName(isAutoRotate)}
        onClick={onToggleAutoRotate}
      >
        Tự xoay
      </Button>
      <Button variant="outline" size="sm" aria-pressed={isSoundOn} className={getToggleClassName(isSoundOn)} onClick={onToggleSound}>
        {isSoundOn && <Volume2 aria-hidden className="size-4" />}
        {!isSoundOn && <VolumeX aria-hidden className="size-4" />}
        Âm thanh
      </Button>
      <Button variant="outline" size="sm" aria-pressed={isStorm} className={getToggleClassName(isStorm)} onClick={onToggleStorm}>
        {isStorm && <Sun aria-hidden className="size-4" />}
        {!isStorm && <CloudLightning aria-hidden className="size-4" />}
        {isStorm ? "Tạnh mưa" : "Mưa bão"}
      </Button>
    </div>
  );
}
