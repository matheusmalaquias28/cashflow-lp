"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowDownLeft, ArrowUpRight, Check, CalendarClock, Plus } from "lucide-react";
import { Container, Eyebrow, Reveal, Section, SectionHeader, SplitWords } from "../ui/primitives";
import { Pill, Window, BRL } from "../mock/atoms";

const EASE = [0.16, 1, 0.3, 1] as const;

/* =====================================================================
   1) Faturamento não é caixa — waterfall
   ===================================================================== */

const STEPS = [
  { label: "Faturamento", value: 98762, kind: "start" as const, note: "O que aparece no dashboard de vendas." },
  { label: "Taxas do gateway", value: -7407, kind: "minus" as const, note: "Hotmart, Kiwify, Cakto… cada um cobra o seu." },
  { label: "Impostos", value: -5926, kind: "minus" as const, note: "Simples, ISS, o que for do seu regime." },
  { label: "Meta Ads", value: -41420, kind: "minus" as const, note: "O tráfego que trouxe as vendas." },
  { label: "Despesas", value: -6210, kind: "minus" as const, note: "Ferramentas, fornecedores, taxas bancárias." },
  { label: "Pró-labore", value: -8000, kind: "minus" as const, note: "O que você paga para você." },
  { label: "Caixa real", value: 29799, kind: "end" as const, note: "O que realmente ficou na empresa." },
];

/* Cada coluna é o saldo que restou depois daquela linha — todas ancoradas na
   base. A fatia vermelha no topo de cada coluna é o valor que saiu ali. */
const COLUMNS = (() => {
  let acc = 0;
  return STEPS.map((s) => {
    const before = acc;
    if (s.kind === "start") acc = s.value;
    else if (s.kind === "minus") acc += s.value;
    return { ...s, total: acc, before: s.kind === "minus" ? before : acc, cut: s.kind === "minus" ? -s.value : 0 };
  });
})();

const MAX = STEPS[0].value;

/* No telefone sete colunas ficam ilegíveis; o pró-labore sai do gráfico
   (o caixa real continua descontando ele). */
const hideOnMobile = (label: string) => label === "Pró-labore";

