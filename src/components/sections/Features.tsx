"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import clsx from "clsx";
import { Activity, SlidersHorizontal, GitCompare, Wallet, Bell, SunMoon, Check, Plus, Sun, Moon, ArrowUpRight, TrendingUp } from "lucide-react";
import { Container, Section, SectionHeader } from "../ui/primitives";
import { BRL, PlatformDot } from "../mock/atoms";
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

/* =====================================================================
   Section
   ===================================================================== */

export function Features() {
  return (
    <Section className="!pt-0">
      <div className="pointer-events-none absolute inset-x-0 top-[18%] -z-10 h-[640px] bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(131,0,6,.34),transparent_72%)]" />
      <Container>
        <SectionHeader
          eyebrow="Visão completa"
          title="Uma visão completa da sua *operação."
          lead="Vendas, ofertas, tráfego e financeiro trabalhando juntos para você entender o que está acontecendo e decidir o que fazer em seguida."
        />

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <BentoCard
            index={0}
            accent
            icon={Activity}
            title="Dashboard em tempo real"
            text="Acompanhe os principais indicadores da operação enquanto as vendas acontecem."
            className="sm:col-span-2 lg:col-span-8 lg:row-span-2"
            mediaClassName="min-h-[280px]"
          >
            <LiveDashboard />
          </BentoCard>

          <BentoCard
            index={1}
            icon={Bell}
            title="Notificações"
            text="Tenha seus principais alertas organizados."
            className="lg:col-span-4"
            mediaClassName="min-h-[168px]"
          >
            <LiveNotifications />
          </BentoCard>

          <BentoCard
            index={2}
            icon={Wallet}
            title="Gestão financeira"
            text="Controle entradas, saídas e resultado mensal."
            className="lg:col-span-4"
            mediaClassName="min-h-[168px]"
          >
            <LiveFinance />
          </BentoCard>

          <BentoCard
            index={3}
            icon={GitCompare}
            title="Comparação de ofertas"
            text="Compare períodos e ofertas lado a lado."
            className="lg:col-span-5"
            mediaClassName="min-h-[168px]"
          >
            <LiveCompare />
          </BentoCard>

          <BentoCard
            index={4}
            icon={SlidersHorizontal}
            title="Filtros avançados"
            text="Encontre rapidamente os dados que precisa."
            className="lg:col-span-4"
            mediaClassName="min-h-[168px]"
          >
            <LiveFilters />
          </BentoCard>

          <BentoCard
            index={5}
            icon={SunMoon}
            title="Modo claro e escuro"
            text="Use o Cashflow do jeito que preferir."
            className="sm:col-span-2 lg:col-span-3"
            mediaClassName="min-h-[168px]"
          >
            <LiveTheme />
          </BentoCard>
        </div>
      </Container>
    </Section>
  );
}

/* =====================================================================
   Card 1 — live dashboard: revenue climbing, chart advancing, sales landing
   ===================================================================== */

const SALE_POOL = [
  { platform: "Kiwify", offer: OFFER.desafio.name, value: 47 },
  { platform: "Hotmart", offer: OFFER.violao.name, value: 97 },
  { platform: "Cakto", offer: OFFER.rotina.name, value: 37 },
  { platform: "Ticto", offer: OFFER.desafio.name, value: 47 },
  { platform: "Kirvano", offer: OFFER.churrasco.name, value: 27 },
  { platform: "Hubla", offer: OFFER.planner.name, value: 67 },
];

const CHART_MS = 1200;
const ROW = 52;
const FEED_SLOTS = 4;

