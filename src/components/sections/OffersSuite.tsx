"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Check, Percent, Receipt, RotateCcw, Zap, Plus, Landmark, Search, Filter, LayoutGrid, List, ChevronUp, HelpCircle, Building2, Megaphone, Layers, Image as ImageIcon, History, Pencil } from "lucide-react";
import { Container, Eyebrow, Reveal, Section, SplitWords } from "../ui/primitives";
import { PlatformDot, Window, BRL } from "../mock/atoms";
import { FilterChip, Label, Money, OfferCard, PBtn, SelectBox, Toggle, type OfferStat } from "../mock/product";
import { OFFER } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/* =====================================================================
   1) Todas as ofertas em uma visão — filtros clicáveis
   ===================================================================== */

type Period = "Hoje" | "Últimos 7 dias" | "Últimos 30 dias";
const PERIODS: Period[] = ["Hoje", "Últimos 7 dias", "Últimos 30 dias"];
const FACTOR: Record<Period, number> = { Hoje: 1, "Últimos 7 dias": 5.6, "Últimos 30 dias": 21.4 };

type Sort = "Maior Lucro" | "Maior Faturamento" | "Maior ROAS";
const SORTS: Sort[] = ["Maior Lucro", "Maior Faturamento", "Maior ROAS"];

const OFFERS: (OfferStat & { platform: string })[] = [
  { name: OFFER.desafio.name, platform: "Kiwify", lucro: 489.6, faturamento: 512.4, gasto: 0, roas: null, margem: 96, status: "ativa", pixel: false, bump: true },
  { name: OFFER.violao.name, sub: `${OFFER.violao.name} + Songbook Bônus`, platform: "Hotmart", lucro: 356.25, faturamento: 575.74, gasto: 112.9, roas: 5.1, margem: 62, status: "ativa", pixel: true, dupla: true },
  { name: OFFER.rotina.name, platform: "Cakto", lucro: 66.3, faturamento: 66.3, gasto: 0, roas: null, margem: 100, status: "ativa", pixel: false, bump: true },
  { name: OFFER.churrasco.name, platform: "Kirvano", lucro: -18.4, faturamento: 51.3, gasto: 69.7, roas: 0.74, margem: -36, status: "ativa", pixel: true },
];

