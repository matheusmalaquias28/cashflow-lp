"use client";

/**
 * Tela de trackeamento avançado no Meta Ads: anel de cobertura, desempenho do
 * período e os contadores de recuperação, duplicidade e origem.
 * Todos os números são de uma operação fictícia de demonstração.
 */

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import clsx from "clsx";
import { Radar } from "lucide-react";
import { Label } from "./product";
import { EASE, Rolling } from "./bento";

const TOTAL = 214;
const RASTREADAS = 214;
const PCT = Math.round((RASTREADAS / TOTAL) * 100);

const COUNTERS = [
  { label: "Recuperadas", value: 9, pct: 4.2, tone: "green" as const },
  { label: "Duplicidades", value: 37, pct: 17.3, tone: "orange" as const },
  { label: "Sem origem", value: 0, pct: 0, tone: "muted" as const },
];

const EVENTS = [
  { l: "Eventos enviados (CAPI)", v: "1.284", tone: "white" as const },
  { l: "Qualidade do evento", v: "Boa", tone: "green" as const },
  { l: "Janela de atribuição", v: "7d clique · 1d view", tone: "white" as const },
];

const R = 46;
const C = 2 * Math.PI * R;

export function TrackingMeta() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <div ref={ref} className="flex h-full flex-col gap-3">
      <div className="grid flex-1 gap-3 lg:grid-cols-[minmax(230px,1fr)_1.7fr]">
        {/* Coluna da esquerda: anel de cobertura e, no desktop, as vendas rastreadas */}
        <div className="flex flex-col gap-3">
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-cyan/20 bg-[linear-gradient(180deg,rgba(34,211,238,.09),rgba(34,211,238,.02))] px-4 py-5">
            <div className="pointer-events-none absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-cyan/20 blur-3xl" />
            <div className="relative">
              <svg width="118" height="118" viewBox="0 0 118 118" className="-rotate-90">
                <circle cx="59" cy="59" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8" />
                <motion.circle
                  cx="59"
                  cy="59"
                  r={R}
                  fill="none"
                  stroke="var(--color-cyan)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  animate={inView ? { strokeDashoffset: C * (1 - PCT / 100) } : {}}
                  transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
                  style={{ filter: "drop-shadow(0 0 10px rgba(34,211,238,.55))" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[23px] font-bold leading-none tracking-tight">
                  <Rolling value={inView ? PCT : 0} suffix="%" duration={1600} />
                </span>
                <span className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.18em] text-fg-3">Rastreado</span>
              </div>
            </div>
            <div className="relative mt-3 text-[10px] text-fg-3">Última atividade: há 2 min</div>
          </div>

          {/* Desktop: fica embaixo do anel e encurta a altura do card */}
          <TrackedSales inView={inView} className="hidden lg:block" />
        </div>

        {/* Desempenho do período */}
        <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-card p-4">
          <div>
            <Label className="flex items-center gap-1.5">
              <Radar className="h-3 w-3" /> Desempenho do tracking
            </Label>
            <div className="mt-2 inline-flex rounded-md border border-white/[0.08] bg-[#0d0d0d] px-2 py-1 font-mono text-[9px] text-fg-2">
              Período · últimos 7 dias
            </div>
            <p className="mt-2 text-[11px] text-fg-2">
              {PCT}% das vendas foram rastreadas ({RASTREADAS} de {TOTAL}).
            </p>
          </div>

          {/* Mobile/tablet: continua dentro do painel, como antes */}
          <TrackedSales inView={inView} className="lg:hidden" />

          <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f]">
            {EVENTS.map((e) => (
              <div
                key={e.l}
                className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2 text-[10px] last:border-0"
              >
                <span className="text-fg-2">{e.l}</span>
                <span className={clsx("font-mono tabular text-[10px]", e.tone === "green" ? "text-green" : "text-fg")}>{e.v}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {COUNTERS.map((c, i) => (
              <div key={c.label} className="min-w-0 rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3">
                <span className="block font-mono text-[7px] uppercase leading-tight tracking-[0.02em] text-fg-3">
                  {c.label}
                </span>
                <div className="mt-1.5 flex items-baseline justify-between gap-1">
                  <span
                    className={clsx(
                      "text-[19px] font-bold leading-none tracking-tight",
                      c.tone === "green" && "text-green",
                      c.tone === "orange" && "text-orange",
                      c.tone === "muted" && "text-fg-3",
                    )}
                  >
                    <Rolling value={inView ? c.value : 0} duration={1400} />
                  </span>
                  <span className="shrink-0 font-mono text-[8px] text-fg-3">
                    {c.pct.toFixed(1).replace(".", ",")}%
                  </span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <motion.div
                    className={clsx(
                      "h-full rounded-full",
                      c.tone === "green" && "bg-green",
                      c.tone === "orange" && "bg-orange",
                      c.tone === "muted" && "bg-white/20",
                    )}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${Math.max(c.pct, 1.5)}%` } : {}}
                    transition={{ duration: 1, ease: EASE, delay: 0.4 + i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackedSales({ inView, className }: { inView: boolean; className?: string }) {
  return (
    <div className={clsx("rounded-lg border border-green/30 bg-[#0f1a12] p-4", className)}>
      <div className="text-[11px] font-semibold text-green">Vendas rastreadas</div>
      <div className="text-[9.5px] text-fg-3">anúncio de origem identificado</div>
      <div className="mt-2 text-[30px] font-bold leading-none tracking-tight text-green">
        <Rolling value={inView ? RASTREADAS : 0} duration={1600} />
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
        <motion.div
          className="h-full rounded-full bg-green shadow-[0_0_14px_rgba(34,197,94,.7)]"
          initial={{ width: 0 }}
          animate={inView ? { width: `${PCT}%` } : {}}
          transition={{ duration: 1.3, ease: EASE, delay: 0.3 }}
        />
      </div>
    </div>
  );
}
