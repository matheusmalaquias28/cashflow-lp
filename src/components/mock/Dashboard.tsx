"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Megaphone,
  Layers,
  Wallet,
  Bell,
  Search,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  CalendarDays,
} from "lucide-react";
import clsx from "clsx";
import { AreaChart, Counter, Pill, PlatformDot, Sparkline, BRL } from "./atoms";
import { OFFER } from "@/lib/data";

const SALES = [
  { platform: "Kiwify", offer: OFFER.desafio.name, value: 47 },
  { platform: "Hotmart", offer: OFFER.violao.name, value: 97 },
  { platform: "Cakto", offer: OFFER.rotina.name, value: 37 },
  { platform: "Ticto", offer: OFFER.desafio.name, value: 47 },
  { platform: "Kirvano", offer: OFFER.churrasco.name, value: 27 },
  { platform: "Hubla", offer: OFFER.violao.name, value: 97 },
  { platform: "Lastlink", offer: OFFER.rotina.name, value: 37 },
  { platform: "Payt", offer: OFFER.churrasco.name, value: 27 },
];

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Layers, label: "Ofertas" },
  { icon: Megaphone, label: "Tráfego" },
  { icon: Wallet, label: "Financeiro" },
];

const CHART = [18, 22, 19, 27, 31, 28, 36, 41, 38, 47, 52, 49, 58, 63, 61, 72, 78, 75, 84, 91];
const CHART_PREV = [14, 16, 18, 17, 22, 24, 23, 28, 30, 29, 34, 36, 35, 40, 42, 41, 46, 49, 48, 53];

const OFFERS = [
  { name: OFFER.desafio.name, sales: 412, rev: 19364, roas: 3.38, margin: 31.6, spark: [3, 5, 4, 7, 8, 9, 12] },
  { name: OFFER.violao.name, sales: 188, rev: 18236, roas: 2.35, margin: 17.8, spark: [6, 5, 7, 6, 8, 7, 9] },
  { name: OFFER.rotina.name, sales: 240, rev: 8880, roas: 2.91, margin: 24.2, spark: [2, 4, 3, 5, 6, 8, 8] },
  { name: OFFER.churrasco.name, sales: 126, rev: 3402, roas: 1.42, margin: 4.1, spark: [5, 4, 4, 3, 3, 2, 2] },
];

