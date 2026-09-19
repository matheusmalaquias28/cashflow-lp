"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import clsx from "clsx";
import { Layers, Wallet, ArrowUpRight, TrendingUp, Activity, Radar, Megaphone } from "lucide-react";
import { Container, Section, SectionHeader } from "../ui/primitives";
import { BRL } from "../mock/atoms";
import { BentoCard, EASE, Rolling, useLiveBeat, useLiveInterval } from "../mock/bento";
import { Label, StatusPill } from "../mock/product";
import { SalesFeed } from "../mock/SalesFeed";
import { TrackingMeta } from "../mock/TrackingMeta";
import { TrafficOffer } from "../mock/TrafficOffer";
import { OFFER } from "@/lib/data";

export function Pillars() {
  return (
    <Section id="produto">
      <div className="pointer-events-none absolute inset-x-0 top-[30%] -z-10 h-[560px] bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(131,0,6,.26),transparent_72%)]" />
      <Container>
        <SectionHeader
          title="PREPARE-SE: /// O JOGO *MUDOU. /// Vai ficar para *trás?"
          lead="A Cashflow é a 1ª ferramenta para gestão de múltiplas ofertas Low Ticket com trackeamento avançado no Meta Ads."
        />

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          <BentoCard
            index={0}
            accent
            icon={Activity}
            title="Feed de Vendas Ao Vivo"
            text="Acompanhe cada nova venda entrando em tempo real e veja imediatamente qual oferta vendeu, o valor da venda e a plataforma de pagamento. Em vez de conferir diferentes checkouts e dashboards, você visualiza todas as vendas da sua operação em um único feed, organizadas por ordem de aprovação."
            className="md:col-span-2 lg:col-span-12"
            mediaClassName="min-h-[460px]"
          >
            <SalesFeed />
          </BentoCard>

          <BentoCard
            index={1}
            icon={Layers}
            title="Gestão de Múltiplas Ofertas"
            text="Todas as suas ofertas organizadas rapidamente em um só lugar. Pode ser 5, 10, 20 ou mais ofertas, não importa. Visualize cada oferta separadamente, sem misturar campanhas, vendas e resultados."
            className="md:col-span-1 lg:col-span-6"
            mediaClassName="min-h-[420px]"
          >
            <OffersMini />
          </BentoCard>

          <BentoCard
            index={2}
            icon={Megaphone}
            title="Gestão de Tráfego Organizado Por Oferta"
            text="Acompanhe separadamente as campanhas, conjuntos, anúncios e criativos de cada oferta. Veja quanto cada produto investiu, vendeu e faturou, além do CPA e do ROAS, sem misturar os resultados de toda a operação no mesmo painel."
            className="md:col-span-1 lg:col-span-6"
            mediaClassName="min-h-[420px]"
          >
            <TrafficOffer />
          </BentoCard>

          <BentoCard
            index={3}
            icon={Radar}
            title="Trackeamento Avançado no Meta Ads"
            text="Garanta o envio das suas vendas ao Meta através do sistema avançado de trackeamento — desde o clique à venda — reduzindo vendas sem atribuição e aumentando a confiança nos dados usados para otimizar suas campanhas. Mais lucro e estabilidade nas suas ofertas!"
            className="md:col-span-1 lg:col-span-6"
            mediaClassName="min-h-[420px]"
          >
            <TrackingMeta />
          </BentoCard>

          <BentoCard
            index={4}
            accent
            tone="green"
            icon={Wallet}
            title="Gestão Financeira Empresarial"
            text="Você pode estar vendendo todos os dias e, ainda assim, não saber quanto realmente está sobrando. A Cashflow reúne as informações necessárias para acompanhar o resultado financeiro da sua empresa."
            className="md:col-span-1 lg:col-span-6"
            mediaClassName="min-h-[420px]"
          >
            <FinanceMini />
          </BentoCard>

       </div>
      </Container>
    </Section>
  );
}

/* =====================================================================
   Ofertas — carteira positiva/negativa + ranking por lucro
   ===================================================================== */

const OFFERS = [
  { n: OFFER.desafio.name, lucro: 489.6, roas: 4.12, pixel: true },
  { n: OFFER.violao.name, lucro: 356.25, roas: 5.1, pixel: true, dupla: true },
  { n: OFFER.planner.name, lucro: 212.4, roas: 3.35, pixel: true },
  { n: "Receitas Fit 30 Dias", lucro: 143.8, roas: 2.68, pixel: true },
  { n: OFFER.rotina.name, lucro: 66.3, roas: null, pixel: false },
  { n: OFFER.churrasco.name, lucro: -18.4, roas: 0.82, pixel: true },
];

