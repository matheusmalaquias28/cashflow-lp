"use client";

/**
 * Tela "Ao vivo" do produto: feed de vendas em tempo real, com KPIs, ritmo por
 * hora e as últimas vendas chegando. Vive na segunda seção da página.
 */

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import clsx from "clsx";
import { Activity, Zap, Clock, DollarSign, BarChart3, Trophy, RefreshCw, Eye, Volume2 } from "lucide-react";
import { EASE, Rolling, useLiveInterval } from "./bento";
import { FeedRow, HourBars, LiveDot, StatusPill, TierBar, Toggle, type Sale } from "./product";
import { OFFER } from "@/lib/data";

const SALE_POOL: Sale[] = [
  { platform: "Kiwify", offer: OFFER.desafio.name, product: OFFER.desafio.name, value: 44.65, time: "18:41:22", status: "aprovada" },
  { platform: "Hotmart", offer: OFFER.violao.name, product: `${OFFER.violao.name} · Completo`, value: 92.15, time: "18:31:18", status: "aprovada" },
  { platform: "Cakto", offer: "Order · Planner de Hábitos", product: OFFER.rotina.name, value: 9.9, time: "18:16:08", status: "pendente" },
  { platform: "Kiwify", offer: "Order · Cardápio 21 Dias", product: OFFER.desafio.name, value: 12.9, time: "18:16:08", status: "pendente" },
  { platform: "Ticto", offer: OFFER.planner.name, product: OFFER.planner.name, value: 63.65, time: "18:09:41", status: "aprovada" },
  { platform: "Hubla", offer: OFFER.churrasco.name, product: OFFER.churrasco.name, value: 25.65, time: "17:58:03", status: "aprovada" },
];

const HOURS_BASE = [0, 0, 0, 0, 0, 0, 5, 2, 7, 1, 4, 3, 1, 9, 12, 1, 3, 6, 5, 0, 0, 0, 0, 0];
const ROW = 62;
const FEED_SLOTS = 4;

export function SalesFeed() {
  const [approved, setApproved] = useState(49);
  const [pending, setPending] = useState(13);
  const [revenue, setRevenue] = useState(1108.94);
  const [pendingRev, setPendingRev] = useState(236.32);
  const [hours, setHours] = useState(HOURS_BASE);
  const [feed, setFeed] = useState<{ id: number; s: Sale }[]>(() => SALE_POOL.slice(0, FEED_SLOTS).map((s, i) => ({ id: -i, s })));
  const beat = useRef(0);

  const ref = useLiveInterval(2600, () => {
    beat.current += 1;
    const id = beat.current;
    const sale = SALE_POOL[id % SALE_POOL.length];
    setFeed((f) => [{ id, s: sale }, ...f].slice(0, FEED_SLOTS));
    if (sale.status === "aprovada") {
      setApproved((c) => c + 1);
      setRevenue((r) => r + sale.value);
      setHours((h) => h.map((v, i) => (i === 18 ? v + 1 : v)));
    } else {
      setPending((c) => c + 1);
      setPendingRev((r) => r + sale.value);
    }
  });

  const total = hours.reduce((a, b) => a + b, 0);

  return (
    <div ref={ref} className="flex h-full flex-col gap-3">
      {/* Cabeçalho da tela */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red/15 text-red">
            <Activity className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2 text-[14px] font-bold tracking-tight">
              Feed de Vendas
              <span className="flex items-center gap-1 font-mono text-[8.5px] font-semibold uppercase tracking-wider text-red">
                <LiveDot /> Ao vivo
              </span>
            </div>
            <div className="text-[9.5px] text-fg-3">Acompanhe cada venda em tempo real</div>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Volume2 className="h-3 w-3 text-fg-3" />
          <Toggle on />
          <Eye className="h-3 w-3 text-fg-3" />
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[8.5px] text-fg-2">
            <Rolling value={63 + approved + pending - 62} /> eventos
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Kpi label="Vendas Aprovadas" value={<Rolling value={approved} />} tone="text-green" icon={Zap} />
        <Kpi label="Vendas Pendentes" value={<Rolling value={pending} />} tone="text-amber" icon={Clock} />
        <Kpi label="Receita Aprovada" value={<Rolling value={revenue} prefix="R$ " digits={2} />} tone="text-green" icon={DollarSign} />
        <Kpi label="Receita Pendente" value={<Rolling value={pendingRev} prefix="R$ " digits={2} />} tone="text-fg" icon={DollarSign} />
      </div>

      <div className="grid flex-1 gap-3 lg:grid-cols-[1.35fr_1fr]">
        {/* Ritmo de vendas */}
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-card p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <BarChart3 className="h-3 w-3 text-red" /> Ritmo de Vendas Hoje
          </div>
          <HourBars data={hours} height={200} max={14} className="mt-3 flex-1" />
          <div className="mt-2 text-[9px] text-fg-3">
            Total: <span className="font-semibold text-fg">{total}</span> vendas hoje.
          </div>
        </div>

        {/* Últimas vendas — slots fixos, o card nunca muda de tamanho */}
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-card p-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold">
              <Zap className="h-3 w-3 text-amber" /> Últimas Vendas
              <StatusPill tone="purple">
                <Trophy className="h-2 w-2" /> Ouro
              </StatusPill>
            </span>
            <span className="flex items-center gap-1 rounded-md border border-white/10 px-1.5 py-0.5 text-[8.5px] text-fg-2">
              <RefreshCw className="h-2.5 w-2.5" /> Atualizar
            </span>
          </div>
          <TierBar pct={96} />
          <div className="relative mt-2 overflow-hidden" style={{ height: ROW * FEED_SLOTS - 6 }}>
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
                  <FeedRow sale={sale} />
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
  tone,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  tone: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-card p-3">
      <span className={clsx("flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.05]", tone)}>
        <Icon className="h-3 w-3" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[9.5px] text-fg-3">{label}</span>
        <span className={clsx("block whitespace-nowrap text-[14px] font-bold tracking-tight", tone)}>{value}</span>
      </span>
    </div>
  );
}

