"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import clsx from "clsx";
import { ShoppingBag, Megaphone, Layers, Wallet, ArrowUpRight, TrendingUp, Radio, DollarSign, BarChart3 } from "lucide-react";
import { Container, Section, SectionHeader } from "../ui/primitives";
import { BRL } from "../mock/atoms";
import { BentoCard, EASE, Rolling, useLiveBeat, useLiveInterval } from "../mock/bento";
import { ChartLegend, EvolutionChart, Funnel, Label, MetricCell, MiniSaleRow, Money, StatusPill, type Sale } from "../mock/product";
import { OFFER } from "@/lib/data";

export function Pillars() {
  return (
    <Section id="produto">
      <div className="pointer-events-none absolute inset-x-0 top-[30%] -z-10 h-[560px] bg-[radial-gradient(ellipse_60%_55%_at_50%_50%,rgba(131,0,6,.26),transparent_72%)]" />
      <Container>
        <SectionHeader
          eyebrow="Do anúncio ao lucro"
          title="Do anúncio ao lucro. *Sem *planilha."
          lead="O Cashflow conecta seus dados de vendas, tráfego e financeiro para você acompanhar a operação em tempo real."
        />

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
          <BentoCard
            index={0}
            accent
            icon={ShoppingBag}
            title="Vendas"
            text="Acompanhe suas vendas e faturamento conforme acontecem."
            className="md:col-span-2 lg:col-span-7"
            mediaClassName="min-h-[240px]"
          >
            <SalesMini />
          </BentoCard>

          <BentoCard
            index={1}
            icon={Megaphone}
            title="Tráfego"
            text="Veja investimento, campanhas e métricas do Meta Ads em um só lugar."
            className="lg:col-span-5"
            mediaClassName="min-h-[240px]"
          >
            <TrafficMini />
          </BentoCard>

          <BentoCard
            index={2}
            icon={Layers}
            title="Ofertas"
            text="Compare suas ofertas e descubra quais estão gerando resultado."
            className="lg:col-span-5"
            mediaClassName="min-h-[220px]"
          >
            <OffersMini />
          </BentoCard>

          <BentoCard
            index={3}
            accent
            tone="green"
            icon={Wallet}
            title="Financeiro"
            text="Saiba o que entrou, o que saiu e quanto realmente ficou no caixa."
            className="md:col-span-2 lg:col-span-7"
            mediaClassName="min-h-[220px]"
          >
            <FinanceMini />
          </BentoCard>
        </div>
      </Container>
    </Section>
  );
}

/* =====================================================================
   Vendas — evolução da operação por hora + últimas vendas (Dashboard Geral)
   ===================================================================== */

const SALE_POOL: Sale[] = [
  { platform: "Kiwify", offer: OFFER.desafio.name, value: 44.65, time: "18:41", status: "aprovada" },
  { platform: "Hotmart", offer: OFFER.violao.name, product: `${OFFER.violao.name} · Completo`, value: 92.15, time: "18:31", status: "aprovada" },
  { platform: "Cakto", offer: OFFER.rotina.name, product: "Order · Planner de Hábitos", value: 9.9, time: "18:16", status: "pendente" },
  { platform: "Ticto", offer: OFFER.planner.name, value: 63.65, time: "18:09", status: "aprovada" },
  { platform: "Hubla", offer: OFFER.churrasco.name, value: 25.65, time: "17:58", status: "aprovada" },
];

const REV = [0, 0, 0, 0, 0, 12, 48, 96, 150, 228, 310, 372, 448, 560, 690, 760, 838, 902, 990, 1042, 1042, 1042, 1042, 1042];
const PROFIT = REV.map((v) => Math.round(v * 0.71));
const SPEND = REV.map((_, i) => (i > 5 ? Math.min(318, 22 * (i - 5)) : 0));

const ROW = 52;
const SLOTS = 4;

