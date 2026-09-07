"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import clsx from "clsx";
import { Container, Eyebrow, Reveal, SplitWords } from "../ui/primitives";
import { BRL } from "../mock/atoms";
import { OFFER } from "@/lib/data";

const METRICS = [
  { key: "Receita", value: 42800, fmt: (v: number) => `R$ ${BRL(v)}`, note: "O número que todo mundo olha." },
  { key: "Investimento", value: 18200, fmt: (v: number) => `R$ ${BRL(v)}`, note: "O que você colocou no Meta Ads." },
  { key: "ROAS", value: 2.35, fmt: (v: number) => v.toFixed(2).replace(".", ","), note: "Retorno sobre o investimento." },
  { key: "Lucro", value: 7640, fmt: (v: number) => `R$ ${BRL(v)}`, note: "Depois de taxas, impostos e custos." },
  { key: "Margem", value: 17.8, fmt: (v: number) => `${v.toFixed(1).replace(".", ",")}%`, note: "O que realmente sobra de cada real." },
];

export function BeyondRevenue() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section ref={ref} className="relative h-[320vh] sm:h-[300vh]">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_80%_50%,rgba(131,0,6,.35),transparent_70%)]" />
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>Resultado por oferta</Eyebrow>
            </Reveal>
            <SplitWords
              text="Pare de olhar só para *faturamento."
              className="display mt-5 text-4xl sm:text-5xl lg:text-6xl"
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg text-fg-2">
                Faturamento alto não significa operação saudável. Veja o que realmente importa em cada oferta:
              </p>
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-2">
              {METRICS.map((m, i) => (
                <Chip key={m.key} label={m.key} index={i} progress={scrollYProgress} />
              ))}
            </div>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-sm text-fg-3">
                Tudo atualizado para você entender rapidamente onde está ganhando dinheiro e onde está perdendo.
              </p>
            </Reveal>
          </div>

          <OfferCard progress={scrollYProgress} />
        </Container>
      </div>
    </section>
  );
}

function Chip({ label, index, progress }: { label: string; index: number; progress: MotionValue<number> }) {
  const start = 0.1 + index * 0.16;
  // Lucro e margem — o que de fato sobra — usam verde; o resto usa o vermelho da marca.
  const isResult = index >= 3;
  const tint = isResult ? "rgba(34,197,94," : "rgba(250,10,21,";
  const bg = useTransform(progress, [start, start + 0.08], ["rgba(255,255,255,0.03)", `${tint}0.15)`]);
  const color = useTransform(progress, [start, start + 0.08], ["rgba(255,255,255,0.4)", "#ffffff"]);
  const border = useTransform(progress, [start, start + 0.08], ["rgba(255,255,255,0.08)", `${tint}0.5)`]);
  return (
    <motion.span
      style={{ background: bg, color, borderColor: border }}
      className="rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider"
    >
      {label}
    </motion.span>
  );
}

function OfferCard({ progress }: { progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], [40, -40]);
  return (
    <motion.div style={{ y }} className="relative">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-red-deep/25 blur-3xl" />
      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <div className="text-[11px] text-fg-3">Oferta</div>
            <div className="text-base font-bold tracking-tight">{OFFER.violao.name} · Completo</div>
          </div>
          <span className="rounded-full bg-white/[0.05] px-2.5 py-1 font-mono text-[10px] text-fg-2">Últimos 30 dias</span>
        </div>
        <div className="divide-y divide-line">
          {METRICS.map((m, i) => (
            <MetricRow key={m.key} metric={m} index={i} progress={progress} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MetricRow({
  metric,
  index,
  progress,
}: {
  metric: (typeof METRICS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.1 + index * 0.16;
  const opacity = useTransform(progress, [start, start + 0.08], [0.18, 1]);
  const x = useTransform(progress, [start, start + 0.08], [12, 0]);
    const value = useTransform(progress, [start, start + 0.1], [0, metric.value]);
  const text = useTransform(value, (v) => metric.fmt(v));
  const barW = useTransform(progress, [start, start + 0.12], ["0%", `${[100, 42, 48, 18, 18][index]}%`]);
  const isLast = index >= 3;

  return (
    <motion.div style={{ opacity }} className={clsx("relative px-6 py-4 sm:py-5", isLast && "bg-green/[0.05]")}>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className={clsx("text-sm font-semibold", isLast ? "text-green" : "text-fg")}>{metric.key}</div>
          <div className="mt-0.5 text-[11px] text-fg-3">{metric.note}</div>
        </div>
        <motion.div
          style={{ x }}
          className={clsx("font-mono text-xl tabular sm:text-2xl", isLast ? "text-green" : "text-fg")}
        >
          {text}
        </motion.div>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div style={{ width: barW }} className={clsx("h-full", isLast ? "bg-green" : "bg-white/40")} />
      </div>
    </motion.div>
  );
}
