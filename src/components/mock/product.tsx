"use client";

/**
 * Kit de UI que reproduz a linguagem visual do Cashflow real (sidebar, top bar
 * com meta de faturamento, cards escuros, KPIs em ciano/laranja/verde, feed de
 * vendas, gráficos). Todos os dados que passam por aqui são fictícios.
 */

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import {
  Activity,
  Bell,
  BarChart3,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Globe,
  Hourglass,
  Info,
  LayoutGrid,
  Landmark,
  Package,
  PlayCircle,
  Radio,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Trophy,
  TrendingUp,
  Type,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { BRL } from "./atoms";

export const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- Superfícies ---------- */

export function Card({
  className,
  children,
  tone,
  glow,
}: {
  className?: string;
  children: ReactNode;
  /** Borda superior colorida + leve tinta, como o card "Lucro operacional". */
  tone?: "green" | "red" | "amber" | "blue" | "orange";
  glow?: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-xl border border-white/[0.06] bg-card",
        tone === "green" && "border-t-2 border-t-green bg-[#0f1a12]",
        tone === "red" && "border-t-2 border-t-red bg-[#1a0f10]",
        tone === "amber" && "border-amber/40 bg-[#1a160c]",
        tone === "blue" && "border-t-2 border-t-blue",
        tone === "orange" && "border-t-2 border-t-orange",
        className,
      )}
    >
      {glow && (
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green/25 blur-3xl" />
      )}
      {children}
    </div>
  );
}

/** Rótulo em mono, maiúsculo e espaçado — igual aos "FATURAMENTO LÍQUIDO ⓘ". */
export function Label({ children, className, info }: { children: ReactNode; className?: string; info?: boolean }) {
  return (
    <div className={clsx("flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-fg-3", className)}>
      {children}
      {info && <Info className="h-2.5 w-2.5 opacity-60" />}
    </div>
  );
}

export const TONE_TEXT = {
  cyan: "text-cyan",
  orange: "text-orange",
  green: "text-green",
  red: "text-red",
  amber: "text-amber",
  white: "text-fg",
  muted: "text-fg-2",
} as const;
export type Tone = keyof typeof TONE_TEXT;

export function Money({ v, digits = 2, className }: { v: number; digits?: number; className?: string }) {
  return (
    <span className={clsx("tabular", className)}>
      {v < 0 ? "-" : ""}R$ {BRL(Math.abs(v), digits)}
    </span>
  );
}

/* ---------- Pílulas e botões ---------- */

export function StatusPill({
  tone = "green",
  children,
  className,
}: {
  tone?: "green" | "red" | "orange" | "purple" | "amber" | "neutral";
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-[3px] font-mono text-[8.5px] font-semibold uppercase tracking-[0.12em]",
        tone === "green" && "border-green/40 bg-green/10 text-green",
        tone === "red" && "border-red/40 bg-red/10 text-red",
        tone === "orange" && "border-orange/40 bg-orange/10 text-orange",
        tone === "purple" && "border-purple/40 bg-purple/10 text-purple",
        tone === "amber" && "border-amber/40 bg-amber/10 text-amber",
        tone === "neutral" && "border-white/10 bg-white/[0.04] text-fg-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PBtn({
  tone = "dark",
  icon: Icon,
  children,
  className,
  size = "md",
}: {
  tone?: "dark" | "green" | "red" | "ghost";
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border font-medium whitespace-nowrap",
        size === "md" ? "h-8 px-3 text-[11px]" : "h-6.5 px-2.5 text-[10px]",
        tone === "dark" && "border-white/10 bg-[#0d0d0d] text-fg",
        tone === "green" && "border-green/35 bg-green/[0.12] text-green",
        tone === "red" && "border-red bg-red text-white",
        tone === "ghost" && "border-white/[0.08] bg-white/[0.03] text-fg-2",
        className,
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}

export function Toggle({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      className={clsx(
        "relative inline-flex h-[18px] w-[34px] shrink-0 items-center rounded-full transition-colors duration-300",
        on ? "bg-red" : "bg-white/15",
        className,
      )}
    >
      <motion.span
        className="absolute h-[14px] w-[14px] rounded-full bg-white shadow"
        animate={{ x: on ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </span>
  );
}

export function FilterChip({ active, children, count }: { active?: boolean; children: ReactNode; count?: number }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium",
        active ? "border-red/50 bg-red/10 text-red" : "border-white/[0.08] bg-white/[0.02] text-fg-2",
      )}
    >
      {children}
      {count !== undefined && (
        <span className={clsx("rounded-full px-1.5 font-mono text-[8.5px]", active ? "bg-red/20" : "bg-white/[0.06] text-fg-3")}>
          {count}
        </span>
      )}
    </span>
  );
}

