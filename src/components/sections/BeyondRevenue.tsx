"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import clsx from "clsx";
import { Container, Reveal, SplitWords } from "../ui/primitives";
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
    <div className="theme-red relative isolate bg-[#7a0208] text-fg">
      {/* Profundidade no vermelho, sem emendas nas bordas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_45%_at_72%_38%,rgba(250,10,21,.5),transparent_72%)]"
      />

      {/* No telefone a copy rola antes e o trecho fixo carrega só o card, de modo
          que a animação comece exatamente quando ele está centralizado na tela.
          No desktop os dois dividem a mesma viewport, como antes. */}
      <Container className="pt-24 sm:pt-32 lg:hidden">
        <Copy chips={<StaticChips />} />
      </Container>

      <section ref={ref} className="relative h-[220vh] lg:h-[300vh]">
        <div className="sticky top-0 flex min-h-screen items-center overflow-hidden py-16 lg:py-24">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_80%_50%,rgba(255,255,255,.07),transparent_72%)]" />
          <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="hidden lg:block">
              <Copy
                chips={
                  <div className="mt-8 flex flex-wrap gap-2">
                    {METRICS.map((m, i) => (
                      <Chip key={m.key} label={m.key} index={i} progress={scrollYProgress} />
                    ))}
                  </div>
                }
              />
            </div>

            <OfferCard progress={scrollYProgress} />
          </Container>
        </div>
      </section>
    </div>
  );
}

/** Copy da seção — usada acima do trecho fixo no mobile e dentro dele no desktop. */
function Copy({ chips }: { chips: React.ReactNode }) {
  return (
    <div>
      <SplitWords text="Pare de olhar só para *faturamento." className="display text-4xl sm:text-5xl lg:text-6xl" />
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-md text-lg text-fg-2">
          Faturamento alto não significa operação saudável. Veja o que realmente importa em cada oferta:
        </p>
      </Reveal>
      {chips}
      <Reveal delay={0.2}>
        <p className="mt-8 max-w-md text-sm text-fg-3">
          Tudo atualizado para você entender rapidamente onde está ganhando dinheiro e onde está perdendo.
        </p>
      </Reveal>
    </div>
  );
}

/** No mobile os chips não acompanham o scroll: o card é que fica sob o olhar. */
function StaticChips() {
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {METRICS.map((m, i) => (
        <span
          key={m.key}
          className={clsx(
            "rounded-full border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider",
            i >= 3 ? "border-green/70 bg-green/25 text-white" : "border-white/25 bg-white/10 text-white/75",
          )}
        >
          {m.key}
        </span>
      ))}
    </div>
  );
}

function Chip({ label, index, progress }: { label: string; index: number; progress: MotionValue<number> }) {
  const start = 0.1 + index * 0.16;
  // Lucro e margem — o que de fato sobra — usam verde; o resto usa o vermelho da marca.
  const isResult = index >= 3;
  // Sobre o vermelho: o ativo "comum" vira branco translúcido e o de resultado, verde claro.
  const tint = isResult ? "rgba(110,231,160," : "rgba(255,255,255,";
  const bg = useTransform(progress, [start, start + 0.08], ["rgba(255,255,255,0.08)", `${tint}0.26)`]);
  const color = useTransform(progress, [start, start + 0.08], ["rgba(255,255,255,0.7)", "#ffffff"]);
  const border = useTransform(progress, [start, start + 0.08], ["rgba(255,255,255,0.22)", `${tint}0.85)`]);
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
    <motion.div style={{ y }} className="theme-dark relative">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-black/40 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#08080a]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_30px_80px_-40px_rgba(0,0,0,.95)] backdrop-blur-2xl">
        {/* brilho de topo — mantém a leitura de vidro sobre a base escura */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.06] to-transparent" />
        <div className="relative flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
          <div>
            <div className="text-[11px] text-fg-3">Oferta</div>
            <div className="text-base font-bold tracking-tight">{OFFER.violao.name} · Completo</div>
          </div>
          <span className="rounded-full bg-white/[0.05] px-2.5 py-1 font-mono text-[10px] text-fg-2">Últimos 30 dias</span>
        </div>
        <div className="relative divide-y divide-white/[0.06]">
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
