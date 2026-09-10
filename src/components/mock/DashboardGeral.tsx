"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Download, LayoutGrid, RefreshCw, HelpCircle, Filter, TrendingUp, TrendingDown, BarChart3, Target, DollarSign, Radio, ArrowUpRight, Menu, Search, Bell, Clock, Eye, Type, Landmark, Package, MoreHorizontal, Trophy } from "lucide-react";
import clsx from "clsx";
import { Card, ChartLegend, EvolutionChart, KpiCard, Label, MiniSaleRow, Money, PBtn, SelectBox, Sidebar, StatusPill, TopBar, type Sale } from "./product";
import { Rolling } from "./bento";
import { OFFER } from "@/lib/data";

/* Dados fictícios — uma operação de demonstração. */

const SALES: Sale[] = [
  { platform: "Kiwify", offer: OFFER.desafio.name, product: OFFER.desafio.name, value: 44.65, time: "18:41", status: "aprovada" },
  { platform: "Hotmart", offer: OFFER.violao.name, product: `${OFFER.violao.name} · Completo`, value: 92.15, time: "18:31", status: "aprovada" },
  { platform: "Cakto", offer: OFFER.rotina.name, product: "Order · Planner de Hábitos", value: 9.9, time: "18:16", status: "pendente" },
  { platform: "Kiwify", offer: OFFER.desafio.name, product: "Order · Cardápio 21 Dias", value: 12.9, time: "18:16", status: "pendente" },
  { platform: "Ticto", offer: OFFER.planner.name, product: OFFER.planner.name, value: 63.65, time: "18:09", status: "aprovada" },
  { platform: "Hubla", offer: OFFER.churrasco.name, product: OFFER.churrasco.name, value: 25.65, time: "17:58", status: "aprovada" },
];

// Acumulado por hora (00h–23h); a partir das 19h vira projeção no gráfico.
const REV = [0, 0, 0, 0, 0, 12, 48, 96, 150, 228, 310, 372, 448, 560, 690, 760, 838, 902, 990, 1042, 1042, 1042, 1042, 1042];
const PROFIT = REV.map((v) => Math.round(v * 0.71));
const SPEND = REV.map((v, i) => Math.round(Math.min(318, 14 * i * (i > 5 ? 1 : 0)) * 0.9 + (v > 0 ? 8 : 0)));

const POSITIVE = [
  { n: OFFER.desafio.name, v: 489.6, imp: 0 },
  { n: OFFER.violao.name, v: 356.25, imp: 17.2 },
  { n: OFFER.rotina.name, v: 66.3, imp: 0 },
];

/**
 * Réplica do "Dashboard Geral" do produto. `full` renderiza como página inteira
 * (sem moldura arredondada), usado em /dashboard.
 */