export function Waterfall() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      setStep(i);
      i++;
      if (i >= STEPS.length) clearInterval(t);
    }, 520);
    return () => clearInterval(t);
  }, [inView]);

  const done = step >= STEPS.length - 1;

  return (
    <Section id="financeiro" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-line-2 to-transparent" />
      <Container>
        <SectionHeader
          eyebrow="Financeiro"
          title="Faturamento *não *é *caixa."
          lead="O dinheiro que aparece no dashboard de vendas nem sempre é o dinheiro que chegou na sua conta. Gateways descontam taxas. Existem impostos. Existem despesas. Existe pró-labore. Existe o dinheiro que realmente saiu da empresa."
        />

        <Reveal className="mt-16" amount={0.2}>
          <div ref={ref} className="panel p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Resultado da operação → Caixa</div>
                <div className="text-xs text-fg-3">Agosto · Operação Principal</div>
              </div>
              <div className="flex items-center gap-2">
                <Pill>Faturamento R$ {BRL(STEPS[0].value)}</Pill>
                <Pill tone={done ? "green" : "neutral"}>Caixa real R$ {BRL(COLUMNS[COLUMNS.length - 1].total)}</Pill>
              </div>
            </div>

            <div className="relative mt-4 h-[280px] sm:h-[340px]">
              {[0.25, 0.5, 0.75, 1].map((f) => (
                <div key={f} className="absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${f * 100}%` }} />
              ))}

              <div className="absolute inset-0 grid grid-cols-6 items-end gap-2 sm:grid-cols-7 sm:gap-4">
                {COLUMNS.map((c, i) => {
                  const active = step >= i;
                  const isEnd = c.kind === "end";
                  const isStart = c.kind === "start";
                  // 88% deixa a folga que o rótulo de valor ocupa acima da coluna mais alta.
                  const columnPct = (c.before / MAX) * 88;
                  const cutPct = c.before > 0 ? (c.cut / c.before) * 100 : 0;
                  return (
                    <div key={c.label} className={clsx("relative h-full", hideOnMobile(c.label) && "hidden sm:block")}>
                      {/* Coluna cresce da base para cima */}
                      <motion.div
                        className={clsx(
                          "absolute inset-x-0 bottom-0 overflow-hidden rounded-t-md",
                          isEnd && "bg-green shadow-[0_0_44px_rgba(34,197,94,.45)]",
                          isStart && "bg-white/[0.16]",
                          c.kind === "minus" && "bg-white/[0.09]",
                        )}
                        initial={{ height: 0 }}
                        animate={active ? { height: `${columnPct}%` } : { height: 0 }}
                        transition={{ duration: 0.75, ease: EASE }}
                      >
                        {c.kind === "minus" && (
                          <motion.div
                            className="absolute inset-x-0 top-0 bg-red/45 ring-1 ring-inset ring-red/50"
                            style={{ height: `${cutPct}%` }}
                            initial={{ opacity: 0 }}
                            animate={active ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                          />
                        )}
                      </motion.div>

                      {/* Valor acima da coluna */}
                      <motion.div
                        className={clsx(
                          "absolute inset-x-0 text-center font-mono text-[10px] tabular sm:text-xs",
                          isEnd ? "text-green" : c.kind === "minus" ? "text-red" : "text-fg-2",
                        )}
                        style={{ bottom: `calc(${columnPct}% + 8px)` }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        {c.kind === "minus" ? `−${BRL(c.cut)}` : `R$ ${BRL(c.total)}`}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-7 sm:gap-4">
              {COLUMNS.map((c, i) => (
                <motion.div key={c.label} initial={{ opacity: 0.25 }} animate={step >= i ? { opacity: 1 } : {}} className={clsx("text-center", hideOnMobile(c.label) && "hidden sm:block")}>
                  <div className={clsx("text-[8px] font-semibold leading-tight sm:text-xs", c.kind === "end" && "text-green")}>{c.label}</div>
                  <div className="mt-1 hidden text-[10px] leading-snug text-fg-3 lg:block">{c.note}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="display mx-auto mt-12 max-w-3xl text-center text-2xl text-balance sm:text-3xl">
            Por isso, o Cashflow separa <span className="text-fg-3">resultado da operação</span> de{" "}
            <span className="text-green">movimentação real do caixa.</span>
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

/* =====================================================================
   2) Livro-caixa independente
   ===================================================================== */

const LEDGER = [
  { d: "01/08", l: "Repasse Kiwify · semana 31", v: 8420, cat: "Vendas" },
  { d: "02/08", l: "Meta Ads · fatura", v: -6180, cat: "Tráfego" },
  { d: "03/08", l: "Pró-labore", v: -4000, cat: "Pró-labore" },
  { d: "05/08", l: "Repasse Hotmart", v: 5230, cat: "Vendas" },
  { d: "05/08", l: "Ferramentas (Cashflow, Canva, Make)", v: -487, cat: "Ferramentas" },
  { d: "07/08", l: "Almoço com fornecedor", v: -186, cat: "Alimentação" },
  { d: "08/08", l: "Taxa bancária · PJ", v: -59, cat: "Taxas bancárias" },
  { d: "09/08", l: "Designer freelancer", v: -1200, cat: "Fornecedores" },
  { d: "10/08", l: "Repasse Cakto", v: 3110, cat: "Vendas" },
];

export function Ledger() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setN(i);
      if (i >= LEDGER.length) clearInterval(t);
    }, 380);
    return () => clearInterval(t);
  }, [inView]);

  const shown = LEDGER.slice(0, n);
  const inSum = shown.filter((r) => r.v > 0).reduce((a, r) => a + r.v, 0);
  const outSum = shown.filter((r) => r.v < 0).reduce((a, r) => a + r.v, 0);

  return (
    <Section className="!pt-0">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Reveal>
              <Eyebrow>Caixa independente</Eyebrow>
            </Reveal>
            <SplitWords text="Saiba exatamente para onde seu dinheiro está *indo." className="display mt-5 text-4xl sm:text-5xl" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg text-fg-2">Registre entradas e saídas da empresa em um caixa independente.</p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-3">
                Inclua despesas que não aparecem no dashboard de vendas. No fim do mês, você sabe quanto entrou, quanto saiu e
                quanto realmente sobrou.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Pró-labore", "Alimentação", "Taxas bancárias", "Ferramentas", "Fornecedores", "Outras despesas"].map((t) => (
                  <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-fg-2">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal amount={0.2}>
            <div ref={ref} className="grid gap-3">
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Entradas" value={inSum} tone="green" icon={ArrowDownLeft} />
                <Stat label="Saídas" value={outSum} tone="red" icon={ArrowUpRight} />
                <Stat label="Saldo do mês" value={inSum + outSum} tone="green" accent />
              </div>
              <Window title="Caixa · Agosto">
                <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                  <span className="text-xs text-fg-3">{n} lançamentos</span>
                  <span className="flex items-center gap-1 rounded-full bg-red px-2.5 py-1 text-[11px] font-semibold text-white">
                    <Plus className="h-3 w-3" /> Novo lançamento
                  </span>
                </div>
                <div className="max-h-[300px] overflow-hidden">
                  <AnimatePresence initial={false}>
                    {shown.map((r) => (
                      <motion.div
                        key={r.l}
                        layout
                        initial={{ opacity: 0, x: -14, backgroundColor: "rgba(250,10,21,0.08)" }}
                        animate={{ opacity: 1, x: 0, backgroundColor: "rgba(250,10,21,0)" }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="grid grid-cols-[52px_1fr_auto_auto] items-center gap-3 border-b border-line/60 px-4 py-2.5 text-xs last:border-0"
                      >
                        <span className="font-mono text-[10px] text-fg-3">{r.d}</span>
                        <span className="truncate font-medium">{r.l}</span>
                        <span className="hidden rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-fg-3 sm:inline">{r.cat}</span>
                        <span className={clsx("w-24 text-right font-mono tabular", r.v > 0 ? "text-green" : "text-fg")}>
                          {r.v > 0 ? "+" : "−"}R$ {BRL(Math.abs(r.v))}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Window>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function Stat({
  label,
  value,
  tone,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  tone: "green" | "red" | "white";
  icon?: React.ComponentType<{ className?: string }>;
  accent?: boolean;
}) {
  return (
    <div className={clsx("panel p-3.5 sm:p-4", accent && "border-green/40 bg-green/[0.07]")}>
      <div className="flex items-center gap-1.5 text-[10px] text-fg-3 sm:text-[11px]">
        {Icon && <Icon className={clsx("h-3 w-3", tone === "green" ? "text-green" : "text-red")} />}
        {label}
      </div>
      <div className={clsx("mt-1 font-mono text-sm tabular sm:text-lg", tone === "green" && "text-green", tone === "white" && "text-white")}>
        {value < 0 ? "−" : ""}R$ {BRL(Math.abs(value))}
      </div>
    </div>
  );
}

/* =====================================================================
   3) Compromissos
   ===================================================================== */

const BILLS = [
  { l: "Meta Ads · fatura mensal", due: "Hoje", v: 6180, urgent: true },
  { l: "Contador", due: "Em 2 dias", v: 450 },
  { l: "Pró-labore", due: "Em 5 dias", v: 4000 },
  { l: "Ferramentas", due: "Em 9 dias", v: 487 },
  { l: "DAS · Simples Nacional", due: "Em 14 dias", v: 1298 },
];

export function Commitments() {
  const [paid, setPaid] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setPaid([0]), 1800);
    return () => clearTimeout(t);
  }, [inView]);

  const pending = BILLS.filter((_, i) => !paid.includes(i)).reduce((a, b) => a + b.v, 0);

  return (
    <Section className="!pt-0">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="order-2 lg:order-1" amount={0.2}>
            <div ref={ref}>
              <Window title="Compromissos">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <div className="flex items-center gap-2 text-xs">
                    <CalendarClock className="h-3.5 w-3.5 text-red" />
                    <span className="text-fg-2">A pagar nos próximos 15 dias</span>
                  </div>
                  <span className="font-mono text-sm tabular">R$ {BRL(pending)}</span>
                </div>
                <div>
                  {BILLS.map((b, i) => {
                    const done = paid.includes(i);
                    return (
                      <button
                        key={b.l}
                        onClick={() => setPaid((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))}
                        className="group flex w-full items-center gap-3 border-b border-line/60 px-5 py-3.5 text-left transition-colors last:border-0 hover:bg-white/[0.02]"
                      >
                        <span
                          className={clsx(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-300",
                            done ? "border-red bg-red" : "border-line-2 group-hover:border-fg-3",
                          )}
                        >
                          <AnimatePresence>
                            {done && (
                              <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                                <Check className="h-3 w-3 text-white" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={clsx("block truncate text-sm font-medium transition-colors", done && "text-fg-3 line-through")}>{b.l}</span>
                          <span className={clsx("text-[11px]", done ? "text-fg-3" : b.urgent ? "text-red" : "text-fg-3")}>
                            {done ? "Pago" : b.due}
                          </span>
                        </span>
                        <span className={clsx("font-mono text-sm tabular", done && "text-fg-3")}>R$ {BRL(b.v)}</span>
                      </button>
                    );
                  })}
                </div>
              </Window>
              <p className="mt-3 text-center text-xs text-fg-3">Clique para marcar como pago.</p>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <Eyebrow>Compromissos</Eyebrow>
            </Reveal>
            <SplitWords text="Não perca seus compromissos no meio da *operação." className="display mt-5 text-4xl sm:text-5xl" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg text-fg-2">
                Centralize seus compromissos financeiros e tenha uma visão do que ainda precisa ser pago.
              </p>
              <p className="display mt-8 text-2xl text-fg-3">
                Menos controle espalhado. <span className="text-fg">Mais previsibilidade.</span>
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
