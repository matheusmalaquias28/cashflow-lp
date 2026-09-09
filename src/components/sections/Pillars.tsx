"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import clsx from "clsx";
import { ShoppingBag, Megaphone, Layers, Wallet, ArrowUpRight, TrendingUp } from "lucide-react";
import { Container, Section, SectionHeader } from "../ui/primitives";
import { BRL, PlatformDot, Sparkline } from "../mock/atoms";
import {
  BentoCard,
  EASE,
  Rolling,
  ScrollingAreaChart,
  advanceSeries,
  makeSeed,
  useLiveBeat,
  useLiveInterval,
} from "../mock/bento";
import { OFFER } from "@/lib/data";

const CHART_MS = 1400;

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
   Vendas — faturamento subindo + curva ao vivo + últimas vendas
   ===================================================================== */

const SALE_POOL = [
  { platform: "Kiwify", offer: OFFER.desafio.name, value: 47 },
  { platform: "Hotmart", offer: OFFER.violao.name, value: 97 },
  { platform: "Cakto", offer: OFFER.rotina.name, value: 37 },
  { platform: "Ticto", offer: OFFER.planner.name, value: 67 },
  { platform: "Kirvano", offer: OFFER.churrasco.name, value: 27 },
];

const ROW = 46;
const SLOTS = 3;