export function SelectBox({ children, icon: Icon, className }: { children: ReactNode; icon?: LucideIcon; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex h-8 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0d0d0d] px-3 text-[11px] font-medium text-fg",
        className,
      )}
    >
      {Icon && <Icon className="h-3 w-3 text-fg-3" />}
      {children}
      <svg viewBox="0 0 10 10" className="ml-auto h-2.5 w-2.5 text-fg-3" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 3.5l3 3 3-3" />
      </svg>
    </span>
  );
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={clsx("relative inline-flex h-2 w-2", className)}>
      <span className="absolute inset-0 rounded-full bg-red animate-pulse-dot" />
      <span className="relative h-2 w-2 rounded-full bg-red" />
    </span>
  );
}

/* ---------- Ícones de plataforma ---------- */

const PLATFORM_ABBR: Record<string, string> = {
  Hotmart: "H",
  Kiwify: "K",
  Cakto: "C",
  Ticto: "T",
  Kirvano: "Kv",
  Hubla: "Hb",
  Lastlink: "L",
  Payt: "P",
};

export function PlatformBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded border border-white/[0.08] bg-white/[0.04] px-1.5 py-[1px] font-mono text-[8px] text-fg-2">
      {name}
    </span>
  );
}

export function PlatformAvatar({ name }: { name: string }) {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] font-mono text-[8px] font-bold text-fg-2">
      {PLATFORM_ABBR[name] ?? name[0]}
    </span>
  );
}

/* ---------- KPI ---------- */

export function KpiCard({
  label,
  value,
  tone = "white",
  icon: Icon,
  iconTone,
  digits = 2,
  prefix = "R$ ",
  suffix = "",
  sub,
  compact,
  className,
  highlight,
}: {
  label: string;
  value: ReactNode;
  tone?: Tone;
  icon?: LucideIcon;
  iconTone?: Tone;
  digits?: number;
  prefix?: string;
  suffix?: string;
  sub?: ReactNode;
  compact?: boolean;
  className?: string;
  /** Card verde com brilho — "Lucro operacional". */
  highlight?: boolean;
}) {
  void digits;
  return (
    <Card tone={highlight ? "green" : undefined} glow={highlight} className={clsx(compact ? "p-3" : "p-4", className)}>
      <div className="flex items-center gap-2">
        {Icon && (
          <span
            className={clsx(
              "flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]",
              TONE_TEXT[iconTone ?? tone],
            )}
          >
            <Icon className="h-3 w-3" />
          </span>
        )}
        <Label info>{label}</Label>
      </div>
      <div className={clsx("mt-2 font-bold tracking-tight", compact ? "text-lg" : "text-[22px]", TONE_TEXT[tone])}>
        {typeof value === "number" ? (
          <span className="tabular">
            {prefix}
            {BRL(value, digits)}
            {suffix}
          </span>
        ) : (
          value
        )}
      </div>
      {sub && <div className="mt-1 text-[10px] text-fg-3">{sub}</div>}
    </Card>
  );
}

/** Célula pequena "FATURAMENTO / R$ 466,90" usada nos cards de oferta. */
export function MetricCell({ label, value, tone = "white", className }: { label: string; value: ReactNode; tone?: Tone; className?: string }) {
  return (
    <div className={clsx("rounded-lg border border-white/[0.05] bg-[#0f0f0f] px-3 py-2.5", className)}>
      <Label>{label}</Label>
      <div className={clsx("mt-1 text-[13px] font-bold tracking-tight", TONE_TEXT[tone])}>{value}</div>
    </div>
  );
}

/* ---------- Casca do app ---------- */

export const NAV_ITEMS = [
  { icon: PlayCircle, label: "Como usar o CashFlow", key: "help" },
  { icon: Radio, label: "Ao Vivo", key: "live" },
  { icon: LayoutGrid, label: "Dashboard", key: "dashboard" },
  { icon: Package, label: "Gestão de Ofertas", key: "offers", chevron: true },
  { icon: TrendingUp, label: "Gestão de Tráfego", key: "traffic" },
  { icon: Landmark, label: "Gestão Financeira", key: "finance" },
] as const;

