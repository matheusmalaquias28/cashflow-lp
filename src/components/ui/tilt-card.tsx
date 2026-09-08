"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { useImageOk } from "@/lib/use-image-ok";

export interface InteractiveTiltCardProps {
  image?: { src: string; alt: string };
  /** Rendered when no image is given or the file fails to load. */
  fallback?: ReactNode;
  tiltFactor?: number;
  perspective?: number;
  borderRadius?: number;
  shadowColor?: string;
  shadowIntensity?: number;
  transitionDuration?: number;
  hoverScale?: number;
  glareEffect?: boolean;
  glareIntensity?: number;
  glareSize?: number;
  className?: string;
}

/**
 * Card that tilts toward the cursor in 3D, with an optional moving glare.
 * Falls back to a static card when the visitor asks for reduced motion.
 */
export function InteractiveTiltCard({
  image,
  fallback,
  tiltFactor = 15,
  perspective = 1000,
  borderRadius = 12,
  shadowColor = "rgba(0, 0, 0, 0.2)",
  shadowIntensity = 0.5,
  transitionDuration = 0.2,
  hoverScale = 1.05,
  glareEffect = true,
  glareIntensity = 0.5,
  glareSize = 80,
  className,
}: InteractiveTiltCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const imageOk = useImageOk(image?.src);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !isHovered || reduce) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
      setMouse({ x, y });
      setTilt({ x: -(y / 50) * tiltFactor, y: (x / 50) * tiltFactor });
    },
    [isHovered, tiltFactor, reduce],
  );

  const glareX = mouse.x / 2 + 50;
  const glareY = mouse.y / 2 + 50;
  const showImage = image && imageOk;

  return (
    <motion.div
      ref={cardRef}
      className={clsx("relative h-full w-full cursor-pointer", className)}
      style={{ perspective, transformStyle: "preserve-3d" }}
      animate={{ scale: isHovered && !reduce ? hoverScale : 1 }}
      transition={{ duration: transitionDuration, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius, transformStyle: "preserve-3d" }}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          boxShadow: isHovered
            ? `0 25px 50px -12px rgba(0, 0, 0, ${shadowIntensity})`
            : `0 10px 30px -10px ${shadowColor}`,
        }}
        transition={{ duration: transitionDuration, ease: "easeOut" }}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={image.alt}
            className="relative z-[1] h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="relative z-[1] h-full w-full">{fallback}</div>
        )}

        {glareEffect && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareIntensity}) 0%, rgba(255,255,255,0) ${glareSize}%)`,
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: transitionDuration }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export default InteractiveTiltCard;