function OffersMini() {
  const { ref, tick } = useLiveBeat(3000);

  // Lucros oscilam e o ranking se reordena — a lista mantém o mesmo tamanho.
  const rows = OFFERS.map((o, i) => ({
    ...o,
    lucro: o.lucro + Math.sin((tick + i * 1.7) / 2) * 28,
  })).sort((a, b) => b.lucro - a.lucro);
  const pos = rows.filter((r) => r.lucro > 0).length;
  const lucroTotal = rows.reduce((a, r) => a + r.lucro, 0);
  const roasMedio =
    rows.filter((r) => r.roas !== null).reduce((a, r) => a + (r.roas ?? 0), 0) /
    rows.filter((r) => r.roas !== null).length;

  return (
    // Em largura total os contadores vão para a coluna da esquerda e o ranking ocupa o resto.
    <div ref={ref} className="grid h-full gap-3 lg:grid-cols-[minmax(240px,1fr)_2fr]">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:content-start">
        <div className="rounded-lg border border-green/25 bg-[#0f1a12]/60 p-3">
          <Label className="text-green">● Ofertas positivas</Label>
          <div className="mt-1 flex items-end justify-between">
            <span className="text-xl font-bold text-green">
              {pos} <span className="text-[10px] font-normal text-fg-2">de {rows.length}</span>
            </span>
            <span className="text-[11px] font-semibold text-green">{((pos / rows.length) * 100).toFixed(1)}%</span>
          </div>
          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div className="h-full bg-green" animate={{ width: `${(pos / rows.length) * 100}%` }} transition={{ duration: 0.8, ease: EASE }} />
          </div>
        </div>
        <div className="rounded-lg border border-red/25 bg-[#1a0f10]/60 p-3">
          <Label className="text-red">● Ofertas negativas</Label>
          <div className="mt-1 flex items-end justify-between">
            <span className="text-xl font-bold text-red">
              {rows.length - pos} <span className="text-[10px] font-normal text-fg-2">de {rows.length}</span>
            </span>
            <span className="text-[11px] font-semibold text-red">{(((rows.length - pos) / rows.length) * 100).toFixed(1)}%</span>
          </div>
          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div className="h-full bg-red/70" animate={{ width: `${((rows.length - pos) / rows.length) * 100}%` }} transition={{ duration: 0.8, ease: EASE }} />
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3">
          <Label>Lucro do dia</Label>
          <div className="mt-1 flex items-end justify-between">
            <span className="text-xl font-bold tabular text-green">
              <Rolling value={lucroTotal} prefix="R$ " digits={2} duration={1100} />
            </span>
            <span className="font-mono text-[9px] text-fg-3">{rows.length} ofertas</span>
          </div>
          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div className="h-full bg-green/70" animate={{ width: "72%" }} transition={{ duration: 0.8, ease: EASE }} />
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3">
          <Label>ROAS médio</Label>
          <div className="mt-1 flex items-end justify-between">
            <span className="text-xl font-bold tabular">{roasMedio.toFixed(2)}x</span>
            <span className="font-mono text-[9px] text-fg-3">meta 2,50x</span>
          </div>
          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div className="h-full bg-cyan" animate={{ width: `${Math.min(100, (roasMedio / 5) * 100)}%` }} transition={{ duration: 0.8, ease: EASE }} />
          </div>
        </div>
      </div>

      <Panel title="Ordenado por maior lucro" badge="Hoje" className="flex-1">
        <div className="mt-2 flex flex-col gap-1.5">
          {rows.map((o) => (
            <motion.div
              key={o.n}
              layout
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="flex h-[44px] items-center gap-2.5 rounded-lg border border-white/[0.06] bg-[#0f0f0f] px-2.5"
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-red" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11px] font-semibold">{o.n}</span>
                <span className="mt-0.5 flex gap-1">
                  <StatusPill tone="green">Ativa</StatusPill>
                  {o.dupla && <StatusPill tone="orange">Dupla</StatusPill>}
                  {!o.pixel && <StatusPill tone="red">Sem pixel</StatusPill>}
                </span>
              </span>
              <span className="text-right">
                <span className={clsx("block text-[12px] font-bold tabular", o.lucro < 0 ? "text-red" : "text-green")}>
                  <Rolling value={o.lucro} prefix="R$ " digits={2} duration={1100} />
                </span>
                <span className="block font-mono text-[8px] text-fg-3">ROAS {o.roas === null ? "—" : `${o.roas.toFixed(2)}x`}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* =====================================================================
   Financeiro — caixa real
   ===================================================================== */

const LEDGER = [
  { l: "Vendas (líquido gateway)", v: 21640, in: true },
  { l: "Meta Ads", v: -9120 },
  { l: "Impostos (Simples)", v: -1298 },
  { l: "Ferramentas", v: -487 },
  { l: "Pró-labore", v: -4000 },
  { l: "Taxas de gateway", v: -1042 },
  { l: "Reembolsos", v: -318 },
];

function FinanceMini() {
  const [inflow, setInflow] = useState(21640);
  const beat = useRef(0);
  const ref = useLiveInterval(2600, () => {
    beat.current += 1;
    setInflow((v) => v + Math.round(90 + Math.random() * 260));
  });

  const outflow = LEDGER.filter((r) => !r.in).reduce((a, r) => a + r.v, 0);
  const cash = inflow + outflow;
  const margin = (cash / inflow) * 100;

  return (
    <div ref={ref} className="grid h-full gap-3 sm:grid-cols-[1fr_1.25fr]">
      <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-green/30 bg-green/[0.07] p-4">
        <motion.div
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-green/40 blur-2xl"
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-fg-3">Caixa real · Agosto</span>
            <span className="flex items-center gap-0.5 font-mono text-[9px] text-green">
              <ArrowUpRight className="h-2.5 w-2.5" /> subindo
            </span>
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight text-green sm:text-3xl">
            <Rolling value={cash} prefix="R$ " />
          </div>
          <div className="mt-1 text-[10px] text-fg-3">Depois de tudo que saiu de verdade.</div>
        </div>

        {/* Últimos meses, para o número não ficar sozinho no card */}
        <div className="relative mt-4 flex flex-1 items-end gap-1.5">
          {[38, 44, 41, 52, 58, 55, 67].map((h, i, arr) => (
            <motion.span
              key={i}
              className={clsx("flex-1 rounded-sm", i === arr.length - 1 ? "bg-green" : "bg-green/25")}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: EASE }}
            />
          ))}
        </div>

        <div className="relative mt-4">
          <div className="mb-1.5 flex justify-between text-[10px] text-fg-3">
            <span>Margem real</span>
            <span className="font-mono tabular text-green">
              <Rolling value={margin} digits={1} suffix="%" />
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              className="h-full rounded-full bg-green"
              animate={{ width: `${Math.min(100, margin)}%` }}
              transition={{ duration: 1.1, ease: EASE }}
            />
          </div>
        </div>
      </div>

      <Panel title="Movimentação do mês">
        <div className="mt-2 flex flex-1 flex-col justify-between">
          {LEDGER.map((r) => (
            <div
              key={r.l}
              className="flex items-center justify-between border-b border-white/[0.06] py-2 text-[11px] last:border-0"
            >
              <span className="flex items-center gap-2 text-fg-2">
                <span className={clsx("h-1.5 w-1.5 rounded-full", r.in ? "bg-green" : "bg-red/70")} />
                {r.l}
              </span>
              <span className={clsx("font-mono tabular", r.in ? "text-green" : "text-fg")}>
                {r.in ? "+" : "−"}R$ {r.in ? <Rolling value={inflow} /> : BRL(Math.abs(r.v))}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* =====================================================================
   Peças compartilhadas dentro dos cards
   ===================================================================== */

function Panel({
  title,
  badge,
  live,
  children,
  className,
}: {
  title: React.ReactNode;
  badge?: React.ReactNode;
  live?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-card p-3",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-fg-2">{title}</span>
        {live && (
          <span className="flex items-center gap-1 font-mono text-[10px] text-green">
            <TrendingUp className="h-3 w-3" /> ao vivo
          </span>
        )}
        {badge && (typeof badge === "string" ? <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-fg-3">{badge}</span> : <span className="font-mono text-[9px]">{badge}</span>)}
      </div>
      {children}
    </div>
  );
}