export function Sidebar({ active, className }: { active: string; className?: string }) {
  return (
    <aside className={clsx("flex w-[190px] shrink-0 flex-col border-r border-white/[0.06] bg-app-2", className)}>
      <div className="flex h-[52px] items-center gap-2 px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-icon.svg" alt="" className="h-[22px] w-[22px]" />
        <span className="text-[13px] font-bold tracking-tight">Cashflow</span>
        <span className="ml-auto h-3 w-3 rounded-sm border border-white/20" />
      </div>

      <div className="mx-3 mt-1 rounded-lg border border-white/[0.06] bg-card px-3 py-2">
        <Label>Operação</Label>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-blue" />
          Operação Principal
        </div>
      </div>

      <div className="mx-3 mt-2 flex h-8 items-center gap-2 rounded-lg border border-white/[0.06] bg-card px-2.5 text-[10px] text-fg-3">
        <Search className="h-3 w-3" /> Buscar…
        <span className="ml-auto rounded border border-white/10 px-1 font-mono text-[8px]">⌘K</span>
      </div>

      <nav className="mt-3 flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map(({ icon: Icon, label, key }) => (
          <div
            key={key}
            className={clsx(
              "flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[11px] font-medium",
              active === key ? "bg-red text-white" : "text-fg-2",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="truncate">{label}</span>
          </div>
        ))}
        <div className="my-1.5 border-t border-white/[0.06]" />
        <div className="flex h-8 items-center gap-2.5 px-2.5 text-[11px] font-medium text-fg-2">
          <Settings className="h-3.5 w-3.5" /> Configurações
        </div>
        {[
          { icon: Zap, l: "Integrações" },
          { icon: Bell, l: "Notificações" },
          { icon: CreditCard, l: "Assinatura" },
        ].map(({ icon: I, l }) => (
          <div key={l} className="flex h-7 items-center gap-2.5 pl-6 pr-2.5 text-[10.5px] text-fg-2">
            <I className="h-3 w-3" /> {l}
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2 text-[10.5px] text-fg-2">
          <span className="h-3 w-3 rounded-full border border-current" /> Modo Claro
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red/20 font-mono text-[8px] font-bold text-red">
            MA
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[10.5px] font-semibold">Marina Alencar</span>
            <span className="block truncate text-[8.5px] text-fg-3">marina@operacao.com</span>
          </span>
        </div>
      </div>
    </aside>
  );
}

export function TopBar({ revenue = 6120, goal = 10000, sales = 213, salesGoal = 1500, live }: { revenue?: number; goal?: number; sales?: number; salesGoal?: number; live?: boolean }) {
  const pct = Math.min(100, (revenue / goal) * 100);
  return (
    <header className="flex h-[52px] items-center justify-end gap-5 px-5">
      <div className="w-[240px]">
        <div className="flex items-center justify-between text-[9px]">
          <span className="flex items-center gap-1 text-amber">
            <Trophy className="h-2.5 w-2.5" /> <span className="text-fg-2">Faturamento</span> <Info className="h-2.5 w-2.5 text-fg-3" />
          </span>
          <span className="font-mono">
            <span className="font-semibold">R$ {(revenue / 1000).toFixed(1).replace(".", ",")}k</span>
            <span className="text-fg-3"> / R$ {goal / 1000}k</span>
          </span>
        </div>
        <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full rounded-full bg-gradient-to-r from-green via-green to-amber" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 font-mono text-[8.5px] text-fg-3">
          {sales} de {BRL(salesGoal)} vendas
        </div>
      </div>
      {live && (
        <span className="flex items-center gap-1 text-[9px] text-green">
          <Radio className="h-3 w-3" /> Ao vivo
        </span>
      )}
      <div className="flex items-center gap-4 text-fg-3">
        <RefreshCw className="h-3 w-3" />
        <Bell className="h-3 w-3" />
        <span className="flex items-center gap-1 text-[9px]">
          <DollarSign className="h-3 w-3" /> BRL
        </span>
        <span className="flex items-center gap-1 text-[9px]">
          <Clock className="h-3 w-3" /> Brasília
        </span>
        <Eye className="h-3 w-3" />
        <Type className="h-3 w-3" />
      </div>
    </header>
  );
}

export function PageTitle({ icon: Icon, title, sub, right, live }: { icon?: LucideIcon; title: string; sub?: string; right?: ReactNode; live?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red/15 text-red">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <div>
          <div className="flex items-center gap-2 text-[17px] font-bold tracking-tight">
            {title}
            {live && (
              <span className="flex items-center gap-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-red">
                <LiveDot /> Ao vivo
              </span>
            )}
          </div>
          {sub && <div className="text-[10.5px] text-fg-3">{sub}</div>}
        </div>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

/* ---------- Feed de vendas ---------- */

export type Sale = {
  platform: string;
  offer: string;
  product?: string;
  value: number;
  time: string;
  status: "aprovada" | "pendente";
};

export function FeedRow({ sale, compact, className }: { sale: Sale; compact?: boolean; className?: string }) {
  const pending = sale.status === "pendente";
  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-lg border px-3",
        compact ? "h-[46px]" : "h-[56px]",
        pending ? "border-amber/30 bg-[#1a1608]" : "border-green/25 bg-[#0f1a12]/70",
        className,
      )}
    >
      <span
        className={clsx(
          "flex shrink-0 items-center justify-center rounded-full bg-white/[0.05]",
          compact ? "h-7 w-7" : "h-8 w-8",
          pending ? "text-fg-2" : "text-amber",
        )}
      >
        {pending ? <Hourglass className="h-3.5 w-3.5" /> : <span className="text-[13px] leading-none">💰</span>}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 whitespace-nowrap leading-tight">
          <span className={clsx("font-semibold", compact ? "text-[11px]" : "text-[12px]")}>
            {pending ? "Venda Pendente" : "Nova Venda"}
          </span>
          <PlatformBadge name={sale.platform} />
        </span>
        <span className={clsx("mt-0.5 flex min-w-0 items-center gap-1.5 overflow-hidden leading-tight text-fg-3", compact ? "text-[9px]" : "text-[9.5px]")}>
          <span className="shrink-0 font-semibold text-fg">{sale.offer}</span>
          {sale.product && <span className="hidden min-w-0 truncate sm:inline">· {sale.product}</span>}
          <span className="flex shrink-0 items-center gap-0.5 whitespace-nowrap">
            · <Clock className="h-2.5 w-2.5" /> {sale.time}
          </span>
        </span>
      </span>
      <span className="text-right">
        <span className={clsx("block font-bold tabular", compact ? "text-[12px]" : "text-[14px]", pending ? "text-amber" : "text-green")}>
          +<Money v={sale.value} />
        </span>
        {!pending && !compact && (
          <span className="flex items-center justify-end gap-0.5 font-mono text-[8px] text-green">
            <TrendingUp className="h-2 w-2" /> aprovada
          </span>
        )}
      </span>
    </div>
  );
}

/** Linha compacta "Aprovada / Quilling — R$ 33,15" do widget Últimas vendas. */
export function MiniSaleRow({ sale }: { sale: Sale }) {
  const pending = sale.status === "pendente";
  return (
    <div className={clsx("flex h-[46px] items-center gap-2.5 rounded-lg border px-2.5", pending ? "border-amber/30 bg-[#1a1608]/70" : "border-green/25 bg-[#0f1a12]/60")}>
      <span className={clsx("flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.05]", pending ? "text-fg-2" : "text-amber")}>
        {pending ? <Hourglass className="h-3 w-3" /> : <span className="text-[11px] leading-none">💰</span>}
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className={clsx("block font-mono text-[8px] uppercase tracking-wider", pending ? "text-amber" : "text-green")}>
          {pending ? "Pendente" : "Aprovada"}
        </span>
        <span className="block truncate text-[10.5px] font-semibold">{sale.offer}</span>
        <span className="flex items-center gap-1 truncate text-[8.5px] text-fg-3">
          <Clock className="h-2 w-2" /> {sale.time} · {sale.product ?? sale.offer}
        </span>
      </span>
      <span className={clsx("shrink-0 text-[11px] font-bold tabular", pending ? "text-amber" : "text-green")}>
        <Money v={sale.value} />
      </span>
    </div>
  );
}

/** Barra roxa de nível ("OURO → próximo: DIAMANTE"). */
export function TierBar({ pct = 96 }: { pct?: number }) {
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-wider text-fg-3">
        <span className="flex items-center gap-1">
          <Trophy className="h-2.5 w-2.5 text-purple" /> Ouro
        </span>
        <span>Próximo: Diamante (2 vendas)</span>
      </div>
      <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
        <motion.div
          className="h-full rounded-full bg-purple shadow-[0_0_10px_rgba(168,85,247,.8)]"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
        />
      </div>
    </div>
  );
}

