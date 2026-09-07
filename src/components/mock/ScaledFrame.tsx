"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders children at a fixed design width and scales them down to fit the
 * container, so dense product UI keeps its proportions on every viewport.
 */
export function ScaledFrame({
  width = 1200,
  ratio = 16 / 10,
  children,
  className,
}: {
  width?: number;
  ratio?: number;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const height = (width / ratio) * scale;

  return (
    <div ref={ref} className={className} style={{ height }}>
      <div style={{ width, height: width / ratio, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}
