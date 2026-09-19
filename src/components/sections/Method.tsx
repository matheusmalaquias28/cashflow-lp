"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import { Layers, MousePointerClick, Radar, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container, Reveal, Section, SplitWords } from "../ui/primitives";

/**
 * "Qual é o diferencial da Cashflow" contado como diagrama: três áreas da
 * operação que descem por linhas que se encontram num único nó de resultado.
 * Fundo branco (theme-light) para emendar com a seção de depoimentos.
 */

type Pillar = {
  n: string;
  icon: LucideIcon;
  title: string;
  desc: string;
};

const PILLARS: Pillar[] = [
  {
    n: "01",
    icon: Layers,
    title: "Gestão de múltiplas ofertas",
    desc: "Todas as ofertas da operação num só painel, com o resultado individual de cada uma.",
  },
  {
    n: "02",
    icon: Radar,
    title: "Tráfego pago & trackeamento avançado",
    desc: "A origem real de cada venda, conectada ao investimento que a gerou no Meta Ads.",
  },
  {
    n: "03",
    icon: Wallet,
    title: "Gestão financeira empresarial",
    desc: "Entradas, saídas e compromissos da empresa inteira no mesmo lugar.",
  },
];

const RESULT = [
  { label: "Investiu", value: "R$ 38.420", tone: "muted" as const },
  { label: "Faturou", value: "R$ 127.960", tone: "muted" as const },
  { label: "Resultado", value: "R$ 74.190", tone: "green" as const },
];

export function Method() {
  return (
    <Section className="theme-light overflow-hidden bg-white pt-12 text-fg sm:pt-14 lg:pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,11,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,11,.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 65% 55% at 50% 40%, black, transparent 80%)",
        }}
      />

      <Container>
        <div className="text-center">
          <SplitWords
            text="Qual é o diferencial da Cashflow em relação a outras ferramentas de *trackeamento?"
            className="display mx-auto max-w-4xl text-balance text-4xl sm:text-5xl lg:text-6xl min-[1921px]:max-w-5xl min-[1921px]:text-7xl"
          />
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-fg-2 sm:text-lg min-[1921px]:text-xl">
              A maioria das ferramentas se concentra apenas em{" "}
              <span className="text-fg-3 line-through decoration-red/60">rastrear conversões</span> ou{" "}
              <span className="text-fg-3 line-through decoration-red/60">exibir métricas de campanhas</span>. A Cashflow
              foi desenvolvida para conectar <strong className="font-semibold text-fg">três áreas da operação</strong>.
            </p>
          </Reveal>
        </div>

        {/* Diagrama: 3 pilares → convergência → resultado */}
        <div className="mt-14 sm:mt-16">
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {PILLARS.map((p, i) => (
              <PillarCard key={p.n} pillar={p} delay={0.08 * i} />
            ))}
          </div>

          <Connector />

          <Reveal delay={0.1} amount={0.2}>
            <div className="mx-auto max-w-3xl rounded-3xl border border-line bg-white p-5 shadow-[0_30px_80px_-50px_rgba(10,10,11,.5)] sm:p-7">
              <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-[#0a0a0b]/[.04] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-2">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  Um clique
                </span>
                <span className="text-sm font-semibold text-fg sm:text-base">
                  O resultado de cada oferta e da empresa inteira
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                {RESULT.map((r, i) => (
                  <motion.div
                    key={r.label}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.12 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={clsx(
                      "rounded-2xl border px-3 py-4 text-center sm:px-4",
                      r.tone === "green"
                        ? "border-green/30 bg-green/[.08]"
                        : "border-line bg-[#0a0a0b]/[.03]",
                    )}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-3">{r.label}</div>
                    <div
                      className={clsx(
                        "tabular mt-1.5 whitespace-nowrap text-[13px] font-semibold sm:text-xl lg:text-2xl",
                        r.tone === "green" ? "text-green" : "text-fg",
                      )}
                    >
                      {r.value}
                    </div>
                  </motion.div>
                ))}
              </div>

              <p className="mt-5 text-center text-xs text-fg-2 sm:text-sm">
                Você não vê apenas qual anúncio gerou uma compra — vê quanto aquela oferta investiu, faturou e deixou de
                resultado.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Fecho */}
        <Reveal delay={0.05} amount={0.4}>
          <p className="display mx-auto mt-14 max-w-3xl text-balance text-center text-xl leading-tight sm:mt-16 sm:text-3xl lg:text-4xl">
            A Cashflow não é <span className="text-fg-3 line-through decoration-red/70">mais uma ferramenta</span>. É uma{" "}
            <span className="text-red">metodologia</span>.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

function PillarCard({ pillar, delay }: { pillar: Pillar; delay: number }) {
  const Icon = pillar.icon;
  return (
    <Reveal delay={delay} amount={0.25} className="h-full">
      <div className="group relative flex h-full flex-col rounded-3xl border border-line bg-white p-5 shadow-[0_24px_60px_-48px_rgba(10,10,11,.6)] transition-colors hover:border-line-2 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red/20 bg-red/[.07] text-red">
            <Icon className="h-5 w-5" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.18em] text-fg-3">{pillar.n}</span>
        </div>
        <h3 className="mt-4 text-base font-semibold leading-snug text-fg sm:text-lg">{pillar.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-2">{pillar.desc}</p>
      </div>
    </Reveal>
  );
}

/** Linhas que descem dos três pilares e se encontram no nó de resultado. */
function Connector() {
  const paths = [
    "M 200 0 L 200 34 Q 200 58 260 58 L 540 58 Q 600 58 600 82 L 600 110",
    "M 600 0 L 600 110",
    "M 1000 0 L 1000 34 Q 1000 58 940 58 L 660 58 Q 600 58 600 82 L 600 110",
  ];
  return (
    <div aria-hidden className="relative">
      {/* Mobile: uma linha simples entre a pilha de cards e o resultado */}
      <div className="flex h-10 items-center justify-center sm:hidden">
        <span className="h-full w-px bg-gradient-to-b from-transparent via-[#0a0a0b]/20 to-[#0a0a0b]/30" />
      </div>

      <div className="hidden h-[72px] w-full sm:block lg:h-[88px]">
        <svg viewBox="0 0 1200 110" preserveAspectRatio="none" className="h-full w-full">
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              className="text-[#0a0a0b]/25"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </svg>
      </div>

      {/* Ponto de encontro */}
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-red shadow-[0_0_0_6px_rgba(194,7,15,.12)]"
      />
    </div>
  );
}