/* ---------- Gráficos ---------- */

/** "Ritmo de vendas hoje": barras ciano por hora com o valor em cima. */
export function HourBars({
  data,
  height = 150,
  className,
  max: maxProp,
}: {
  data: number[]; // 24 valores (0h–23h)
  height?: number;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const max = maxProp ?? Math.max(...data, 1);
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return (
    <div ref={ref} className={clsx("relative", className)}>
      <div className="relative" style={{ height }}>
        {ticks.map((t) => (
          <div key={t} className="absolute inset-x-6 border-t border-dashed border-white/[0.06]" style={{ bottom: `${t * 100}%` }}>
            <span className="absolute -left-6 -top-1.5 font-mono text-[7.5px] text-fg-3">{Math.round(max * t)}</span>
          </div>
        ))}
        <div className="absolute inset-y-0 left-6 right-0 flex items-end gap-[3px]">
          {data.map((v, i) => (
            <div key={i} className="relative flex h-full flex-1 items-end justify-center">
              {v > 0 && (
                <motion.div
                  className="relative w-full rounded-t-[2px] bg-cyan"
                  style={{ transformOrigin: "bottom" }}
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.03, ease: EASE }}
                >
                  <div style={{ height: (v / max) * height }} />
                </motion.div>
              )}
              {v > 0 && (
                <motion.span
                  className="absolute font-mono text-[7.5px] font-semibold text-fg"
                  style={{ bottom: (v / max) * height + 3 }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.03 }}
                >
                  {v}
                </motion.span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="ml-6 mt-1.5 flex gap-[3px]">
        {data.map((_, i) => (
          <span key={i} className="flex-1 text-center font-mono text-[6.5px] text-fg-3">
            {i % 2 === 0 ? `${String(i).padStart(2, "0")}:00` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function smooth(points: [number, number][]) {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const t = 0.18;
    d += ` C ${p1[0] + (p2[0] - p0[0]) * t} ${p1[1] + (p2[1] - p0[1]) * t}, ${p2[0] - (p3[0] - p1[0]) * t} ${p2[1] - (p3[1] - p1[1]) * t}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/**
 * "Evolução da operação": três linhas acumuladas por hora (faturamento ciano,
 * lucro verde, investimento laranja), com pontos, área verde e projeção
 * tracejada depois da hora atual.
 */
export function EvolutionChart({
  revenue,
  profit,
  spend,
  now = 19,
  width = 760,
  height = 210,
  className,
  play,
}: {
  revenue: number[]; // 24 acumulados
  profit: number[];
  spend: number[];
  now?: number;
  width?: number;
  height?: number;
  className?: string;
  /** Força a animação (ex.: hero, que começa abaixo da dobra). */
  play?: boolean;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const padL = 44;
  const padR = 10;
  const padT = 10;
  const padB = 22;
  const max = Math.max(...revenue) * 1.1;
  const min = -Math.max(...revenue) * 0.12;
  const x = (i: number) => padL + (i / 23) * (width - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (height - padT - padB);
  const pts = (arr: number[]) => arr.map((v, i) => [x(i), y(v)] as [number, number]);
  const upTo = (arr: number[]) => pts(arr).slice(0, now + 1);
  const series = [
    { k: "rev", d: revenue, c: "#22d3ee" },
    { k: "spend", d: spend, c: "#ffa726" },
    { k: "profit", d: profit, c: "#22c55e" },
  ];
  const gridVals = [0, 0.33, 0.66, 1].map((f) => Math.round((max * f) / 100) * 100);
  const on = play || inView;
  const profitPts = upTo(profit);
  const area = `${smooth(profitPts)} L ${x(now)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  return (
    <svg ref={ref} viewBox={`0 0 ${width} ${height}`} className={clsx("h-auto w-full", className)} fill="none">
      <defs>
        <linearGradient id="evo-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {gridVals.map((g) => (
        <g key={g}>
          <line x1={padL} x2={width - padR} y1={y(g)} y2={y(g)} stroke="rgba(255,255,255,0.07)" strokeDasharray="3 5" />
          <text x={padL - 6} y={y(g) + 3} fill="rgba(255,255,255,0.35)" fontSize="8" textAnchor="end" fontFamily="var(--font-mono)">
            R$ {g}
          </text>
        </g>
      ))}
      {Array.from({ length: 24 }, (_, i) => (
        <text key={i} x={x(i)} y={height - 6} fill="rgba(255,255,255,0.3)" fontSize="7" textAnchor="middle" fontFamily="var(--font-mono)">
          {String(i).padStart(2, "0")}:00
        </text>
      ))}
      <line x1={x(now)} x2={x(now)} y1={padT} y2={height - padB} stroke="rgba(255,255,255,0.12)" strokeDasharray="2 4" />

      <motion.path d={area} fill="url(#evo-fill)" initial={{ opacity: 0 }} animate={on ? { opacity: 1 } : {}} transition={{ duration: 1.2, delay: 0.8 }} />

      {series.map((s, si) => {
        const solid = smooth(upTo(s.d));
        const last = s.d[now];
        const projEnd = last * 1.03;
        const proj = `M ${x(now)} ${y(last)} L ${x(23)} ${y(projEnd)}`;
        return (
          <g key={s.k}>
            <motion.path
              d={solid}
              stroke={s.c}
              strokeWidth={s.k === "rev" ? 2 : 1.75}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={on ? { pathLength: 1 } : {}}
              transition={{ duration: 1.6, delay: si * 0.15, ease: EASE }}
            />
            <motion.path
              d={proj}
              stroke={s.c}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity={0.8}
              initial={{ pathLength: 0 }}
              animate={on ? { pathLength: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.6 + si * 0.1 }}
            />
            {upTo(s.d).map(([px, py], i) => (
              <motion.circle
                key={i}
                cx={px}
                cy={py}
                r="2.2"
                fill={s.c}
                initial={{ opacity: 0 }}
                animate={on ? { opacity: 1 } : {}}
                transition={{ delay: (i / now) * 1.6 + si * 0.15 }}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function ChartLegend({ items, className }: { items: { c: string; l: string }[]; className?: string }) {
  return (
    <div className={clsx("flex flex-wrap items-center gap-4 font-mono text-[8.5px]", className)}>
      {items.map((i) => (
        <span key={i.l} className="flex items-center gap-1.5" style={{ color: i.c }}>
          <span className="flex items-center">
            <span className="h-px w-2" style={{ background: i.c }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: i.c }} />
            <span className="h-px w-2" style={{ background: i.c }} />
          </span>
          {i.l}
        </span>
      ))}
    </div>
  );
}

/** Funil de conversão do Meta Ads: faixa laranja→vermelha que afunila entre etapas. */
export function Funnel({
  stages,
  height = 170,
  className,
}: {
  stages: { label: string; value: number }[];
  height?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const W = 600;
  const n = stages.length;
  const sw = W / n;
  const base = stages[0].value;
  const pct = stages.map((s) => s.value / base);
  const cy = height / 2;
  const half = (p: number) => Math.max(4, (p * height) / 2);

  // Aresta superior: patamar por etapa e curva suave na fronteira.
  let top = `M 0 ${cy - half(pct[0])}`;
  for (let i = 0; i < n; i++) {
    const x0 = i * sw;
    const x1 = (i + 1) * sw;
    const h = half(pct[i]);
    const flatEnd = i === n - 1 ? x1 : x0 + sw * 0.62;
    top += ` L ${flatEnd} ${cy - h}`;
    if (i < n - 1) {
      const h2 = half(pct[i + 1]);
      top += ` C ${x1} ${cy - h}, ${x1} ${cy - h2}, ${x1 + sw * 0.38} ${cy - h2}`;
    }
  }
  // Aresta inferior, espelhada, percorrida da direita para a esquerda.
  let bot = "";
  for (let i = n - 1; i >= 0; i--) {
    const x0 = i * sw;
    const x1 = (i + 1) * sw;
    const h = half(pct[i]);
    const flatEnd = i === n - 1 ? x1 : x0 + sw * 0.62;
    const flatStart = i === 0 ? 0 : x0 + sw * 0.38;
    bot += ` L ${flatEnd} ${cy + h} L ${flatStart} ${cy + h}`;
    if (i > 0) {
      const hp = half(pct[i - 1]);
      bot += ` C ${x0} ${cy + h}, ${x0} ${cy + hp}, ${(i - 1) * sw + sw * 0.62} ${cy + hp}`;
    }
  }
  const d = `${top}${bot} Z`;

  return (
    <div ref={ref} className={clsx("relative", className)}>
      <div className="grid font-mono text-[8px] text-fg-3" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {stages.map((s) => (
          <span key={s.label} className="text-center">
            {s.label}
          </span>
        ))}
      </div>
      <div className="relative mt-1.5" style={{ height }}>
        <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="funnel-grad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#FFA726" />
              <stop offset="55%" stopColor="#F2622E" />
              <stop offset="100%" stopColor="#C81E1E" />
            </linearGradient>
          </defs>
          <motion.path
            d={d}
            fill="url(#funnel-grad)"
            style={{ transformOrigin: "0% 50%" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.1, ease: EASE }}
          />
          {stages.slice(1).map((_, i) => (
            <line key={i} x1={(i + 1) * sw} x2={(i + 1) * sw} y1={0} y2={height} stroke="rgba(255,255,255,0.12)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {pct.map((p, i) => (
            <motion.span
              key={i}
              className="flex items-center justify-center text-[11px] font-bold text-white drop-shadow"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              {(p * 100).toFixed(1)}%
            </motion.span>
          ))}
        </div>
      </div>
      <div className="mt-2 grid font-mono text-[10px] font-semibold" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {stages.map((s) => (
          <span key={s.label} className="text-center">
            {s.value}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Cards de oferta ("Gestão de Ofertas") ---------- */

export type OfferStat = {
  name: string;
  sub?: string;
  lucro: number;
  faturamento: number;
  gasto: number;
  roas: number | null;
  margem: number | null;
  status?: "ativa" | "pausa";
  pixel?: boolean;
  dupla?: boolean;
  bump?: boolean;
};

export function OfferCard({ o, className }: { o: OfferStat; className?: string }) {
  return (
    <Card className={clsx("p-4", className)}>
      <div className="flex items-center gap-1.5">
        <span className={clsx("h-2.5 w-2.5 rounded-full border-2", o.status === "pausa" ? "border-fg-3" : "border-red")} />
        <StatusPill tone={o.status === "pausa" ? "neutral" : "green"}>{o.status === "pausa" ? "Em pausa" : "Ativa"} ▾</StatusPill>
        {o.dupla && <StatusPill tone="orange">Dupla oferta</StatusPill>}
        {!o.pixel && <StatusPill tone="red">⚠ Sem pixel</StatusPill>}
      </div>
      <div className="mt-3 text-[13px] font-bold tracking-tight">{o.name}</div>
      {o.sub && <div className="mt-0.5 text-[9.5px] text-fg-3">{o.sub}</div>}

      <div className="mt-3 rounded-lg border border-white/[0.05] bg-[#0f0f0f] px-3 py-2.5">
        <Label>Lucro</Label>
        <div className={clsx("mt-1 text-[22px] font-bold tracking-tight", o.lucro === 0 ? "text-fg-3" : o.lucro < 0 ? "text-red" : "text-green")}>
          {o.lucro === 0 ? "—" : <Money v={o.lucro} />}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <MetricCell label="Faturamento" value={<Money v={o.faturamento} />} tone="cyan" />
        <MetricCell label="Gasto c/ anúncio" value={<Money v={o.gasto} />} tone="orange" />
        <MetricCell label="ROAS" value={o.roas === null ? "—" : `${o.roas.toFixed(2)}x`} tone={o.roas === null ? "red" : "white"} />
        <MetricCell label="Margem" value={o.margem === null ? "—" : `${o.margem.toFixed(0)}%`} tone={o.margem === null ? "red" : "green"} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <PBtn tone="green" icon={SlidersHorizontal}>
          {o.dupla ? "Gestão da Dupla" : "Gestão da Oferta"}
        </PBtn>
        <PBtn tone="dark" icon={Globe}>
          Tráfego
        </PBtn>
      </div>
      {o.bump && <div className="mt-2 text-[8.5px] text-fg-3">↳ É um order bump de…</div>}
    </Card>
  );
}

/* ---------- Reexports úteis ---------- */
export { Activity, BarChart3, Zap, Clock, DollarSign, Landmark, Trophy, RefreshCw, LayoutGrid };