function SalesMini() {
  const [series, setSeries] = useState<number[]>(() => makeSeed(6));
  const [version, setVersion] = useState(0);
  const [revenue, setRevenue] = useState(4820);
  const [count, setCount] = useState(112);
  const [feed, setFeed] = useState(() => SALE_POOL.slice(0, SLOTS).map((s, i) => ({ id: -i, s })));
  const beat = useRef(0);

  const ref = useLiveInterval(CHART_MS, () => {
    beat.current += 1;
    const id = beat.current;
    setVersion(id);
    setSeries((prev) => advanceSeries(prev, id));

    if (id % 2 === 0) {
      const sale = SALE_POOL[(id / 2) % SALE_POOL.length];
      setFeed((f) => [{ id, s: sale }, ...f].slice(0, SLOTS));
      setRevenue((r) => r + sale.value);
      setCount((c) => c + 1);
    }
  });

  return (
    <div ref={ref} className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="Faturamento hoje" value={revenue} prefix="R$ " trend="+12,4%" />
        <Stat label="Vendas hoje" value={count} trend="+9,7%" />
        <Stat label="Ticket médio" value={43} prefix="R$ " trend="+2,1%" />
      </div>

      <div className="grid flex-1 gap-3 lg:grid-cols-[1.35fr_1fr]">
        <Panel title="Faturamento · hoje" live>
          <ScrollingAreaChart
            series={series}
            version={version}
            ms={CHART_MS}
            id="pillar-sales"
            className="mt-2 flex-1"
            minHeight={96}
          />
        </Panel>

        <Panel title="Últimas vendas">
          <div className="relative mt-2 overflow-hidden" style={{ height: ROW * SLOTS }}>
            <AnimatePresence initial={false}>
              {feed.map(({ id, s: sale }, i) => (
                <motion.div
                  key={id}
                  className="absolute inset-x-0 top-0 flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.04] px-2.5"
                  style={{ height: ROW - 6 }}
                  initial={{ opacity: 0, y: -ROW, scale: 0.96 }}
                  animate={{ opacity: 1, y: i * ROW, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  <PlatformDot name={sale.platform} />
                  <span className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-[11px] font-medium">{sale.offer}</span>
                    <span className="text-[9px] text-fg-3">{sale.platform}</span>
                  </span>
                  <span className="font-mono text-[11px] tabular text-green">+{BRL(sale.value)}</span>
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
   Tráfego — investimento e campanhas do Meta Ads
   ===================================================================== */

const CAMPAIGNS = [
  { n: `CBO · ${OFFER.desafio.short} · Interesses`, roas: 3.4, w: 92 },
  { n: `ABO · ${OFFER.violao.short} · LAL 1%`, roas: 2.1, w: 64 },
  { n: `CBO · ${OFFER.rotina.short} · Aberto`, roas: 2.9, w: 47 },
];

const SPEND_BARS = [3, 5, 4, 7, 6, 8, 9, 7, 10, 12, 9, 11];

function TrafficMini() {
  const [tick, setTick] = useState(0);
  const [spend, setSpend] = useState(2740);

  const ref = useLiveInterval(2200, () => {
    setTick((t) => t + 1);
    setSpend((v) => v + Math.round(18 + Math.random() * 90));
  });

  // Barras deslizam para a esquerda a cada batida, dando ritmo ao gasto por hora.
  const bars = SPEND_BARS.map((_, i) => SPEND_BARS[(i + tick) % SPEND_BARS.length]);

  return (
    <div ref={ref} className="flex h-full flex-col gap-3">
      <Panel
        title={
          <span className="flex items-center gap-2">
            <PlatformDot name="Meta Ads" /> Meta Ads
          </span>
        }
        badge="Hoje"
      >
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <div className="text-[10px] text-fg-3">Investido</div>
            <div className="text-xl font-bold tracking-tight">
              <Rolling value={spend} prefix="R$ " />
            </div>
          </div>
          <div className="flex h-11 flex-1 items-end justify-end gap-1">
            {bars.map((h, i) => (
              <motion.span
                key={i}
                className="w-1.5 rounded-sm bg-[#0866FF]"
                animate={{ height: `${(h / 12) * 100}%`, opacity: 0.45 + (i / bars.length) * 0.55 }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="Campanhas ativas" className="flex-1">
        <div className="mt-2 space-y-2.5">
          {CAMPAIGNS.map((c, i) => (
            <div key={c.n} className="space-y-1">
              <div className="flex items-baseline justify-between gap-2 text-[11px]">
                <span className="truncate text-fg-2">{c.n}</span>
                <span className="shrink-0 font-mono tabular text-fg-3">ROAS {c.roas.toFixed(1).replace(".", ",")}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-[#0866FF]"
                  animate={{ width: `${c.w + Math.sin((tick + i) / 2) * 4}%` }}
                  transition={{ duration: 1.2, ease: EASE }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* =====================================================================
   Ofertas — ranking que se reordena sozinho
   ===================================================================== */

const OFFERS = [
  { n: OFFER.desafio.name, m: 31.6, s: [3, 5, 4, 7, 8, 9, 12] },
  { n: OFFER.rotina.name, m: 24.2, s: [2, 4, 3, 5, 6, 8, 8] },
  { n: OFFER.violao.name, m: 17.8, s: [6, 5, 7, 6, 8, 7, 9] },
  { n: OFFER.churrasco.name, m: 4.1, s: [5, 4, 4, 3, 3, 2, 2] },
];

function OffersMini() {
  const { ref, tick } = useLiveBeat(3000);

  // Margens oscilam e o ranking se reordena — a lista mantém o mesmo tamanho.
  const rows = OFFERS.map((o, i) => ({
    ...o,
    m: Math.max(0.5, o.m + Math.sin((tick + i * 1.7) / 2) * 3.4),
  })).sort((a, b) => b.m - a.m);

  return (
    <div ref={ref} className="flex h-full flex-col">
      <Panel title="Margem por oferta" badge="30 dias" className="flex-1">
        <div className="mt-2 flex flex-col gap-1.5">
          {rows.map((o, i) => (
            <motion.div
              key={o.n}
              layout
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className={clsx(
                "flex h-[42px] items-center gap-2.5 rounded-lg border px-2.5",
                i === 0 ? "border-green/30 bg-green/[0.08]" : "border-white/[0.07] bg-white/[0.03]",
              )}
            >
              <span className="w-4 shrink-0 font-mono text-[10px] text-fg-3">0{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-[11px] font-medium">{o.n}</span>
              <Sparkline data={o.s} width={48} height={16} color={o.m < 10 ? "#FA0A15" : "#22c55e"} />
              <span
                className={clsx(
                  "w-12 shrink-0 text-right font-mono text-[11px] tabular",
                  o.m < 10 ? "text-red" : "text-green",
                )}
              >
                <Rolling value={o.m} digits={1} suffix="%" duration={1100} />
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
  badge?: string;
  live?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-black/30 p-3",
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
        {badge && <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-fg-3">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  prefix = "",
  trend,
}: {
  label: string;
  value: number;
  prefix?: string;
  trend: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
      <div className="text-[10px] text-fg-3">{label}</div>
      <div className="mt-0.5 whitespace-nowrap text-[13px] font-bold tracking-tight sm:text-base lg:text-lg">
        <Rolling value={value} prefix={prefix} />
      </div>
      <div className="mt-0.5 flex items-center gap-0.5 font-mono text-[9px] tabular text-green">
        <ArrowUpRight className="h-2.5 w-2.5" />
        {trend}
      </div>
    </div>
  );
}