export function OffersOverview() {
  const [period, setPeriod] = useState<Period>("Hoje");
  const [sort, setSort] = useState<Sort>("Maior Lucro");
  const f = FACTOR[period];

  const rows = useMemo(() => {
    const r = OFFERS.map((o) => ({
      ...o,
      lucro: o.lucro * f,
      faturamento: o.faturamento * f,
      gasto: o.gasto * f,
    }));
    const key = sort === "Maior Lucro" ? "lucro" : sort === "Maior Faturamento" ? "faturamento" : "roas";
    return r.sort((a, b) => (b[key] ?? -1) - (a[key] ?? -1));
  }, [f, sort]);

  const pos = rows.filter((r) => r.lucro > 0).length;
  const neg = rows.length - pos;

  return (
    <Section className="!pt-0">
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <Eyebrow>Visão de ofertas</Eyebrow>
            </Reveal>
            <SplitWords text="Todas as suas ofertas em *uma *visão." className="display mt-5 text-4xl sm:text-5xl lg:text-6xl" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg text-fg-2">
                Cadastre suas operações e acompanhe cada oferta individualmente. Filtre por período, compare resultados e
                identifique quais ofertas merecem mais investimento.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Lucro", "Faturamento", "Gasto c/ anúncio", "ROAS", "Margem", "Vendas", "Ticket médio"].map((t) => (
                  <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-fg-2">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 flex items-center gap-2 text-sm text-fg-3">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red/15 text-red">
                  <Zap className="h-3 w-3" />
                </span>
                Experimente: troque o período e a ordenação.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} amount={0.2} className="min-w-0">
            <Window title="cashflow.app / gestão de ofertas">
              <div className="bg-app p-4 sm:p-5">
                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[17px] font-bold tracking-tight">Gestão de Ofertas</div>
                    <div className="mt-0.5 text-[10.5px] text-fg-3">Cada oferta é uma unidade de negócio. Acompanhe o resultado de cada uma e do portfólio.</div>
                  </div>
                  <div className="hidden shrink-0 items-center gap-2 sm:flex">
                    <PBtn tone="ghost" icon={HelpCircle}>Como as sugestões funcionam</PBtn>
                    <PBtn tone="red" icon={Plus}>Nova oferta</PBtn>
                  </div>
                </div>

                {/* Positivas / negativas */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-green/25 bg-[#0f1a12]/70 p-4">
                    <Label className="text-green">● Ofertas positivas</Label>
                    <div className="mt-2 flex items-end justify-between">
                      <span className="text-3xl font-bold leading-none text-green">
                        {pos} <span className="text-xs font-normal text-fg-2">de {rows.length}</span>
                      </span>
                      <span className="text-lg font-semibold text-green">{((pos / rows.length) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                      <motion.div className="h-full bg-green" animate={{ width: `${(pos / rows.length) * 100}%` }} transition={{ duration: 0.8, ease: EASE }} />
                    </div>
                  </div>
                  <div className="rounded-xl border border-red/25 bg-[#1a0f10]/70 p-4">
                    <Label className="text-red">● Ofertas negativas</Label>
                    <div className="mt-2 flex items-end justify-between">
                      <span className="text-3xl font-bold leading-none text-red">
                        {neg} <span className="text-xs font-normal text-fg-2">de {rows.length}</span>
                      </span>
                      <span className="text-lg font-semibold text-red">{((neg / rows.length) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.08]">
                      <motion.div className="h-full bg-red/70" animate={{ width: `${(neg / rows.length) * 100}%` }} transition={{ duration: 0.8, ease: EASE }} />
                    </div>
                  </div>
                </div>

                {/* Filtros */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <FilterChip count={rows.length}>Todas</FilterChip>
                  <FilterChip active count={rows.length}>Ativa</FilterChip>
                  <FilterChip count={0}>Em pausa</FilterChip>
                  <FilterChip count={0}>Sem status</FilterChip>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <div className="flex h-8 min-w-[160px] flex-1 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0d0d0d] px-2.5 text-[10.5px] text-fg-3">
                    <Search className="h-3 w-3" /> Buscar oferta pelo nome…
                  </div>
                  <Filter className="hidden h-3 w-3 text-fg-3 sm:block" />
                  <button
                    onClick={() => setPeriod((p) => PERIODS[(PERIODS.indexOf(p) + 1) % PERIODS.length])}
                    className="rounded-lg outline-none ring-red/40 transition hover:brightness-125 focus-visible:ring-2"
                    aria-label="Trocar período"
                  >
                    <SelectBox className="w-[140px]">{period}</SelectBox>
                  </button>
                  <button
                    onClick={() => setSort((x) => SORTS[(SORTS.indexOf(x) + 1) % SORTS.length])}
                    className="rounded-lg outline-none ring-red/40 transition hover:brightness-125 focus-visible:ring-2"
                    aria-label="Trocar ordenação"
                  >
                    <SelectBox className="w-[160px]">{sort}</SelectBox>
                  </button>
                  <span className="hidden items-center overflow-hidden rounded-lg border border-white/[0.08] text-[10px] sm:flex">
                    <span className="flex items-center gap-1 bg-white/[0.08] px-2 py-1.5 font-medium"><LayoutGrid className="h-3 w-3" /> Cards</span>
                    <span className="flex items-center gap-1 px-2 py-1.5 text-fg-3"><List className="h-3 w-3" /> Lista</span>
                  </span>
                  <PBtn tone="ghost" icon={ChevronUp} className="hidden sm:inline-flex">Recolher ofertas</PBtn>
                </div>

                {/* Cards de oferta — reordenam ao trocar a ordenação */}
                <motion.div layout className="mt-4 grid gap-3 sm:grid-cols-2">
                  <AnimatePresence initial={false}>
                    {rows.map((o) => (
                      <motion.div key={o.name} layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                        <OfferCard o={o} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </Window>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/** Tweened number that re-animates on value change */
function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    const start = performance.now();
    const dur = 700;
    let raf = 0;
    const loop = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      setDisplay(from + (to - from) * e);
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const neg = display < 0;
  return (
    <span className="tabular">
      {neg ? "−" : ""}
      {prefix}
      {BRL(Math.abs(display))}
    </span>
  );
}

/* =====================================================================
   2) Configure sua oferta — formulário que se preenche sozinho
   ===================================================================== */

const FIELDS = [
  { icon: PlatformDotIcon(), label: "Conta Meta Ads", value: `${OFFER.desafio.short} BR · act_…91`, kind: "text" },
  { icon: Percent, label: "Impostos", value: "6,0%", kind: "text", num: 0.06 },
  { icon: Receipt, label: "Ticket médio", value: "R$ 47,00", kind: "text" },
  { icon: RotateCcw, label: "Reembolsos", value: "3,2%", kind: "text", num: 0.032 },
  { icon: Plus, label: "Order bump", value: "R$ 19,90 · 28% take", kind: "text" },
  { icon: Landmark, label: "Recuperação de Pix", value: "Ativa · 41%", kind: "toggle" },
] as const;

function PlatformDotIcon() {
  return function Icon({ className }: { className?: string }) {
    return <span className={clsx("inline-block rounded-full", className)} style={{ background: "#0866FF", width: 10, height: 10 }} aria-hidden />;
  };
}

export function OfferConfig() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setFilled(i);
      if (i >= FIELDS.length) clearInterval(t);
    }, 650);
    return () => clearInterval(t);
  }, [inView]);

  // Profit projection reacts to filled fields
  const projection = useMemo(() => {
    const gross = 38500;
    let net = gross - 11400; // minus ads
    if (filled >= 2) net -= gross * 0.06;
    if (filled >= 4) net -= gross * 0.032;
    if (filled >= 5) net += 819 * 0.28 * 19.9;
    if (filled >= 6) net += 1860;
    return Math.round(net);
  }, [filled]);

  return (
    <Section className="!pt-0">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="order-2 lg:order-1" amount={0.2}>
            <div ref={ref} className="grid gap-4 sm:grid-cols-[1.3fr_1fr]">
              <Window title="Configurar oferta">
                <div className="divide-y divide-line">
                  {FIELDS.map((f, i) => {
                    const Icon = f.icon;
                    const on = filled > i;
                    return (
                      <div key={f.label} className="flex items-center gap-3 px-4 py-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-white/[0.02] text-fg-2">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="w-32 shrink-0 text-xs text-fg-2">{f.label}</span>
                        <div className="relative flex h-8 flex-1 items-center rounded-md border border-line bg-bg/60 px-2.5 font-mono text-xs">
                          <AnimatePresence mode="wait">
                            {on ? (
                              <motion.span
                                key="v"
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="truncate text-fg"
                              >
                                {f.kind === "toggle" ? (
                                  <span className="flex items-center gap-2">
                                    <span className="relative inline-flex h-4 w-7 items-center rounded-full bg-red">
                                      <motion.span layout className="absolute right-0.5 h-3 w-3 rounded-full bg-white" />
                                    </span>
                                    {f.value}
                                  </span>
                                ) : (
                                  f.value
                                )}
                              </motion.span>
                            ) : (
                              <motion.span key="p" exit={{ opacity: 0 }} className="text-fg-3">
                                —
                              </motion.span>
                            )}
                          </AnimatePresence>
                          {on && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-2 flex h-4 w-4 items-center justify-center rounded-full bg-green/20 text-green"
                            >
                              <Check className="h-2.5 w-2.5" />
                            </motion.span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Window>

              <div className="panel flex flex-col justify-between p-5">
                <div>
                  <div className="text-[11px] text-fg-3">Lucro projetado · 30 dias</div>
                  <div className="mt-1 text-3xl font-bold tracking-tight text-green">
                    <AnimatedNumber value={projection} prefix="R$ " />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-fg-3">
                    <span className={clsx("h-1.5 w-1.5 rounded-full", filled >= FIELDS.length ? "bg-green" : "bg-red animate-pulse")} />
                    {filled >= FIELDS.length ? "Análise próxima da realidade" : `Refinando… ${filled}/${FIELDS.length}`}
                  </div>
                </div>
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-[10px] text-fg-3">
                    <span>Precisão</span>
                    <span className="font-mono tabular text-fg">{Math.round((filled / FIELDS.length) * 100)}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className="h-full bg-green"
                      animate={{ width: `${(filled / FIELDS.length) * 100}%` }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-md border border-line bg-white/[0.02] p-2.5">
                      <div className="text-fg-3">Margem</div>
                      <div className="mt-0.5 font-mono tabular">{((projection / 38500) * 100).toFixed(1).replace(".", ",")}%</div>
                    </div>
                    <div className="rounded-md border border-line bg-white/[0.02] p-2.5">
                      <div className="text-fg-3">Lucro/venda</div>
                      <div className="mt-0.5 font-mono tabular text-green">R$ {BRL(projection / 819, 2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <Eyebrow>Configuração da oferta</Eyebrow>
            </Reveal>
            <SplitWords
              text="Sua oferta tem mais números do que você consegue *acompanhar?"
              className="display mt-5 text-4xl sm:text-5xl"
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg text-fg-2">Centralize as informações que impactam diretamente o resultado.</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-3">
                Configure Meta Ads, impostos, ticket médio, reembolsos, order bumps, recuperação de Pix e outros dados da
                oferta. O Cashflow usa essas informações para deixar sua análise muito mais próxima da realidade da operação.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* =====================================================================
   3) Seu Meta Ads dentro da operação — aba Meta com a tabela de campanhas
   ===================================================================== */

type Campaign = {
  n: string;
  on: boolean;
  budget: string;
  spend: number;
  rev: number;
  roas: number;
  sales: number;
  cpa: number | null;
  cpm: number | null;
  imp: number;
  clicks: number;
};

const CAMPAIGNS: Campaign[] = [
  { n: `[${OFFER.violao.short.toLowerCase()}] - [teste de criativo] - [ABO 1-3-1] - [AD01] - [29/08]`, on: true, budget: "nos conjuntos", spend: 61.29, rev: 65.21, roas: 1.06, sales: 3, cpa: 30.65, cpm: 63.51, imp: 965, clicks: 57 },
  { n: `[${OFFER.violao.short.toLowerCase()}] - [teste de escala] - [CBO 1-3-1] - [AD01] - [01/09]`, on: true, budget: "R$ 75,50", spend: 52.24, rev: 180.12, roas: 3.45, sales: 10, cpa: 13.06, cpm: 67.06, imp: 779, clicks: 42 },
  { n: `[${OFFER.violao.short.toLowerCase()}] - [teste de escala] - [CBO 1-3-1] - [AD02] - [01/09]`, on: false, budget: "R$ 45,50", spend: 0, rev: 0, roas: 0, sales: 0, cpa: null, cpm: null, imp: 0, clicks: 0 },
  { n: `[${OFFER.violao.short.toLowerCase()}] - [teste de criativo] - [ABO 1-3-1] - [AD03] - [29/08]`, on: false, budget: "nos conjuntos", spend: 0, rev: 0, roas: 0, sales: 0, cpa: null, cpm: null, imp: 0, clicks: 0 },
];


export function MetaAds() {
  const [toggles, setToggles] = useState(() => CAMPAIGNS.map((c) => c.on));
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  // Ao vivo: uma campanha pausada liga e outra pausa, de tempos em tempos.
  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => {
      setToggles((tg) => {
        const next = [...tg];
        const i = 2 + Math.floor(Math.random() * 2);
        next[i] = !next[i];
        return next;
      });
    }, 3200);
    return () => clearInterval(t);
  }, [inView]);

  const totals = CAMPAIGNS.reduce(
    (a, c) => ({ spend: a.spend + c.spend, rev: a.rev + c.rev, sales: a.sales + c.sales, imp: a.imp + c.imp, clicks: a.clicks + c.clicks }),
    { spend: 0, rev: 0, sales: 0, imp: 0, clicks: 0 },
  );

  const cell = (v: number | null, fmt: (n: number) => string, tone?: string) =>
    v === null ? <span className="text-fg-3">N/A</span> : <span className={tone}>{fmt(v)}</span>;

  return (
    <Section className="!pt-0">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Reveal>
              <Eyebrow>
                <PlatformDot name="Meta Ads" className="mr-1" /> Tráfego integrado
              </Eyebrow>
            </Reveal>
            <SplitWords text="Seu Meta Ads *dentro da operação." className="display mt-5 text-4xl sm:text-5xl lg:text-6xl" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg text-fg-2">
                Não precisa ficar alternando entre abas para entender o desempenho do tráfego.
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-3">
                Acompanhe suas campanhas e investimentos diretamente no Cashflow e conecte o tráfego aos resultados de cada
                oferta.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Campanhas", "Investimento", "Cliques", "Conversões", "Métricas de tráfego"].map((t) => (
                  <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-fg-2">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal amount={0.2} className="min-w-0">
            <div ref={ref}>
              <Window title="cashflow.app / tráfego">
                <div className="bg-app p-4 sm:p-5">
                  {/* Abas da tela de tráfego */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-white/[0.06] bg-card px-4 py-2.5 text-[11px]">
                    {["Resumo", "Meta", "Pixel", "Vincular Campanhas", "Relatório"].map((t) => (
                      <span key={t} className={clsx("font-medium", t === "Meta" ? "text-red" : "text-fg-2")}>
                        {t}
                      </span>
                    ))}
                    <span className="ml-auto flex items-center gap-2">
                      <Filter className="h-3 w-3 text-fg-3" />
                      <SelectBox className="h-7 w-[110px] text-[10px]">Hoje</SelectBox>
                    </span>
                  </div>

                  {/* Sub-abas */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-card p-1 text-[10px]">
                      {[
                        { i: Building2, l: "Contas" },
                        { i: Megaphone, l: "Campanhas", n: 4, on: true },
                        { i: Layers, l: "Conjuntos" },
                        { i: ImageIcon, l: "Anúncios" },
                      ].map(({ i: I, l, n, on }) => (
                        <span key={l} className={clsx("flex items-center gap-1.5 rounded-md px-2.5 py-1.5", on ? "border border-red/40 text-red" : "text-fg-2")}>
                          <I className="h-3 w-3" /> {l}
                          {n && <span className="font-mono text-[9px]">{n}</span>}
                        </span>
                      ))}
                    </span>
                    <span className="hidden h-8 min-w-[150px] flex-1 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0d0d0d] px-2.5 text-[10px] text-fg-3 sm:flex">
                      <Search className="h-3 w-3" /> Filtrar por nome
                    </span>
                    <PBtn tone="ghost" size="sm" icon={History} className="hidden sm:inline-flex">Histórico do dia</PBtn>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <FilterChip active>Todos</FilterChip>
                    <FilterChip>Ativos</FilterChip>
                    <FilterChip>Pausados</FilterChip>
                    <FilterChip>Filtrar selecionados</FilterChip>
                  </div>

                  {/* Tabela — rola na horizontal dentro do próprio card */}
                  <div className="mt-3 overflow-x-auto rounded-xl border border-white/[0.06]">
                    <table className="w-full min-w-[960px] border-collapse whitespace-nowrap text-[10px]">
                      <thead>
                        <tr className="bg-card text-left font-mono text-[8px] uppercase tracking-wider text-fg-3">
                          <th className="w-6 px-2 py-2.5"><span className="block h-3 w-3 rounded-sm border border-white/20" /></th>
                          <th className="px-2 py-2.5 font-medium">Campanha</th>
                          <th className="px-2 py-2.5 font-medium">Veiculação</th>
                          <th className="px-2 py-2.5 font-medium">Orçamento</th>
                          <th className="px-2 py-2.5 text-right font-semibold text-fg-2">Gastos</th>
                          <th className="px-2 py-2.5 text-right font-medium">Receita</th>
                          <th className="px-2 py-2.5 text-right font-medium">Lucro</th>
                          <th className="px-2 py-2.5 text-right font-medium">ROAS</th>
                          <th className="px-2 py-2.5 text-right font-medium">Vendas</th>
                          <th className="px-2 py-2.5 text-right font-medium">CPA</th>
                          <th className="px-2 py-2.5 text-right font-medium">CPM</th>
                          <th className="px-2 py-2.5 text-right font-medium">Impressões</th>
                          <th className="px-2 py-2.5 text-right font-medium">Cliques</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CAMPAIGNS.map((c, i) => {
                          const on = toggles[i];
                          const profit = c.rev - c.spend;
                          return (
                            <tr key={c.n} className="border-t border-white/[0.05]">
                              <td className="px-2 py-2.5"><span className="block h-3 w-3 rounded-sm border border-white/20" /></td>
                              <td className="w-[200px] min-w-[200px] px-2 py-2.5">
                                <span className="flex items-start gap-1">
                                  <span className="line-clamp-2 whitespace-normal font-medium leading-snug">{c.n}</span>
                                  <Pencil className="mt-0.5 h-2.5 w-2.5 shrink-0 text-fg-3" />
                                </span>
                              </td>
                              <td className="px-2 py-2.5"><Toggle on={on} /></td>
                              <td className="px-2 py-2.5 text-fg-3">
                                {c.budget}
                                {c.budget.startsWith("R$") && <span className="block text-[8px]">Diário</span>}
                              </td>
                              <td className="px-2 py-2.5 text-right font-semibold tabular"><Money v={c.spend} /></td>
                              <td className="px-2 py-2.5 text-right tabular underline decoration-white/20 underline-offset-2"><Money v={c.rev} /></td>
                              <td className={clsx("px-2 py-2.5 text-right font-semibold tabular", profit > 0 ? "text-green" : profit < 0 ? "text-red" : "")}>
                                {c.spend === 0 && c.rev === 0 ? "R$ 0,00" : <Money v={profit} />}
                              </td>
                              <td className={clsx("px-2 py-2.5 text-right font-semibold tabular", c.roas === 0 ? "text-red" : c.roas < 1.5 ? "bg-red/25 text-red" : "bg-green/20 text-green")}>
                                {c.roas.toFixed(2)}
                              </td>
                              <td className="px-2 py-2.5 text-right tabular underline decoration-white/20 underline-offset-2">{c.sales}</td>
                              <td className="px-2 py-2.5 text-right tabular">{cell(c.cpa, (n) => `R$ ${BRL(n, 2)}`)}</td>
                              <td className={clsx("px-2 py-2.5 text-right tabular", c.cpm !== null && c.cpm > 60 && "bg-red/25")}>{cell(c.cpm, (n) => `R$ ${BRL(n, 2)}`)}</td>
                              <td className="px-2 py-2.5 text-right tabular">{BRL(c.imp)}</td>
                              <td className="px-2 py-2.5 text-right tabular">{c.clicks}</td>
                            </tr>
                          );
                        })}
                        <tr className="border-t border-white/[0.08] bg-card font-semibold">
                          <td className="px-2 py-2.5" />
                          <td className="px-2 py-2.5">{CAMPAIGNS.length} itens</td>
                          <td className="px-2 py-2.5 text-fg-3">N/A</td>
                          <td className="px-2 py-2.5 tabular">R$ 121,00</td>
                          <td className="px-2 py-2.5 text-right tabular"><Money v={totals.spend} /></td>
                          <td className="px-2 py-2.5 text-right tabular"><Money v={totals.rev} /></td>
                          <td className="px-2 py-2.5 text-right tabular text-green"><Money v={totals.rev - totals.spend} /></td>
                          <td className="px-2 py-2.5 text-right tabular">{(totals.rev / totals.spend).toFixed(2)}</td>
                          <td className="px-2 py-2.5 text-right tabular">{totals.sales}</td>
                          <td className="px-2 py-2.5 text-right tabular">R$ {BRL(totals.spend / totals.sales, 2)}</td>
                          <td className="px-2 py-2.5 text-right tabular">R$ {BRL((totals.spend / totals.imp) * 1000, 2)}</td>
                          <td className="px-2 py-2.5 text-right tabular">{BRL(totals.imp)}</td>
                          <td className="px-2 py-2.5 text-right tabular">{totals.clicks}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Window>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