function LiveDashboard() {
  const [series, setSeries] = useState<number[]>(() => makeSeed());
  const [revenue, setRevenue] = useState(98762);
  const [profit, setProfit] = useState(33239);
  const [sales, setSales] = useState(2104);
  const [version, setVersion] = useState(0);
  const [feed, setFeed] = useState<{ id: number; s: (typeof SALE_POOL)[number] }[]>(() =>
    SALE_POOL.slice(0, FEED_SLOTS).map((s, i) => ({ id: -i, s })),
  );
  const beat = useRef(0);

  const ref = useLiveInterval(CHART_MS, () => {
    beat.current += 1;
    const id = beat.current;
    setVersion(id);

    // Curva avança um passo a cada batida — random walk suave e limitado.
    setSeries((prev) => advanceSeries(prev, id));

    // Vendas entram a cada duas batidas.
    if (id % 2 === 0) {
      const sale = SALE_POOL[(id / 2) % SALE_POOL.length];
      setFeed((f) => [{ id, s: sale }, ...f].slice(0, FEED_SLOTS));
      setRevenue((r) => r + sale.value);
      setProfit((pr) => pr + Math.round(sale.value * 0.42));
      setSales((c) => c + 1);
    }
  });

  return (
    <div ref={ref} className="flex h-full flex-col gap-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Kpi label="Faturamento" value={revenue} prefix="R$ " trend="+18,4%" />
        <Kpi label="Lucro líquido" value={profit} prefix="R$ " trend="+24,9%" accent />
        <Kpi label="Vendas" value={sales} trend="+12,1%" />
      </div>

      <div className="grid flex-1 gap-3 lg:grid-cols-[1.5fr_1fr]">
        {/* Chart */}
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-black/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-fg-2">Faturamento · hoje</span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-green">
              <TrendingUp className="h-3 w-3" /> ao vivo
            </span>
          </div>

          <ScrollingAreaChart
            series={series}
            version={version}
            ms={CHART_MS}
            id="feat"
            className="mt-2 flex-1"
          />
        </div>

        {/* Feed — fixed slots, so new sales never resize the card */}
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-black/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-fg-2">Vendas entrando</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-red animate-pulse-dot" />
              <span className="h-1.5 w-1.5 rounded-full bg-red" />
            </span>
          </div>
          <div className="relative mt-2 overflow-hidden" style={{ height: ROW * FEED_SLOTS }}>
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
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] font-medium leading-tight">{sale.offer}</span>
                    <span className="block truncate text-[9px] leading-tight text-fg-3">{sale.platform}</span>
                  </span>
                  <span className="font-mono text-[11px] tabular text-green">+R$ {BRL(sale.value)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  prefix = "",
  trend,
  accent,
}: {
  label: string;
  value: number;
  prefix?: string;
  trend: string;
  accent?: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-xl border p-3",
        accent ? "border-green/30 bg-green/[0.07]" : "border-white/[0.07] bg-white/[0.03]",
      )}
    >
      {accent && <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-green/30 blur-2xl" />}
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

/* =====================================================================
   Card 2 — notifications arriving on a loop
   ===================================================================== */

const NOTIF_ROW = 56;

const NOTIFS = [
  { t: `${OFFER.desafio.name} passou de 400 vendas`, tone: "green" },
  { t: `ROAS do ${OFFER.churrasco.short} caiu para 1,42`, tone: "red" },
  { t: "Fatura do Meta Ads vence hoje", tone: "white" },
  { t: `${OFFER.rotina.name} bateu recorde de lucro`, tone: "green" },
  { t: `Reembolso registrado em ${OFFER.violao.name}`, tone: "red" },
  { t: "Novo repasse da Kiwify caiu no caixa", tone: "green" },
];

function LiveNotifications() {
  const [items, setItems] = useState<{ id: number; n: (typeof NOTIFS)[number] }[]>([
    { id: 0, n: NOTIFS[0] },
    { id: -1, n: NOTIFS[1] },
    { id: -2, n: NOTIFS[2] },
  ]);
  const beat = useRef(0);

  const ref = useLiveInterval(2800, () => {
    beat.current += 1;
    const id = beat.current;
    setItems((prev) => [{ id, n: NOTIFS[id % NOTIFS.length] }, ...prev].slice(0, 3));
  });

  const AGE = ["agora", "há 2 min", "há 5 min"];

  return (
    // Fixed height with absolutely placed rows: arrivals never resize the card.
    <div ref={ref} className="relative overflow-hidden" style={{ height: 3 * NOTIF_ROW }}>
      <AnimatePresence initial={false}>
        {items.map(({ id, n }, i) => (
          <motion.div
            key={id}
            className="absolute inset-x-0 top-0 flex items-start gap-2.5 overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 backdrop-blur"
            style={{ height: NOTIF_ROW - 8 }}
            initial={{ opacity: 0, x: 36, filter: "blur(4px)" }}
            animate={{ opacity: 1 - i * 0.26, x: 0, y: i * NOTIF_ROW, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {i === 0 && (
              <motion.span
                className="absolute inset-0 bg-red/15"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            )}
            <span
              className={clsx(
                "relative mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full",
                n.tone === "green" && "bg-green",
                n.tone === "red" && "bg-red",
                n.tone === "white" && "bg-white/50",
              )}
            />
            <span className="relative flex min-w-0 flex-1 flex-col justify-center self-stretch">
              <span className="line-clamp-2 text-[11px] font-medium leading-snug">{n.t}</span>
              <span className="mt-0.5 text-[9px] text-fg-3">{AGE[i]}</span>
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* =====================================================================
   Card 3 — profit climbing
   ===================================================================== */

function LiveFinance() {
  const [inflow, setInflow] = useState(16760);
  const [outflow, setOutflow] = useState(12112);
  const beat = useRef(0);

  const ref = useLiveInterval(2600, () => {
    beat.current += 1;
    setInflow((v) => v + Math.round(120 + Math.random() * 380));
    if (beat.current % 3 === 0) setOutflow((v) => v + Math.round(40 + Math.random() * 120));
  });

  const result = inflow - outflow;
  const margin = Math.min(60, (result / inflow) * 100);

  return (
    <div ref={ref} className="flex h-full flex-col justify-between gap-3">
      <div className="relative overflow-hidden rounded-xl border border-green/30 bg-green/[0.07] p-3">
        <motion.div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green/40 blur-2xl"
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex items-baseline justify-between">
          <span className="text-[10px] text-fg-3">Resultado do mês</span>
          <span className="flex items-center gap-0.5 font-mono text-[9px] text-green">
            <ArrowUpRight className="h-2.5 w-2.5" />
            subindo
          </span>
        </div>
        <div className="relative mt-1 text-2xl font-bold tracking-tight text-green">
          <Rolling value={result} prefix="R$ " />
        </div>
        <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div className="h-full rounded-full bg-green" animate={{ width: `${margin}%` }} transition={{ duration: 1.1, ease: EASE }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2">
          <div className="text-[10px] text-fg-3">Entradas</div>
          <div className="font-mono text-xs text-green">
            <Rolling value={inflow} prefix="+R$ " />
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2">
          <div className="text-[10px] text-fg-3">Saídas</div>
          <div className="font-mono text-xs text-fg">
            <Rolling value={outflow} prefix="−R$ " />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   Card 4 — offers comparison cycling between periods
   ===================================================================== */

const PERIODS = [
  { label: "Julho", a: 68, b: 52, av: "R$ 28.4k", bv: "R$ 21.7k" },
  { label: "Agosto", a: 84, b: 61, av: "R$ 35.1k", bv: "R$ 25.4k" },
  { label: "Setembro", a: 92, b: 77, av: "R$ 38.5k", bv: "R$ 32.2k" },
];

function LiveCompare() {
  const { ref, tick } = useLiveBeat(2600);
  const p = PERIODS[tick % PERIODS.length];

  return (
    <div ref={ref} className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-fg-2">Faturamento por oferta</span>
        <div className="flex gap-1">
          {PERIODS.map((x, i) => (
            <span
              key={x.label}
              className={clsx(
                "h-1 w-5 rounded-full transition-colors duration-500",
                i === tick % PERIODS.length ? "bg-red" : "bg-white/15",
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={p.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[10px] uppercase tracking-wider text-fg-3"
        >
          {p.label}
        </motion.div>
      </AnimatePresence>

      <div className="mt-auto space-y-3">
        {[
          { n: OFFER.desafio.name, w: p.a, v: p.av, red: true },
          { n: OFFER.violao.name, w: p.b, v: p.bv, red: false },
        ].map((row) => (
          <div key={row.n}>
            <div className="mb-1 flex justify-between text-[10px]">
              <span className="text-fg-2">{row.n}</span>
              <span className="font-mono tabular text-fg-3">{row.v}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className={clsx("h-full rounded-full", row.red ? "bg-red shadow-[0_0_16px_rgba(250,10,21,.6)]" : "bg-white/30")}
                animate={{ width: `${row.w}%` }}
                transition={{ duration: 1.1, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =====================================================================
   Card 5 — filters toggling themselves
   ===================================================================== */

const CHIPS = ["Kiwify", "Hotmart", "30 dias", OFFER.desafio.short, "Pix", "Order bump", "ROAS > 2"];
const FILTER_STEPS = [
  ["Kiwify", "30 dias"],
  ["Kiwify", "30 dias", OFFER.desafio.short],
  ["Hotmart", "Pix"],
  ["30 dias", "ROAS > 2", "Order bump"],
];

function LiveFilters() {
  const { ref, tick } = useLiveBeat(2500);
  const active = FILTER_STEPS[tick % FILTER_STEPS.length];
  const results = 12 + active.length * 7;

  return (
    <div ref={ref} className="flex h-full flex-col justify-between">
      <div className="flex flex-wrap content-start gap-1.5">
        {CHIPS.map((c) => {
          const on = active.includes(c);
          return (
            <motion.span
              key={c}
              animate={{
                backgroundColor: on ? "rgba(250,10,21,0.16)" : "rgba(255,255,255,0.03)",
                borderColor: on ? "rgba(250,10,21,0.5)" : "rgba(255,255,255,0.09)",
                color: on ? "#ffffff" : "rgba(255,255,255,0.4)",
              }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]"
            >
              {on ? <Check className="h-3 w-3 text-red" /> : <Plus className="h-3 w-3" />}
              {c}
            </motion.span>
          );
        })}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5 border-t border-white/[0.07] pt-3 text-[11px] text-fg-3">
        <Rolling value={results} className="font-mono text-base font-semibold text-fg" duration={500} />
        ofertas encontradas
      </div>
    </div>
  );
}

/* =====================================================================
   Card 6 — theme switching on a loop (still clickable)
   ===================================================================== */

function LiveTheme() {
  const { ref, tick } = useLiveBeat(3200);
  const [manual, setManual] = useState<boolean | null>(null);
  const dark = manual ?? tick % 2 === 0;

  return (
    <div ref={ref} className="h-full">
      <motion.button
        onClick={() => setManual(!dark)}
        aria-label="Alternar tema"
        animate={{
          backgroundColor: dark ? "rgba(0,0,0,0.45)" : "rgba(244,244,245,0.95)",
          color: dark ? "#ffffff" : "#0a0a0b",
          borderColor: dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.1)",
        }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex h-full w-full flex-col rounded-xl border p-3 text-left"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold">Dashboard</span>
          <motion.span
            animate={{ backgroundColor: dark ? "rgba(255,255,255,0.14)" : "#FA0A15" }}
            transition={{ duration: 0.6 }}
            className="relative flex h-5 w-9 items-center rounded-full p-0.5"
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className={clsx("flex h-4 w-4 items-center justify-center rounded-full bg-white text-black", dark ? "ml-0" : "ml-auto")}
            >
              {dark ? <Moon className="h-2.5 w-2.5" /> : <Sun className="h-2.5 w-2.5" />}
            </motion.span>
          </motion.span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {["R$ 5.9k", "127"].map((v) => (
            <motion.div
              key={v}
              animate={{ backgroundColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}
              transition={{ duration: 0.6 }}
              className="rounded-md p-2 font-mono text-[10px] tabular"
            >
              {v}
            </motion.div>
          ))}
        </div>
        <motion.div
          animate={{ backgroundColor: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
          transition={{ duration: 0.6 }}
          className="mt-1.5 flex flex-1 items-end overflow-hidden rounded-md p-1.5"
        >
          <div className="flex h-full w-full items-end gap-1">
            {[3, 5, 4, 7, 6, 9, 11].map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-sm bg-red"
                animate={{ height: `${(h / 11) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.04, ease: EASE }}
              />
            ))}
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
}
