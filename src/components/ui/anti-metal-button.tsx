"use client";

import clsx from "clsx";

/**
 * Column of dots shaped like a double chevron. Several of them sit side by side
 * inside the accent block; only the first is visible until the block expands.
 */
export function DoubleChevron({ index, dotColor }: { index: number; dotColor: string }) {
  const base = index * 0.12;
  const dots = [
    { cx: 2, cy: 2, d: 0 },
    { cx: 5, cy: 5, d: 0.05 },
    { cx: 8, cy: 8, d: 0.1 },
    { cx: 5, cy: 11, d: 0.15 },
    { cx: 2, cy: 14, d: 0.2 },
    { cx: 6, cy: 2, d: 0.05 },
    { cx: 9, cy: 5, d: 0.1 },
    { cx: 12, cy: 8, d: 0.15 },
    { cx: 9, cy: 11, d: 0.2 },
    { cx: 6, cy: 14, d: 0.25 },
  ];
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden focusable="false" className="shrink-0 overflow-visible">
      <g fill={dotColor}>
        {dots.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r="1" className="bd-dot" style={{ animationDelay: `${base + p.d}s` }} />
        ))}
      </g>
    </svg>
  );
}

/**
 * The accent block pinned to the left of a button. It holds a row of chevrons
 * and stretches across the whole surface on hover (`group/btn` on the parent).
 */
export function AntiMetalBlock({
  width,
  accentFrom = "#FF3B44",
  accentTo = "#D40510",
  dotColor = "#5c0004",
  className,
}: {
  width: number;
  accentFrom?: string;
  accentTo?: string;
  dotColor?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      style={{
        width,
        // Keeps exactly one chevron centred while the block is collapsed.
        paddingLeft: Math.max(12, (width - 14) / 2),
        background: `linear-gradient(180deg, ${accentFrom} 0%, ${accentTo} 100%)`,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.25)",
      }}
      className={clsx(
        "absolute bottom-1 left-1 top-1 z-10 flex items-center justify-start gap-2.5 overflow-hidden rounded-md pr-2.5",
        "transition-[width,gap] duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/btn:!w-[calc(100%-0.5rem)]",
        className,
      )}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <DoubleChevron key={i} index={i} dotColor={dotColor} />
      ))}
    </span>
  );
}
