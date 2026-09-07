"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Check, ArrowUpDown, Percent, Receipt, RotateCcw, Zap, Plus, Landmark } from "lucide-react";
import { Container, Eyebrow, Reveal, Section, SplitWords } from "../ui/primitives";
import { AreaChart, Pill, PlatformDot, Window, BRL } from "../mock/atoms";
import { OFFER } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/* =====================================================================
   1) Todas as ofertas em uma visão — filtros clicáveis
   ===================================================================== */

type Period = "7d" | "30d" | "90d";
const PERIODS: { id: Period; label: string }[] = [
  { id: "7d", label: "7 dias" },
  { id: "30d", label: "30 dias" },
  { id: "90d", label: "90 dias" },
];

const OFFERS = [
  { name: OFFER.desafio.name, platform: "Kiwify", base: { lucro: 12180, receita: 38500, inv: 11400, vendas: 819, ticket: 47 } },
  { name: OFFER.violao.name, platform: "Hotmart", base: { lucro: 7640, receita: 42800, inv: 18200, vendas: 441, ticket: 97 } },
  { name: OFFER.rotina.name, platform: "Cakto", base: { lucro: 5310, receita: 21940, inv: 7540, vendas: 593, ticket: 37 } },
  { name: OFFER.churrasco.name, platform: "Kirvano", base: { lucro: -420, receita: 9450, inv: 6650, vendas: 350, ticket: 27 } },
  { name: OFFER.planner.name, platform: "Ticto", base: { lucro: 3120, receita: 12690, inv: 5480, vendas: 270, ticket: 47 } },
];
const FACTOR: Record<Period, number> = { "7d": 0.24, "30d": 1, "90d": 2.85 };

