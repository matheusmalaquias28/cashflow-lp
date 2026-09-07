"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

export const BRL = (n: number, digits = 0) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/* ---------- Counter ---------- */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  digits = 0,
  duration = 1.6,
  className,
  start = true,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  digits?: number;
  duration?: number;
  className?: string;
  start?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${prefix}${BRL(v, digits)}${suffix}`);
  const [display, setDisplay] = useState(`${prefix}${BRL(0, digits)}${suffix}`);

  useEffect(() => {
    const unsub = text.on("change", setDisplay);
    return unsub;
  }, [text]);

  useEffect(() => {
    if (!inView || !start) return;
    const ctrl = animate(mv, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return () => ctrl.stop();
  }, [inView, start, to, duration, mv]);

  return (
    <span ref={ref} className={clsx("tabular", className)}>
      {display}
    </span>
  );
}

/* ---------- Charts ---------- */

function smoothPath(points: [number, number][]) {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export function AreaChart({
  data,
  data2,
  width = 600,
  height = 200,
  color = "#FA0A15",
  color2 = "rgba(255,255,255,0.35)",
  className,
  id,
  draw = true,
  showGrid = true,
}: {
  data: number[];
  data2?: number[];
  width?: number;
  height?: number;
  color?: string;
  color2?: string;
  className?: string;
  id: string;
  draw?: boolean;
  showGrid?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const pad = 8;
  const all = [...data, ...(data2 ?? [])];
  const max = Math.max(...all) * 1.08;
  const min = Math.min(...all) * 0.85;

  const toPts = (arr: number[]): [number, number][] =>
    arr.map((v, i) => [
      pad + (i / (arr.length - 1)) * (width - pad * 2),
      height - pad - ((v - min) / (max - min)) * (height - pad * 2),
    ]);

  const pts = useMemo(() => toPts(data), [data]); // eslint-disable-line react-hooks/exhaustive-deps
  const pts2 = useMemo(() => (data2 ? toPts(data2) : null), [data2]); // eslint-disable-line react-hooks/exhaustive-deps
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1][0]} ${height} L ${pts[0][0]} ${height} Z`;

  return (
    <svg ref={ref} viewBox={`0 0 ${width} ${height}`} className={clsx("w-full h-auto", className)} fill="none">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showGrid &&
        [0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={pad}
            x2={width - pad}
            y1={height * f}
            y2={height * f}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="2 6"
          />
        ))}
      <motion.path
        d={area}
        fill={`url(#${id}-fill)`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.8 }}
      />
      {pts2 && (
        <motion.path
          d={smoothPath(pts2)}
          stroke={color2}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />
      )}
      <motion.path
        d={line}
        stroke={color}
        strokeWidth="2.25"
        strokeLinecap="round"
        initial={{ pathLength: draw ? 0 : 1 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="4"
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 1.6, duration: 0.4 }}
        style={{ transformOrigin: `${pts[pts.length - 1][0]}px ${pts[pts.length - 1][1]}px` }}
      />
      <motion.circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="4"
        fill={color}
        className="animate-pulse-dot"
        style={{ transformOrigin: `${pts[pts.length - 1][0]}px ${pts[pts.length - 1][1]}px` }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.8 }}
      />
    </svg>
  );
}

export function Sparkline({
  data,
  color = "#FA0A15",
  className,
  width = 96,
  height = 28,
}: {
  data: number[];
  color?: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts: [number, number][] = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - 2 - ((v - min) / (max - min || 1)) * (height - 4),
  ]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} width={width} height={height} fill="none">
      <motion.path
        d={smoothPath(pts)}
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
    </svg>
  );
}

export function Bars({
  data,
  color = "#FA0A15",
  height = 120,
  className,
  highlight,
}: {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
  highlight?: number;
}) {
  const max = Math.max(...data);
  return (
    <div className={clsx("flex items-end gap-1.5", className)} style={{ height }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-[3px]"
          style={{
            background:
              highlight === undefined || highlight === i
                ? color
                : "rgba(255,255,255,0.12)",
            transformOrigin: "bottom",
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ height: (v / max) * height }} />
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Bits ---------- */

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "red" | "green" | "white";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] tabular tracking-wide",
        tone === "neutral" && "bg-white/[0.06] text-fg-2",
        tone === "red" && "bg-red/15 text-red",
        tone === "green" && "bg-green/15 text-green",
        tone === "white" && "bg-white text-black",
        className,
      )}
    >
      {children}
    </span>
  );
}

export const PLATFORM_COLORS: Record<string, string> = {
  Hotmart: "#F04E23",
  Kiwify: "#6E3AFF",
  Kirvano: "#12C48B",
  Cakto: "#7C3AED",
  Wiapy: "#38BDF8",
  GGCheckout: "#FBBF24",
  Kavoo: "#EC4899",
  Lastlink: "#A3E635",
  Payt: "#3B82F6",
  Ticto: "#F97316",
  Hubla: "#10B981",
  "Vega Checkout": "#8B5CF6",
  Doppus: "#14B8A6",
  Greenn: "#00E38C",
  Zouti: "#2F80ED",
  "Meta Ads": "#0866FF",
};

export function PlatformDot({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={clsx("inline-block h-2 w-2 rounded-full", className)}
      style={{ background: PLATFORM_COLORS[name] ?? "#fff" }}
    />
  );
}

export function Window({
  children,
  className,
  title,
  chrome = true,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  chrome?: boolean;
}) {
  return (
    <div className={clsx("panel overflow-hidden", className)}>
      {chrome && (
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          {title && <span className="ml-3 font-mono text-[11px] text-fg-3">{title}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
