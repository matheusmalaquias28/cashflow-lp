"use client";

import { animate, AnimatePresence, motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  Radio,
  Layers,
  Megaphone,
  Wallet,
  Settings,
  ChevronDown,
  GraduationCap,
  Bell,
  Search,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { Pill, PlatformDot, BRL } from "@/components/mock/atoms";
import { RevenueChart } from "./RevenueChart";
import { OFFER } from "@/lib/data";

type NavEntry = { icon: LucideIcon; label: string; active?: boolean; chevron?: boolean };

const NAV: NavEntry[] = [
  { icon: GraduationCap, label: "Como usar o CashFlow" },
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Radio, label: "Ao vivo", active: true },
  { icon: Layers, label: "Gestão de Ofertas", chevron: true },
  { icon: Megaphone, label: "Gestão de Tráfego" },
  { icon: Wallet, label: "Gestão Financeira" },
];

const PRODUCTS = [
  OFFER.desafio.name,
  OFFER.violao.name,
  OFFER.rotina.name,
  OFFER.churrasco.name,
  OFFER.planner.name,
];
const PLATFORMS = ["Kiwify", "Hotmart", "Cakto", "Ticto", "Kirvano", "Hubla", "Lastlink", "Payt"];
const VALUES = [27, 37, 47, 67, 97];

// Business hours shown in the "ritmo de vendas hoje" bar chart.
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 08h → 22h
const HOUR_SEED = [3, 5, 8, 11, 14, 10, 8, 12, 16, 20, 24, 29, 26, 17, 9];

const GOAL = 100000;

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

type Sale = { id: number; platform: string; product: string; value: number; time: string };

