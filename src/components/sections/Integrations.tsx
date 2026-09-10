"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";
import clsx from "clsx";
import { Container, Reveal, Section, SectionHeader } from "../ui/primitives";
import { INTEGRATIONS, LOGOS } from "@/lib/data";
import { PLATFORM_COLORS } from "../mock/atoms";
import { useImageOk } from "@/lib/use-image-ok";

/**
 * Brand mark. Uses the official logo from /public/integrations when available
 * (all normalized to the same height); otherwise a monogram in the brand color.
 */
export function BrandMark({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const file = LOGOS[name];
  const color = PLATFORM_COLORS[name] ?? "#fff";
  const h = size === "lg" ? "h-8 w-[128px]" : "h-7 w-[112px]";
  const ok = useImageOk(file ? `/integrations/${file}.png` : null);
  if (file && ok) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/integrations/${file}.png`}
        alt={name}
        className={clsx("shrink-0 object-contain", h)}
        draggable={false}
        loading="lazy"
      />
    );
  }
  return (
    <span className={clsx("flex items-center justify-center gap-2 whitespace-nowrap", h)}>
      <span
        className={clsx("flex shrink-0 items-center justify-center rounded-md font-bold text-black", size === "lg" ? "h-7 w-7 text-sm" : "h-6 w-6 text-xs")}
        style={{ background: color }}
      >
        {name[0]}
      </span>
      <span className={clsx("font-bold tracking-tight", size === "lg" ? "text-base" : "text-sm")}>{name}</span>
    </span>
  );
}

const ALL = [...INTEGRATIONS, "Meta Ads"];
// No mobile o hub mostra só as plataformas mais conhecidas; o resto fica empilhado.
const KNOWN = ["Hotmart", "Kiwify", "Kirvano", "Cakto", "Ticto", "Hubla"];
const REST = ALL.filter((n) => !KNOWN.includes(n));

export function Integrations() {
  return (
    <Section id="integracoes" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-line-2 to-transparent" />
      <Container>
        <SectionHeader
          eyebrow="Integrações"
          title="Tudo conectado em *um *só *lugar."
          lead="Integre o Cashflow às principais plataformas utilizadas por operações de Lowticket. E conecte suas contas do Meta Ads para trazer os dados de tráfego para dentro da operação."
        />

        <Reveal className="mt-16" amount={0.2}>
          {/* Desktop: todas as plataformas */}
          <Hub items={ALL} id="d" className="hidden md:block" />
          {/* Mobile: só as mais conhecidas */}
          <Hub items={KNOWN} id="m" compact className="md:hidden" />
        </Reveal>

        {/* Demais plataformas — empilhadas abaixo (só no mobile) */}
        <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-fg-3 md:hidden">
          E muitas outras
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:hidden">
          {REST.map((n, i) => (
            <Tile key={n} name={n} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ----- Hub: logos orbit → lines converge into Cashflow ----- */

function Hub({
  items,
  id,
  className,
  compact = false,
}: {
  items: string[];
  id: string;
  className?: string;
  compact?: boolean;
}) {
  const W = compact ? 440 : 1000;
  const H = compact ? 440 : 420;
  const cx = W / 2;
  const cy = H / 2;
  const rx = compact ? 150 : 450;
  const ry = compact ? 150 : 175;
  const positions = items.map((_, i) => {
    const t = i / items.length;
    const ang = t * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(ang) * rx, y: cy + Math.sin(ang) * ry };
  });
  const gid = `hub-glow-${id}`;

  return (
    <div className={clsx("relative mx-auto w-full max-w-5xl py-6 min-[1921px]:max-w-[1400px]", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" fill="none">
        <defs>
          <radialGradient id={gid} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FA0A15" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#830006" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#830006" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={compact ? 150 : 200} fill={`url(#${gid})`} />
        {positions.map((p, i) => {
          const mx = (p.x + cx) / 2;
          const d = `M ${p.x} ${p.y} Q ${mx} ${p.y} ${cx} ${cy}`;
          const color = PLATFORM_COLORS[items[i]] ?? "#fff";
          return (
            <g key={i}>
              <motion.path
                d={d}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: i * 0.05, ease: "easeOut" }}
              />
              <motion.path
                d={d}
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="6 120"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.9 }}
                viewport={{ once: true }}
                transition={{ delay: 1 + i * 0.05 }}
                style={{ animation: `dash-flow ${2.2 + (i % 5) * 0.35}s linear infinite`, animationDelay: `${i * 0.18}s` }}
              />
            </g>
          );
        })}
      </svg>

      {/* Center */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
        className={clsx(
          "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-red/40 bg-[#0a0a0b] shadow-[0_0_80px_rgba(250,10,21,.45)]",
          compact ? "h-16 w-16" : "h-24 w-24",
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-icon.svg" alt="Cashflow" className={compact ? "h-8 w-8" : "h-12 w-12"} />
        <span className="absolute -inset-1 -z-10 rounded-[1.75rem] border border-red/20 animate-[pulse-ring_2.4s_ease-out_infinite]" />
      </motion.div>

      {/* Orbiting logos */}
      {positions.map((p, i) => (
        <motion.div
          key={items[i]}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            className={clsx(
              "flex w-max items-center rounded-xl border border-line bg-[#0c0c0d]/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,.8)] backdrop-blur",
              compact ? "h-9 px-2.5" : "h-12 px-4",
            )}
          >
            <BrandMark name={items[i]} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

/* ----- Magnetic tile ----- */

function Tile({ name, index }: { name: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 20 });
  const y = useSpring(my, { stiffness: 250, damping: 20 });
  const color = PLATFORM_COLORS[name] ?? "#fff";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.6 }}
    >
      <motion.div
        ref={ref}
        style={{ x, y }}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width - 0.5) * 10);
          my.set(((e.clientY - r.top) / r.height - 0.5) * 10);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="group relative flex h-20 items-center justify-center overflow-hidden rounded-xl border border-line bg-white/[0.02] px-4 transition-colors duration-300 hover:border-line-2"
      >
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(120px 60px at 50% 100%, ${color}33, transparent)` }}
        />
        <span className="relative transition-transform duration-300 group-hover:scale-105">
          <BrandMark name={name} size="lg" />
        </span>
      </motion.div>
    </motion.div>
  );
}
