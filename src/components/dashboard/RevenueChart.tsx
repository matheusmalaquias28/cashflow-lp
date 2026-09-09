"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

// Continuous, self-scrolling revenue chart. It eases a display value toward the
// live `value` every animation frame and samples it into a rolling buffer, so
// the curve grows fluidly (no discrete jumps). Grid + axes re-derive from the
// visible window each frame, so the faturamento milestones and times grow too.

const N = 160; // samples in the window
const SAMPLE_MS = 30; // ~33 fps scroll
const EASE_TAU = 1100; // ms — how fast the line chases the live value

const W = 680;
const H = 264;
const PAD_L = 52;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 26;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const BASE_Y = PAD_T + PLOT_H;

type Pt = { v: number; t: number };

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

function niceStep(raw: number) {
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / pow;
  const step = n >= 5 ? 5 : n >= 2 ? 2 : 1;
  return step * pow;
}

const fmtK = (v: number) =>
  `R$ ${(v / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}k`;

const fmtTime = (t: number) =>
  new Date(t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

// Deterministic seed (no Date/Math.random) so SSR and first client render match.
function seed(base: number): Pt[] {
  return Array.from({ length: N }, (_, i) => ({
    v: base - (N - 1 - i) * 34 + Math.sin(i * 0.24) * 260,
    t: 0,
  }));
}

export function RevenueChart({ value, className }: { value: number; className?: string }) {
  const [pts, setPts] = useState<Pt[]>(() => seed(value));
  const [mounted, setMounted] = useState(false);
  const targetRef = useRef(value);

  useEffect(() => {
    targetRef.current = value;
  }, [value]);

  useEffect(() => {
    setMounted(true);
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let display = targetRef.current;

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      acc += dt;
      display += (targetRef.current - display) * (1 - Math.exp(-dt / EASE_TAU));
      if (acc >= SAMPLE_MS) {
        acc = 0;
        const t = Date.now();
        setPts((prev) => [...prev.slice(1), { v: display, t }]);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const vals = pts.map((p) => p.v);
  const prevVals = vals.map((v) => v * 0.82);
  const min = Math.min(...vals, ...prevVals);
  const max = Math.max(...vals, ...prevVals);
  const pad = (max - min) * 0.14 + 1;
  const lo = min - pad;
  const hi = max + pad;
  const range = hi - lo || 1;

  const toX = (i: number) => PAD_L + (i / (N - 1)) * PLOT_W;
  const toY = (v: number) => PAD_T + (1 - (v - lo) / range) * PLOT_H;

  const linePts: [number, number][] = vals.map((v, i) => [toX(i), toY(v)]);
  const prevLinePts: [number, number][] = prevVals.map((v, i) => [toX(i), toY(v)]);
  const line = smoothPath(linePts);
  const area = `${line} L ${toX(N - 1)} ${BASE_Y} L ${toX(0)} ${BASE_Y} Z`;
  const head = linePts[linePts.length - 1];

  // Horizontal grid — faturamento milestones on the left.
  const step = niceStep(range / 4);
  const milestones: number[] = [];
  for (let m = Math.ceil(lo / step) * step; m <= hi; m += step) milestones.push(m);

  // Vertical grid — times along the bottom.
  const cols = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={clsx("h-auto w-full overflow-visible", className)}
      fill="none"
    >
      <defs>
        <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FA0A15" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#FA0A15" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid + Y milestones */}
      {milestones.map((m) => {
        const y = toY(m);
        return (
          <g key={`h-${Math.round(m)}`}>
            <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="rgba(255,255,255,0.07)" strokeDasharray="2 6" />
            <text x={PAD_L - 10} y={y + 3} textAnchor="end" className="fill-white/40" style={{ fontSize: 10 }}>
              {fmtK(m)}
            </text>
          </g>
        );
      })}

      {/* Vertical grid + X times */}
      {cols.map((c, k) => {
        const x = PAD_L + c * PLOT_W;
        const idx = Math.min(N - 1, Math.round(c * (N - 1)));
        const t = pts[idx]?.t ?? 0;
        return (
          <g key={`v-${k}`}>
            <line x1={x} x2={x} y1={PAD_T} y2={BASE_Y} stroke="rgba(255,255,255,0.05)" />
            {mounted && t > 0 && (
              <text
                x={x}
                y={H - 8}
                textAnchor={k === 0 ? "start" : k === cols.length - 1 ? "end" : "middle"}
                className="fill-white/35"
                style={{ fontSize: 9 }}
              >
                {fmtTime(t)}
              </text>
            )}
          </g>
        );
      })}

      {/* Área */}
      <path d={area} fill="url(#rev-fill)" />

      {/* Período anterior */}
      <path
        d={smoothPath(prevLinePts)}
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        vectorEffect="non-scaling-stroke"
      />

      {/* Atual */}
      <path d={line} stroke="#FA0A15" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

      {/* Head marker — glued to the end of the line */}
      <circle cx={head[0]} cy={head[1]} r="5" className="animate-pulse-dot" fill="#FA0A15" style={{ transformOrigin: `${head[0]}px ${head[1]}px` }} />
      <circle cx={head[0]} cy={head[1]} r="4" fill="#FA0A15" />
    </svg>
  );
}
