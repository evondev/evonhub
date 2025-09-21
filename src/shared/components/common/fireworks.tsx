"use client";

import { cn } from "@/shared/utils";
import { create as createConfetti, CreateTypes } from "canvas-confetti";
import { useEffect, useRef } from "react";

export interface FireworksProps {
  className?: string;
}

export default function Fireworks({ className = "" }: FireworksProps) {
  let confettiButton: CreateTypes | null = null;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireExplosion = async () => {
    if (!canvasRef.current) return;
    if (!confettiButton) {
      confettiButton = createConfetti(canvasRef.current, {
        resize: true,
      });
    }

    return confettiButton({
      particleCount: 600,
      startVelocity: 100,
      spread: 1660,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2,
      },
    });
  };

  useEffect(() => {
    fireExplosion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 pointer-events-none select-none",
        className
      )}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