export function DashboardGeral({ className, live = true, full = false }: { className?: string; live?: boolean; full?: boolean }) {
  const [feed, setFeed] = useState<{ id: number; s: Sale }[]>(() => SALES.slice(0, 4).map((s, i) => ({ id: -i, s })));
  const [extra, setExtra] = useState(0);
  const [count, setCount] = useState(61);

  useEffect(() => {
    if (!live) return;
    let i = 4;
    let id = 0;
    const tick = () => {
      const s = SALES[i % SALES.length];
      i++;
      id++;
      setFeed((f) => [{ id, s }, ...f].slice(0, 4));
      if (s.status === "aprovada") {
        setExtra((e) => e + s.value);
        setCount((c) => c + 1);
      }
    };
    const t0 = setTimeout(tick, 2600);
    const int = setInterval(tick, 3600);
    return () => {
      clearTimeout(t0);
      clearInterval(int);
    };
  }, [live]);

  const gross = 1482.3 + extra;
  const net = 1284.9 + extra * 0.87;
  const spend = 318.4;
  const profit = net - spend - 54.35;
  const roas = net / spend;

  return (
    <div
      className={clsx(
        "relative flex w-full bg-app text-left",
        full
          ? "min-h-screen"
          : "h-full overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_60px_140px_-40px_rgba(0,0,0,.9)]",
        className,
      )}
      aria-hidden={!full}
    >
      <div className={full ? "hidden lg:contents" : "contents"}>
        <Sidebar active="dashboard" className={full ? "sticky top-0 h-screen" : undefined} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className={full ? "hidden lg:block" : undefined}>
          <TopBar revenue={4520 + extra} sales={169 + (count - 61)} />
        </div>
        {full && <MobileHeader revenue={4520 + extra} sales={169 + (count - 61)} />}

        <div className={clsx("flex flex-1 flex-col gap-3 px-4 pb-4", full && "px-3 pb-24 pt-3 lg:px-4 lg:pb-4 lg:pt-0")}>
          {/* Cabeçalho da página */}
          <Card className="px-5 py-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[18px] font-bold tracking-tight">Dashboard Geral</div>
                <div className="mt-0.5 hidden text-[10.5px] text-fg-3 lg:block">
                  Visão consolidada da operação — receita, investimento, lucro e as ofertas que puxam o resultado.
                </div>
              </div>
              <div className="hidden items-center gap-2 lg:flex">
                <PBtn tone="ghost" icon={RefreshCw}>Atualizar</PBtn>
                <span className="flex items-center gap-1.5 text-[11px] text-fg-2"><LayoutGrid className="h-3 w-3" /> Editar layout</span>
                <span className="flex items-center gap-1.5 text-[11px] text-fg-2"><Download className="h-3 w-3" /> Exportar</span>
                <HelpCircle className="h-3.5 w-3.5 text-fg-3" />
              </div>
              <div className="flex shrink-0 items-center gap-3 lg:hidden">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#0d0d0d]"><RefreshCw className="h-3.5 w-3.5" /></span>
                <LayoutGrid className="h-4 w-4 text-fg-2" />
                <Download className="h-4 w-4 text-fg-2" />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 lg:flex">
              <SelectBox className="h-10 text-[13px] lg:h-8 lg:w-[130px] lg:text-[11px]">Hoje</SelectBox>
              <SelectBox icon={Filter} className="h-10 whitespace-nowrap text-[13px] lg:h-8 lg:text-[11px]">Todas as Ofertas</SelectBox>
            </div>
          </Card>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card className="p-4">
              <Label info className="lg:hidden">Faturamento bruto</Label>
              <div className="mt-0.5 text-[13px] text-fg-2 lg:hidden"><Money v={gross} /></div>
              <Label info className="hidden lg:flex">
                Faturamento bruto <span className="ml-1 normal-case tracking-normal text-fg-2"><Money v={gross} /></span>
              </Label>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan/15 text-cyan"><DollarSign className="h-3 w-3" /></span>
                <Label info>Faturamento líquido</Label>
              </div>
              <div className="mt-2 text-[24px] font-bold tracking-tight text-cyan lg:text-[22px]">
                <Rolling value={net} prefix="R$ " digits={2} />
              </div>
            </Card>
            <KpiCard label="Investimento total" value={spend} tone="orange" icon={Target} />
            <Card tone="green" glow className="p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green/15 text-green"><TrendingUp className="h-3 w-3" /></span>
                <Label info>Lucro operacional</Label>
              </div>
              <div className="mt-2 text-[24px] font-bold tracking-tight text-green lg:text-[22px]">
                <Rolling value={profit} prefix="R$ " digits={2} />
              </div>
            </Card>
            <KpiCard label="ROAS médio" value={<span className="tabular">{roas.toFixed(2)}x</span>} tone="green" icon={BarChart3} />
          </div>

          {/* Faixa secundária */}
          <Card className="grid grid-cols-2 gap-px bg-white/[0.06] lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-white/[0.06] lg:bg-card">
            {[
              { l: "Nº de vendas", v: <Rolling value={count} /> },
              { l: "Vendas pendentes", v: <><Money v={176.4} /> <span className="text-[9px] text-fg-3">(12,1%)</span></> },
              { l: "Reembolso", v: <><Money v={0} /> <span className="text-[9px] text-fg-3">(0,00%)</span></> },
              { l: "Imp. Meta", v: <Money v={17.2} /> },
              { l: "Imp. Empresa", v: <Money v={0} /> },
            ].map((k) => (
              <div key={k.l} className="bg-card px-3 py-3 text-center last:col-span-2 lg:py-2.5 lg:last:col-span-1">
                <Label className="justify-center">{k.l}</Label>
                <div className="mt-1 text-[15px] font-bold tracking-tight lg:text-[13px]">{k.v}</div>
              </div>
            ))}
          </Card>

          {/* Evolução + últimas vendas */}
          <Card className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[1.55fr_1fr]">
            <div className="flex min-w-0 flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] font-bold tracking-tight">Evolução da operação</div>
                  <div className="text-[9.5px] text-fg-3">Faturamento líquido × investimento total × lucro operacional, por hora (acumulado)</div>
                </div>
                <span className="flex shrink-0 items-center gap-2 text-[9px]">
                  <span className="hidden rounded border border-white/10 px-1.5 py-0.5 text-fg-3 sm:inline">Gasto rateado no dia</span>
                  <span className="flex items-center gap-1 text-green"><span className="h-1.5 w-1.5 rounded-full bg-green" /> Ao Vivo</span>
                  <ArrowUpRight className="h-3 w-3 text-fg-3" />
                </span>
              </div>
              <div className="-mx-2 overflow-x-auto"><div className="min-w-[560px] px-2"><EvolutionChart revenue={REV} profit={PROFIT} spend={SPEND} now={19} className="mt-2" play /></div></div>
              <ChartLegend
                className="mt-1 justify-center"
                items={[
                  { c: "#22d3ee", l: "Faturamento líquido" },
                  { c: "#22c55e", l: "Lucro operacional" },
                  { c: "#ffa726", l: "Investimento total" },
                ]}
              />
            </div>

            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-1.5 text-[10.5px] text-fg-2">
                <Radio className="h-3 w-3 text-green" /> Últimas vendas
              </div>
              <div className="relative mt-2 flex-1 overflow-hidden" style={{ minHeight: 4 * 52 }}>
                <AnimatePresence initial={false}>
                  {feed.map(({ id, s }, i) => (
                    <motion.div
                      key={id}
                      className="absolute inset-x-0 top-0"
                      initial={{ opacity: 0, y: -52, scale: 0.97 }}
                      animate={{ opacity: 1, y: i * 52, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <MiniSaleRow sale={s} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="mt-2 flex h-7 items-center justify-center gap-1.5 rounded-full border border-white/[0.1] text-[10px] font-medium">
                <Radio className="h-3 w-3 text-green" /> Acompanhar vendas ao vivo <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          </Card>

          {/* Distribuição de lucro */}
          <Card className="p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold tracking-tight">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red/15 text-red"><BarChart3 className="h-3 w-3" /></span>
              Distribuição de Lucro Nas Ofertas
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="rounded-lg border border-green/25 bg-[#0f1a12]/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-green"><TrendingUp className="h-3 w-3" /> Ofertas Positivas</span>
                  <span className="text-[9px] text-fg-3">{POSITIVE.length} ofertas</span>
                </div>
                {POSITIVE.map((o) => (
                  <div key={o.n} className="flex items-center justify-between border-t border-white/[0.05] py-2 first:border-0">
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green" />
                      <span>
                        <span className="block text-[11px] font-semibold">{o.n}</span>
                        <span className="mt-0.5 flex items-center gap-2"><StatusPill tone="green">Ativa</StatusPill>{o.imp > 0 && <span className="text-[8.5px] text-fg-3">– <Money v={o.imp} /> imp.</span>}</span>
                      </span>
                    </span>
                    <span className="text-[12px] font-bold text-green"><Money v={o.v} /></span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-red/25 bg-[#1a0f10]/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-red"><TrendingDown className="h-3 w-3" /> Ofertas Negativas</span>
                  <span className="text-[9px] text-fg-3">0 ofertas</span>
                </div>
                <div className="mt-3 text-[10.5px] text-fg-2">Nenhuma oferta no prejuízo no período.</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {full && <MobileTabBar />}
    </div>
  );
}

/* ---------- Casca mobile (< lg): cabeçalho com meta e barra de abas ---------- */

function MobileHeader({ revenue, sales }: { revenue: number; sales: number }) {
  const pct = Math.min(100, (revenue / 10000) * 100);
  return (
    <div className="sticky top-0 z-20 border-b border-white/[0.06] bg-app lg:hidden">
      <div className="flex h-14 items-center gap-4 px-4">
        <Menu className="h-5 w-5 text-fg-2" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-icon.svg" alt="" className="h-7 w-7" />
        <span className="text-[17px] font-bold tracking-tight">Dashboard</span>
        <Search className="ml-auto h-5 w-5 text-fg-2" />
      </div>
      <div className="flex items-center gap-4 border-t border-white/[0.06] px-4 py-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 whitespace-nowrap text-[12px]">
            <Trophy className="h-3 w-3 shrink-0 text-amber" />
            <span className="text-fg-2">Faturamento</span>
            <span className="ml-1 font-semibold">R$ {(revenue / 1000).toFixed(1).replace(".", ",")}k</span>
            <span className="text-fg-3">/ R$ 10k</span>
          </div>
          <div className="mt-1.5 h-[5px] max-w-[260px] overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full rounded-full bg-gradient-to-r from-green via-green to-amber" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1 text-[11px] text-fg-3">{sales} de 1.500 vendas</div>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-fg-3">
          <Bell className="h-4 w-4" />
          <span className="flex items-center gap-1 text-[11px]"><DollarSign className="h-4 w-4" /> BRL</span>
          <Clock className="h-4 w-4" />
          <Eye className="h-4 w-4" />
          <Type className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { icon: LayoutGrid, l: "Dashboard", on: true },
  { icon: TrendingUp, l: "Tráfego" },
  { icon: Landmark, l: "Financeiro" },
  { icon: Package, l: "Ofertas" },
  { icon: MoreHorizontal, l: "Mais" },
];

function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-white/[0.08] bg-[#0e0e0e] pb-[env(safe-area-inset-bottom)] lg:hidden">
      {TABS.map(({ icon: I, l, on }) => (
        <span key={l} className={clsx("flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium", on ? "text-red" : "text-fg-2")}>
          <I className="h-5 w-5" />
          {l}
        </span>
      ))}
    </nav>
  );
}