export function LiveDashboard() {
  const [fat, setFat] = useState(30000);
  const [inv, setInv] = useState(12600);
  const [salesToday, setSalesToday] = useState(HOUR_SEED.reduce((a, b) => a + b, 0));
  const [hourly, setHourly] = useState<number[]>(HOUR_SEED);
  const [nowHour, setNowHour] = useState<number | null>(null);
  const [feed, setFeed] = useState<Sale[]>([]);
  const idRef = useRef(0);

  // Live engine: a new sale lands every couple seconds and every metric ticks up.
  useEffect(() => {
    setNowHour(new Date().getHours());
    const tick = () => {
      const platform = pick(PLATFORMS);
      const product = pick(PRODUCTS);
      const value = pick(VALUES);
      const d = new Date();
      const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      idRef.current += 1;
      const id = idRef.current;

      setFat((v) => v + value);
      setInv((v) => v + Math.round(value * (0.3 + Math.random() * 0.15)));
      setSalesToday((v) => v + 1);
      setHourly((prev) => {
        const idx = HOURS.indexOf(d.getHours());
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] += 1;
        return next;
      });
      setFeed((f) => [{ id, platform, product, value, time }, ...f].slice(0, 7));
    };

    const t0 = setTimeout(tick, 1200);
    const int = setInterval(tick, 2600);
    return () => {
      clearTimeout(t0);
      clearInterval(int);
    };
  }, []);

  const lucro = fat - inv;
  const roas = inv > 0 ? fat / inv : 0;
  const pct = Math.min(100, (fat / GOAL) * 100);
  const maxHour = Math.max(...hourly, 1);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg text-fg">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-[#0c0c0d] p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-icon.svg" alt="" className="h-6 w-6" />
          <span className="text-sm font-bold tracking-tight">Cashflow</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>
        <div className="mt-auto">
          <div className="my-3 h-px bg-line" />
          <NavItem icon={Settings} label="Configurações" chevron />
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex flex-col gap-3 border-b border-line px-4 py-3 sm:px-5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
          {/* Título + meta compacta (mesma linha no mobile) */}
          <div className="flex items-center justify-between gap-3 lg:justify-start">
            <div>
              <div className="flex items-center gap-2 text-base font-bold tracking-tight sm:text-lg">
                Ao vivo
                <Pill tone="red">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 rounded-full bg-red animate-pulse-dot" />
                    <span className="h-1.5 w-1.5 rounded-full bg-red" />
                  </span>
                  LIVE
                </Pill>
              </div>
              <div className="text-[11px] text-fg-3">Vendas acontecendo agora</div>
            </div>

            {/* Meta compacta — só mobile/tablet */}
            <MetaBar fat={fat} pct={pct} compact className="lg:hidden" />
          </div>

          {/* Controles */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-[12px] text-fg-2">
              <CalendarDays className="h-3.5 w-3.5" /> Últimos 30 dias <ChevronDown className="h-3.5 w-3.5" />
            </div>

            {/* Meta completa — só desktop */}
            <MetaBar fat={fat} pct={pct} className="hidden lg:flex" />

            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-3">
              <Search className="h-4 w-4" />
            </div>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-3">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red" />
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label="Faturamento" value={fat} prefix="R$ " delta="+18,4%" up />
            <Kpi label="Investimento" value={inv} prefix="R$ " delta="+6,1%" up={false} muted />
            <Kpi label="Lucro líquido" value={lucro} prefix="R$ " delta="+24,9%" up accent />
            <Kpi label="ROAS" value={roas} digits={2} delta="+0,21" up />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Faturamento chart */}
            <div className="panel flex flex-col p-4 lg:col-span-8">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Faturamento × período anterior</div>
                  <div className="text-[11px] text-fg-3">Atualizado agora</div>
                </div>
                <div className="flex gap-3 text-[11px] text-fg-3">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-3 rounded-full bg-red" /> Atual
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-3 rounded-full bg-white/30" /> Anterior
                  </span>
                </div>
              </div>
              <RevenueChart value={fat} className="mt-auto" />
            </div>

            {/* Ritmo de vendas hoje */}
            <div className="panel flex flex-col p-4 lg:col-span-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Ritmo de vendas hoje</div>
                  <div className="text-[11px] text-fg-3">Por horário · {salesToday} vendas</div>
                </div>
              </div>
              <div className="mt-auto flex items-end gap-1.5">
                {hourly.map((v, i) => {
                  const active = HOURS[i] === nowHour;
                  return (
                    <div key={HOURS[i]} className="flex flex-1 flex-col items-center gap-1.5">
                      <motion.div
                        className={clsx("w-full rounded-t-[3px]", active ? "bg-red" : "bg-white/15")}
                        initial={{ height: 0 }}
                        animate={{ height: 8 + (v / maxHour) * 150 }}
                        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                      />
                      <span className={clsx("text-[8px]", active ? "font-semibold text-red" : "text-fg-3")}>
                        {HOURS[i]}h
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Últimas vendas */}
            <div className="panel p-4 lg:col-span-12">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">Últimas vendas</div>
                <Pill tone="green">Tempo real</Pill>
              </div>
              <div className="flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {feed.map((s) => (
                    <motion.div
                      key={s.id}
                      layout
                      initial={{ opacity: 0, y: -14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-3 rounded-xl border border-line bg-[#101012] px-4 py-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green/15 text-green">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-green">Nova venda</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-fg-3">
                          <PlatformDot name={s.platform} />
                          <span>{s.platform}</span>
                          <span className="text-fg-3/60">·</span>
                          <span className="truncate text-fg-2">{s.product}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm font-semibold text-green">+R$ {BRL(s.value)}</div>
                        <div className="text-[11px] text-fg-3">{s.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {feed.length === 0 && (
                  <div className="py-10 text-center text-[12px] text-fg-3">Aguardando vendas…</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaBar({
  fat,
  pct,
  compact,
  className,
}: {
  fat: number;
  pct: number;
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <div
        className={clsx(
          "flex shrink-0 items-center gap-2 rounded-lg border border-line bg-white/[0.02] px-2.5 py-1.5",
          className,
        )}
      >
        <Target className="h-3.5 w-3.5 shrink-0 text-red" />
        <div className="w-24">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-red"
              animate={{ width: `${pct}%` }}
              transition={{ ease: "easeOut", duration: 0.8 }}
            />
          </div>
          <div className="mt-0.5 font-mono text-[10px] font-semibold leading-none text-fg">
            <LiveCounter value={fat} prefix="R$ " />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={clsx("items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-2", className)}>
      <Target className="h-4 w-4 shrink-0 text-red" />
      <div className="min-w-[190px]">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-fg-2">Faturamento</span>
          <span className="font-mono text-fg-3">Objetivo R$ {BRL(GOAL)}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-red"
            animate={{ width: `${pct}%` }}
            transition={{ ease: "easeOut", duration: 0.8 }}
          />
        </div>
        <div className="mt-1 font-mono text-[12px] font-semibold text-fg">
          <LiveCounter value={fat} prefix="R$ " />
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, chevron }: NavEntry) {
  return (
    <div
      className={clsx(
        "flex cursor-default items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors",
        active ? "bg-white/[0.07] text-fg" : "text-fg-3 hover:text-fg-2",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
      {chevron && <ChevronDown className="ml-auto h-3.5 w-3.5 text-fg-3" />}
      {active && !chevron && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-red" />}
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
        "relative overflow-hidden rounded-xl border p-4",
        accent ? "border-green/40 bg-green/[0.07]" : "border-line bg-white/[0.02]",
      )}
    >
      {accent && <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green/30 blur-2xl" />}
      <div className="text-[11px] text-fg-3">{label}</div>
      <div className={clsx("mt-1 text-2xl font-bold tracking-tight", accent && "text-green")}>
        <LiveCounter value={value} prefix={prefix} digits={digits} />
      </div>
      <div
        className={clsx(
          "mt-1 flex items-center gap-0.5 font-mono text-[11px] tabular",
          muted ? "text-fg-3" : up ? "text-green" : "text-red",
        )}
      >
        {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {delta}
      </div>
    </div>
  );
}

/** Smoothly animates the displayed number toward `value` every time it changes,
 *  so the metrics keep visibly climbing as new sales land. */
function LiveCounter({
  value,
  prefix = "",
  suffix = "",
  digits = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  digits?: number;
  className?: string;
}) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value, mv]);

  return (
    <span className={clsx("tabular", className)}>
      {prefix}
      {BRL(display, digits)}
      {suffix}
    </span>
  );
}