export function Dashboard({ className, live = true }: { className?: string; live?: boolean }) {
  const [feed, setFeed] = useState<{ id: number; s: (typeof SALES)[number] }[]>([]);
  const [extra, setExtra] = useState(0);

  useEffect(() => {
    if (!live) return;
    let i = 0;
    let id = 0;
    const tick = () => {
      const s = SALES[i % SALES.length];
      i++;
      id++;
      setFeed((f) => [{ id, s }, ...f].slice(0, 4));
      setExtra((e) => e + s.value);
    };
    const t0 = setTimeout(tick, 2200);
    const int = setInterval(tick, 3400);
    return () => {
      clearTimeout(t0);
      clearInterval(int);
    };
  }, [live]);

  return (
    <div
      className={clsx(
        "relative flex h-full w-full overflow-hidden rounded-2xl border border-line-2 bg-[#0a0a0b] text-left shadow-[0_60px_140px_-40px_rgba(0,0,0,.9)]",
        className,
      )}
      aria-hidden
    >
      {/* Sidebar */}
      <aside className="flex w-[16%] shrink-0 flex-col border-r border-line bg-[#0c0c0d] p-[2%]">
        <div className="mb-[10%] flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-icon.svg" alt="" className="h-[23px] w-[23px]" />
          <span className="text-[13px] font-bold tracking-tight">Cashflow</span>
        </div>
        <nav className="flex flex-col gap-[3%]">
          {NAV.map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={clsx(
                "flex items-center gap-2 rounded-lg px-[8%] py-[6%] text-[11px]",
                active ? "bg-white/[0.07] text-fg" : "text-fg-3",
              )}
            >
              <Icon className="h-[13px] w-[13px]" />
              <span className="truncate">{label}</span>
              {active && <span className="ml-auto h-1 w-1 rounded-full bg-red" />}
            </div>
          ))}
        </nav>
        <div className="mt-auto rounded-lg border border-line bg-white/[0.02] p-[8%]">
          <div className="eyebrow !text-[8px]">Operação</div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="font-semibold">Principal</span>
            <ChevronDown className="h-3 w-3 text-fg-3" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between border-b border-line px-[2.5%] py-[1.4%]">
          <div>
            <div className="text-[16px] font-bold tracking-tight">Dashboard</div>
            <div className="text-[10px] text-fg-3">Visão geral da operação</div>
          </div>
          <div className="flex items-center gap-[1.5%]">
            <div className="flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-[10px] text-fg-2 flex whitespace-nowrap">
              <CalendarDays className="h-3 w-3" /> Últimos 30 dias <ChevronDown className="h-3 w-3" />
            </div>
            <div className="flex h-[29px] w-[29px] items-center justify-center rounded-full border border-line text-fg-3">
              <Search className="h-3 w-3" />
            </div>
            <div className="relative flex h-[29px] w-[29px] items-center justify-center rounded-full border border-line text-fg-3">
              <Bell className="h-3 w-3" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red" />
            </div>
            <div className="flex h-[29px] w-[29px] items-center justify-center rounded-full border border-line text-fg-3">
              <Settings className="h-3 w-3" />
            </div>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-12 gap-[1.6%] p-[2.5%]">
          {/* KPIs */}
          <div className="col-span-12 grid grid-cols-4 gap-[1.6%]">
            <Kpi label="Faturamento" value={98762 + extra} prefix="R$ " delta="+18,4%" up />
            <Kpi label="Investimento" value={41420} prefix="R$ " delta="+6,1%" up={false} muted />
            <Kpi label="Lucro líquido" value={33180 + extra * 0.42} prefix="R$ " delta="+24,9%" up accent />
            <Kpi label="ROAS" value={2.38} digits={2} delta="+0,21" up />
          </div>

          {/* Chart */}
          <div className="col-span-8 flex flex-col rounded-xl border border-line bg-white/[0.02] p-[2%]">
            <div className="mb-[2%] flex items-center justify-between">
              <div>
                <div className="text-[12px] font-semibold">Faturamento × período anterior</div>
                <div className="text-[9px] text-fg-3">Atualizado agora</div>
              </div>
              <div className="flex gap-3 text-[9px] text-fg-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-3 rounded-full bg-red" /> Atual
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-3 rounded-full bg-white/30" /> Anterior
                </span>
              </div>
            </div>
            <AreaChart id="hero-chart" data={CHART} data2={CHART_PREV} width={600} height={190} className="mt-auto" />
          </div>

          {/* Live feed */}
          <div className="col-span-4 flex flex-col rounded-xl border border-line bg-white/[0.02] p-[2%]">
            <div className="mb-[3%] flex items-center justify-between">
              <div className="text-[12px] font-semibold">Vendas em tempo real</div>
              <Pill tone="red">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-red animate-pulse-dot" />
                  <span className="h-1.5 w-1.5 rounded-full bg-red" />
                </span>
                LIVE
              </Pill>
            </div>
            <div className="relative flex flex-1 flex-col gap-[3%] overflow-hidden mask-fade-b">
              <AnimatePresence initial={false}>
                {feed.map(({ id, s }) => (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0, y: -18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-2 rounded-lg border border-line bg-[#101012] px-[4%] py-[3%]"
                  >
                    <PlatformDot name={s.platform} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[11px] font-medium">{s.offer}</div>
                      <div className="text-[9px] text-fg-3">{s.platform} · agora</div>
                    </div>
                    <div className="font-mono text-[11px] tabular text-green">+R$ {BRL(s.value)}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {feed.length === 0 && (
                <div className="flex flex-1 items-center justify-center text-[10px] text-fg-3">
                  Aguardando vendas…
                </div>
              )}
            </div>
          </div>

          {/* Offers table */}
          <div className="col-span-12 rounded-xl border border-line bg-white/[0.02] p-[2%]">
            <div className="mb-[1%] flex items-center justify-between">
              <div className="text-[12px] font-semibold">Ofertas</div>
              <span className="text-[9px] text-fg-3">Ordenado por lucro</span>
            </div>
            <div className="grid grid-cols-[2fr_1fr_1.2fr_1fr_1fr_1.2fr] items-center gap-2 border-b border-line py-[0.8%] font-mono text-[9px] uppercase tracking-wider text-fg-3">
              <span>Oferta</span>
              <span className="text-right">Vendas</span>
              <span className="text-right">Receita</span>
              <span className="text-right">ROAS</span>
              <span className="text-right">Margem</span>
              <span className="text-right">7 dias</span>
            </div>
            {OFFERS.map((o, i) => (
              <motion.div
                key={o.name}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
                className="grid grid-cols-[2fr_1fr_1.2fr_1fr_1fr_1.2fr] items-center gap-2 border-b border-line/60 py-[0.9%] text-[11px] last:border-0"
              >
                <span className="flex items-center gap-2 font-medium">
                  <span className={clsx("h-1.5 w-1.5 rounded-full", o.margin > 20 ? "bg-green" : o.margin > 10 ? "bg-white/40" : "bg-red")} />
                  {o.name}
                </span>
                <span className="text-right font-mono tabular text-fg-2">{o.sales}</span>
                <span className="text-right font-mono tabular">R$ {BRL(o.rev)}</span>
                <span className="text-right font-mono tabular text-fg-2">{o.roas.toFixed(2).replace(".", ",")}</span>
                <span className={clsx("text-right font-mono tabular", o.margin > 20 ? "text-green" : o.margin < 10 ? "text-red" : "text-fg-2")}>
                  {o.margin.toFixed(1).replace(".", ",")}%
                </span>
                <span className="flex justify-end">
                  <Sparkline data={o.spark} width={64} height={18} color={o.margin < 10 ? "#FA0A15" : "#22c55e"} />
                </span>
              </motion.div>
            ))}
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
  digits = 0,
  delta,
  up,
  accent,
  muted,
}: {
  label: string;
  value: number;
  prefix?: string;
  digits?: number;
  delta: string;
  up: boolean;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-xl border p-[6%]",
        accent ? "border-green/40 bg-green/[0.07]" : "border-line bg-white/[0.02]",
      )}
    >
      {accent && <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green/30 blur-2xl" />}
      <div className="text-[9px] text-fg-3">{label}</div>
      <div className={clsx("mt-[3%] text-[19px] font-bold tracking-tight", accent && "text-green")}>
        <Counter to={value} prefix={prefix} digits={digits} />
      </div>
      <div
        className={clsx(
          "mt-[3%] flex items-center gap-0.5 font-mono text-[9px] tabular",
          muted ? "text-fg-3" : up ? "text-green" : "text-red",
        )}
      >
        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {delta}
      </div>
    </div>
  );
}
