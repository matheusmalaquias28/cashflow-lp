"use client";

import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { BRL } from "./atoms";

export const EASE = [0.16, 1, 0.3, 1] as const;

/* =====================================================================
   Timers that only run while the card is on screen
   ===================================================================== */

export function useLiveInterval(ms: number, cb: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduce = useReducedMotion();
  const saved = useRef(cb);

  useEffect(() => {
    saved.current = cb;
  }, [cb]);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => saved.current(), ms);
    return () => clearInterval(id);
  }, [inView, ms, reduce]);

  return ref;
}

/** Counter that advances on every beat while the card is visible. */
export function useLiveBeat(ms: number) {
  const [tick, setTick] = useState(0);
  const ref = useLiveInterval(ms, () => setTick((t) => t + 1));
  return { ref, tick };
}

/* =====================================================================
   Numbers
   ===================================================================== */

/** Number that eases toward whatever value it is given. */
export function Rolling({
  value,
  prefix = "",
  suffix = "",
  digits = 0,
  className,
  duration = 900,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  digits?: number;
  className?: string;
  duration?: number;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const a = from.current;
    const b = value;
    from.current = value;
    if (a === b) return;
    const start = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setShown(a + (b - a) * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <span className={clsx("tabular", className)}>
      {prefix}
      {BRL(shown, digits)}
      {suffix}
    </span>
  );
}

/* =====================================================================
   Live area chart that scrolls continuously
   ===================================================================== */

/* Two points sit outside the visible area (one per side) so the curve can
   scroll a full step and be reset without any visible seam. */
export const CHART_W = 600;
export const CHART_H = 150;
export const POINTS = 34;
export const STEP = CHART_W / (POINTS - 3);
const DOMAIN_MIN = 6;
const DOMAIN_MAX = 114;

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const xFor = (i: number) => (i - 1) * STEP;
const yFor = (v: number) => CHART_H - ((v - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * CHART_H;

/** Deterministic seed so server and client render the same first frame. */
export const makeSeed = (phase = 0) =>
  Array.from({ length: POINTS }, (_, i) =>
    clamp(52 + Math.sin((i + phase) / 2.7) * 14 + Math.sin((i + phase) / 6.3) * 12 + (i % 4) * 2.5, 20, 98),
  );

/** Shifts the window one step to the left and appends a new bounded value. */
export const advanceSeries = (prev: number[], beat: number) => {
  const last = prev[prev.length - 1];
  const drift = Math.sin(beat / 5) * 3.2;
  return [...prev.slice(1), clamp(last + drift + (Math.random() * 9 - 4.2), 20, 98)];
};

/** Catmull-Rom style smoothing, the curve language used across the mockups. */
export function smoothPath(points: [number, number][]) {
  if (points.length < 2) return "";
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

export function ScrollingAreaChart({
  series,
  version,
  ms,
  id,
  className,
  minHeight = 104,
}: {
  series: number[];
  /** Increments once per step — resets the scroll so it never drifts. */
  version: number;
  ms: number;
  id: string;
  className?: string;
  minHeight?: number;
}) {
  const pts: [number, number][] = series.map((v, i) => [xFor(i), yFor(v)]);
  const line = smoothPath(pts);
  const area = `${line} L ${xFor(POINTS - 1)} ${CHART_H} L ${xFor(0)} ${CHART_H} Z`;
  const headPct = (yFor(series[POINTS - 1]) / CHART_H) * 100;

  return (
    <div className={clsx("relative", className)} style={{ minHeight }}>
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FA0A15" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#FA0A15" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#FA0A15" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#830006" />
            <stop offset="45%" stopColor="#FA0A15" />
            <stop offset="100%" stopColor="#FF6169" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <linearGradient id={`${id}-maskgrad`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" />
            <stop offset="9%" stopColor="#fff" />
            <stop offset="100%" stopColor="#fff" />
          </linearGradient>
          <mask id={`${id}-edge`}>
            <rect x="0" y="0" width={CHART_W} height={CHART_H} fill={`url(#${id}-maskgrad)`} />
          </mask>
        </defs>

        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={CHART_W}
            y1={CHART_H * f}
            y2={CHART_H * f}
            stroke="rgba(255,255,255,0.055)"
            strokeDasharray="3 9"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <g mask={`url(#${id}-edge)`}>
          <motion.g
            key={version}
            initial={{ x: 0 }}
            animate={{ x: -STEP }}
            transition={{ duration: ms / 1000, ease: "linear" }}
          >
            <path d={area} fill={`url(#${id}-fill)`} />
            <path
              d={line}
              stroke="#FA0A15"
              strokeWidth="6"
              opacity="0.4"
              filter={`url(#${id}-glow)`}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={line}
              stroke={`url(#${id}-stroke)`}
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </motion.g>
        </g>

        <line
          x1={CHART_W}
          x2={CHART_W}
          y1="0"
          y2={CHART_H}
          stroke="rgba(255,255,255,0.14)"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Head marker lives in DOM space so it stays a perfect circle */}
      <motion.div
        className="pointer-events-none absolute right-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2"
        animate={{ top: `${headPct}%` }}
        transition={{ duration: ms / 1000, ease: "linear" }}
      >
        <span className="absolute inset-0 rounded-full bg-red animate-pulse-dot" />
        <span className="absolute inset-0 rounded-full bg-red shadow-[0_0_12px_rgba(250,10,21,.9)]" />
      </motion.div>
    </div>
  );
}

/* =====================================================================
   Bento card shell — glass, ambient light, cursor spotlight
   ===================================================================== */

export function BentoCard({
  icon: Icon,
  title,
  text,
  children,
  className,
  index,
  accent = false,
  tone = "red",
  mediaClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  children: React.ReactNode;
  className?: string;
  index: number;
  accent?: boolean;
  tone?: "red" | "green";
  mediaClassName?: string;
}) {
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const sx = useSpring(mx, { stiffness: 200, damping: 28 });
  const sy = useSpring(my, { stiffness: 200, damping: 28 });
  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${sx}px ${sy}px, rgba(250,10,21,0.14), transparent 65%)`;
  const edge = useMotionTemplate`radial-gradient(400px circle at ${sx}px ${sy}px, rgba(250,10,21,0.5), transparent 60%)`;
  const green = accent && tone === "green";

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: index * 0.07, ease: EASE }}
      className={clsx("group relative", className)}
    >
      <div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(e.clientX - r.left);
          my.set(e.clientY - r.top);
        }}
        onMouseLeave={() => {
          mx.set(-400);
          my.set(-400);
        }}
        className={clsx(
          "relative flex h-full flex-col overflow-hidden rounded-2xl border backdrop-blur-xl",
          "bg-gradient-to-b from-white/[0.09] to-white/[0.02]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_30px_80px_-40px_rgba(0,0,0,0.9)]",
          accent ? (green ? "border-green/25" : "border-red/30") : "border-white/[0.11]",
        )}
      >
        {/* Cursor-follow border light */}
        <motion.div
          aria-hidden
          style={{ background: edge }}
          className="pointer-events-none absolute -inset-px rounded-2xl p-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 [mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] [mask-composite:exclude]"
        />
        {/* Cursor-follow inner glow */}
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Frosted sheen */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />

        {/* Ambient light blobs */}
        <motion.div
          aria-hidden
          className={clsx(
            "pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full blur-3xl",
            green ? "bg-green/25" : "bg-red-deep/60",
          )}
          animate={{ opacity: [0.45, 0.85, 0.45], scale: [1, 1.18, 1] }}
          transition={{ duration: 9 + index, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className={clsx(
            "pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full blur-3xl",
            green ? "bg-green/20" : accent ? "bg-red/25" : "bg-red-deep/40",
          )}
          animate={{ opacity: [0.3, 0.65, 0.3] }}
          transition={{ duration: 11 - index * 0.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.6 }}
        />
        {/* Top edge highlight */}
        <div aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className={clsx("relative flex-1 overflow-hidden p-4 sm:p-5", mediaClassName)}>{children}</div>

        <div className="relative border-t border-white/[0.07] bg-black/20 p-5">
          <div className="flex items-center gap-2.5">
            <span
              className={clsx(
                "flex h-7 w-7 items-center justify-center rounded-lg border",
                green
                  ? "border-green/40 bg-green/15 text-green"
                  : accent
                    ? "border-red/40 bg-red/15 text-red"
                    : "border-white/10 bg-white/[0.04] text-red",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <h3 className="font-bold tracking-tight">{title}</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-fg-2">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}