export function OffersOverview() {
  const [period, setPeriod] = useState<Period>("30d");
  const [sort, setSort] = useState<"lucro" | "receita">("lucro");
  const f = FACTOR[period];

  const rows = useMemo(() => {
    const r = OFFERS.map((o) => {
      const receita = o.base.receita * f;
      const inv = o.base.inv * f;
      const lucro = o.base.lucro * f;
      return {
        ...o,
        receita,
        inv,
        lucro,
        roas: receita / inv,
        margem: (lucro / receita) * 100,
        vendas: Math.round(o.base.vendas * f),
      };
    });
    return r.sort((a, b) => b[sort] - a[sort]);
  }, [f, sort]);

  const totals = rows.reduce(
    (acc, r) => ({ lucro: acc.lucro + r.lucro, receita: acc.receita + r.receita, inv: acc.inv + r.inv, vendas: acc.vendas + r.vendas }),
    { lucro: 0, receita: 0, inv: 0, vendas: 0 },
  );

  return (
    <Section className="!pt-0">
      <Container>
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
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
                {["Lucro", "Receita", "Investimento", "ROAS", "Margem", "Vendas", "Ticket médio"].map((t) => (
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
                Experimente: troque o período e a ordenação ao lado.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} amount={0.2}>
            <Window title="cashflow.app / ofertas">
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex rounded-full border border-line bg-white/[0.02] p-1">
                    {PERIODS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPeriod(p.id)}
                        className={clsx(
                          "relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                          period === p.id ? "text-white" : "text-fg-3 hover:text-fg-2",
                        )}
                      >
                        {period === p.id && (
                          <motion.span
                            layoutId="period-pill"
                            className="absolute inset-0 rounded-full bg-red"
                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                          />
                        )}
                        <span className="relative">{p.label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSort((s) => (s === "lucro" ? "receita" : "lucro"))}
                    className="flex items-center gap-1.5 rounded-full border border-line bg-white/[0.02] px-3 py-1.5 text-xs text-fg-2 transition-colors hover:bg-white/[0.05]"
                  >
                    <ArrowUpDown className="h-3 w-3" />
                    Ordenar por <span className="font-semibold text-fg">{sort === "lucro" ? "Lucro" : "Receita"}</span>
                  </button>
                </div>

                {/* Totals */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { l: "Lucro", v: totals.lucro, p: "R$ ", accent: true },
                    { l: "Receita", v: totals.receita, p: "R$ " },
                    { l: "Investimento", v: totals.inv, p: "R$ " },
                    { l: "Vendas", v: totals.vendas, p: "" },
                  ].map((k) => (
                    <div key={k.l} className={clsx("rounded-lg border p-3", k.accent ? "border-green/40 bg-green/[0.07]" : "border-line bg-white/[0.02]")}>
                      <div className="text-[10px] text-fg-3">{k.l}</div>
                      <div className={clsx("mt-0.5 text-base font-bold tracking-tight sm:text-lg", k.accent && "text-green")}>
                        <AnimatedNumber value={k.v} prefix={k.p} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table */}
                <div className="mt-4 overflow-x-auto">
                  <div className="min-w-[520px]">
                    <div className="grid grid-cols-[1.8fr_1fr_1fr_.7fr_.8fr_.7fr] gap-2 border-b border-line pb-2 font-mono text-[9px] uppercase tracking-wider text-fg-3">
                      <span>Oferta</span>
                      <span className="text-right">Lucro</span>
                      <span className="text-right">Receita</span>
                      <span className="text-right">ROAS</span>
                      <span className="text-right">Margem</span>
                      <span className="text-right">Vendas</span>
                    </div>
                    <motion.div layout className="divide-y divide-line/60">
                      <AnimatePresence initial={false}>
                        {rows.map((r) => (
                          <motion.div
                            key={r.name}
                            layout
                            transition={{ type: "spring", stiffness: 350, damping: 32 }}
                            className="grid grid-cols-[1.8fr_1fr_1fr_.7fr_.8fr_.7fr] items-center gap-2 py-2.5 text-xs"
                          >
                            <span className="flex items-center gap-2 font-medium">
                              <PlatformDot name={r.platform} />
                              <span className="truncate">{r.name}</span>
                            </span>
                            <span className={clsx("text-right font-mono tabular", r.lucro < 0 ? "text-red" : "text-green")}>
                              <AnimatedNumber value={r.lucro} prefix="R$ " />
                            </span>
                            <span className="text-right font-mono tabular"><AnimatedNumber value={r.receita} prefix="R$ " /></span>
                            <span className="text-right font-mono tabular text-fg-2">{r.roas.toFixed(2).replace(".", ",")}</span>
                            <span className={clsx("text-right font-mono tabular", r.margem < 0 ? "text-red" : r.margem > 25 ? "text-green" : "text-fg-2")}>
                              {r.margem.toFixed(1).replace(".", ",")}%
                            </span>
                            <span className="text-right font-mono tabular text-fg-2"><AnimatedNumber value={r.vendas} /></span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
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
   3) Seu Meta Ads dentro da operação
   ===================================================================== */

const CAMPAIGNS = [
  { n: `CBO · ${OFFER.desafio.short} · Interesses amplos`, spend: 4820, clicks: 9120, conv: 412, on: true },
  { n: `CBO · ${OFFER.desafio.short} · LAL compradores 1%`, spend: 3140, clicks: 5230, conv: 236, on: true },
  { n: `ABO · ${OFFER.violao.short} · Retarget 7d`, spend: 1980, clicks: 2810, conv: 141, on: true },
  { n: `CBO · ${OFFER.rotina.short} · Aberto BR`, spend: 1460, clicks: 3120, conv: 88, on: false },
];

export function MetaAds() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setActive((a) => (a + 1) % CAMPAIGNS.length), 2600);
    return () => clearInterval(t);
  }, [inView]);

  const c = CAMPAIGNS[active];
  const spendSeries = [3, 4, 4, 6, 5, 7, 8, 7, 9, 10, 9, 12].map((v) => v * (1 + active * 0.15));
  const convSeries = [1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 8].map((v) => v * (1 + active * 0.1));

  return (
    <Section className="!pt-0">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
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

          <Reveal amount={0.2}>
            <div ref={ref} className="grid gap-3 sm:grid-cols-[1fr_1.1fr]">
              <Window title="Campanhas" className="sm:row-span-2">
                <div className="divide-y divide-line">
                  {CAMPAIGNS.map((cp, i) => (
                    <button
                      key={cp.n}
                      onClick={() => setActive(i)}
                      className={clsx(
                        "relative flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors",
                        active === i ? "bg-white/[0.04]" : "hover:bg-white/[0.02]",
                      )}
                    >
                      {active === i && (
                        <motion.span layoutId="camp-bar" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-red" />
                      )}
                      <span className={clsx("mt-1 h-2 w-2 shrink-0 rounded-full", cp.on ? "bg-green" : "bg-white/20")} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-medium">{cp.n}</span>
                        <span className="mt-1 flex gap-3 font-mono text-[10px] tabular text-fg-3">
                          <span>R$ {BRL(cp.spend)}</span>
                          <span>{BRL(cp.clicks)} cliques</span>
                          <span className="text-fg-2">{cp.conv} conv.</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </Window>

              <div className="panel p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold">Investimento × Conversões</div>
                  <Pill>14 dias</Pill>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <AreaChart id={`meta-${active}`} data={convSeries} data2={spendSeries} width={320} height={120} color="#FA0A15" color2="#0866FF" className="mt-3" showGrid={false} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { l: "CPA", v: c.spend / c.conv, p: "R$ ", d: 2 },
                  { l: "CTR", v: (c.clicks / (c.clicks * 18)) * 100, s: "%", d: 2 },
                  { l: "ROAS", v: (c.conv * 47) / c.spend, d: 2 },
                ].map((k) => (
                  <div key={k.l} className="panel p-3">
                    <div className="text-[10px] text-fg-3">{k.l}</div>
                    <div className="mt-0.5 font-mono text-sm tabular">
                      {k.p}
                      {BRL(k.v, k.d)}
                      {k.s}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