function SalesMini() {
  const [revenue, setRevenue] = useState(1284.9);
  const [count, setCount] = useState(61);
  const [feed, setFeed] = useState(() => SALE_POOL.slice(0, SLOTS).map((s, i) => ({ id: -i, s })));
  const beat = useRef(0);

  const ref = useLiveInterval(2800, () => {
    beat.current += 1;
    const id = beat.current;
    const sale = SALE_POOL[id % SALE_POOL.length];
    setFeed((f) => [{ id, s: sale }, ...f].slice(0, SLOTS));
    if (sale.status === "aprovada") {
      setRevenue((r) => r + sale.value);
      setCount((c) => c + 1);
    }
  });

  return (
    <div ref={ref} className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="Faturamento líquido" value={revenue} prefix="R$ " digits={2} tone="text-cyan" icon={DollarSign} />
        <Stat label="Lucro operacional" value={revenue - 318.4 - 54.35} prefix="R$ " digits={2} tone="text-green" icon={TrendingUp} highlight />
        <Stat label="Nº de vendas" value={count} tone="text-fg" icon={BarChart3} />
      </div>

      <div className="grid flex-1 gap-3 lg:grid-cols-[1.45fr_1fr]">
        <Panel
          title="Evolução da operação"
          badge={
            <span className="flex items-center gap-1 text-green">
              <span className="h-1.5 w-1.5 rounded-full bg-green" /> Ao Vivo
            </span>
          }
        >
          <EvolutionChart revenue={REV} profit={PROFIT} spend={SPEND} now={19} width={440} height={230} className="mt-1 flex-1" />
          <ChartLegend
            className="mt-1 justify-center"
            items={[
              { c: "#22d3ee", l: "Faturamento" },
              { c: "#22c55e", l: "Lucro" },
              { c: "#ffa726", l: "Investimento" },
            ]}
          />
        </Panel>

        <Panel
          title={
            <span className="flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-green" /> Últimas vendas
            </span>
          }
        >
          <div className="relative mt-2 overflow-hidden" style={{ height: ROW * SLOTS }}>
            <AnimatePresence initial={false}>
              {feed.map(({ id, s: sale }, i) => (
                <motion.div
                  key={id}
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 0, y: -ROW, scale: 0.96 }}
                  animate={{ opacity: 1, y: i * ROW, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <MiniSaleRow sale={sale} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* =====================================================================
   Tráfego — funil de conversão do Meta Ads + resultado
   ===================================================================== */

const FUNNEL_BASE = [
  { label: "Cliques", value: 112 },
  { label: "Vis. Página", value: 109 },
  { label: "ICs", value: 14 },
  { label: "Vendas Inic.", value: 31 },
  { label: "Vendas Apr.", value: 26 },
];

function TrafficMini() {
  const { ref, tick } = useLiveBeat(3000);
  // Cliques e vendas entram ao vivo; o funil se refaz suavemente.
  const stages = FUNNEL_BASE.map((s, i) => ({
    ...s,
    value: s.value + (i === 0 ? tick * 3 : i === 1 ? tick * 3 : i >= 3 ? Math.floor(tick / 2) : Math.floor(tick / 3)),
  }));
  const spend = 318.4 + tick * 2.7;
  const net = 1284.9 + Math.floor(tick / 2) * 44.65;

  return (
    <div ref={ref} className="flex h-full flex-col gap-3">
      <Panel
        title={
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#0866FF]" /> Funil de conversão (Meta Ads)
          </span>
        }
        badge="Hoje"
      >
        <Funnel stages={stages} height={120} className="mt-3" />
      </Panel>

      <div className="grid grid-cols-2 gap-2">
        <MetricCell label="Gastos com anúncios" value={<Rolling value={spend} prefix="R$ " digits={2} />} tone="white" />
        <MetricCell label="ARPU" value={<Money v={net / 33} />} tone="white" />
        <MetricCell label="Lucro" value={<Rolling value={net - spend - 54.35} prefix="R$ " digits={2} />} tone="green" />
        <MetricCell label="ROAS" value={<span className="tabular">{(net / spend).toFixed(2)}</span>} tone="green" />
      </div>
    </div>
  );
}

/* =====================================================================
   Ofertas — carteira positiva/negativa + ranking por lucro
   ===================================================================== */

const OFFERS = [
  { n: OFFER.desafio.name, lucro: 489.6, roas: 4.12, pixel: true },
  { n: OFFER.violao.name, lucro: 356.25, roas: 5.1, pixel: true, dupla: true },
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

  return (
    <div ref={ref} className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
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
        <div className="mt-2">
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

function Stat({
  label,
  value,
  prefix = "",
  digits = 0,
  tone = "text-fg",
  icon: Icon,
  highlight,
}: {
  label: string;
  value: number;
  prefix?: string;
  digits?: number;
  tone?: string;
  icon?: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-xl border p-3",
        highlight ? "border-t-2 border-green/30 border-t-green bg-[#0f1a12]" : "border-white/[0.06] bg-card",
      )}
    >
      {highlight && <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-green/30 blur-2xl" />}
      <div className="flex items-center gap-1.5">
        {Icon && (
          <span className={clsx("flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.05]", tone)}>
            <Icon className="h-2.5 w-2.5" />
          </span>
        )}
        <Label>{label}</Label>
      </div>
      <div className={clsx("mt-1 whitespace-nowrap text-[13px] font-bold tracking-tight sm:text-base lg:text-lg", tone)}>
        <Rolling value={value} prefix={prefix} digits={digits} />
      </div>
    </div>
  );
}
