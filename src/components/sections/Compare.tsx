"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowLeftRight, BarChart3, GitCompare, Trophy, Bookmark } from "lucide-react";
import { Container, Reveal, Section, SectionHeader } from "../ui/primitives";
import { Window } from "../mock/atoms";
import { Label, Money, PBtn, SelectBox, StatusPill } from "../mock/product";
import { OFFER } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Dados fictícios — a oferta A fatura mais e também lucra mais; a diferença vem
   quase toda do faturamento. */
const A = { name: OFFER.desafio.name, initials: "DD", lucro: 466.9, fat: 514.98, ads: 45.5, roas: 11.32, cor: "#3b82f6" };
const B = { name: OFFER.churrasco.name, initials: "MC", lucro: 55.24, fat: 120.5, ads: 60.82, roas: 1.98, cor: "#ffa726" };

const DIFF = [
  { l: "Faturamento", v: A.fat - B.fat },
  { l: "Investimento", v: B.ads - A.ads },
  { l: "Custos e impostos", v: 1.86 },
];
const DIFF_MAX = Math.max(...DIFF.map((d) => Math.abs(d.v)));
const PCT = ((A.lucro - B.lucro) / B.lucro) * 100;

export function Compare() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [step, setStep] = useState(-1);

  // 0: cards | 1: vencedor | 2: resumo | 3..5: barras | 6: resultado
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      setStep(i);
      i++;
      if (i > 6) clearInterval(t);
    }, 600);
    return () => clearInterval(t);
  }, [inView]);

  const done = step >= 6;

  return (
    <Section>
      <Container>
        <SectionHeader
          title="No jogo real, você é obrigado a olhar além do *“Gerenciador *de *Anúncios”"
          lead="Conheça as funcionalidades da Cashflow para acompanhar cada venda, separar o resultado das ofertas e controlar o dinheiro que entra e sai da operação."
        />

        <Reveal className="mx-auto mt-16 max-w-5xl min-[1921px]:max-w-[1400px]" amount={0.2}>
          <div ref={ref}>
            <Window title="cashflow.app / comparação de ofertas">
              <div className="bg-app p-4 sm:p-5">
                {/* Abas + título */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-card p-1 text-[10.5px]">
                    <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-fg-2"><BarChart3 className="h-3 w-3" /> Análise</span>
                    <span className="flex items-center gap-1.5 rounded-md bg-white/[0.08] px-2.5 py-1.5 font-medium"><GitCompare className="h-3 w-3" /> Comparação de Ofertas</span>
                  </span>
                  <span className="hidden items-center gap-1 rounded-lg border border-white/[0.06] bg-card p-1 text-[10.5px] sm:flex">
                    <span className="rounded-md bg-white/[0.08] px-2.5 py-1.5 font-medium">Oferta × Oferta</span>
                    <span className="px-2.5 py-1.5 text-fg-3">Período × Período</span>
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-[17px] font-bold tracking-tight">Comparação</div>
                  <div className="text-[10.5px] text-fg-3">Duas ofertas lado a lado — ou a mesma oferta em dois períodos.</div>
                </div>

                {/* Seletores */}
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  {[A, B].map((o, i) => (
                    <div key={o.name} className={clsx("rounded-xl border border-white/[0.06] bg-card p-3", i === 0 ? "sm:col-start-1" : "sm:col-start-3")}>
                      <Label>
                        <span className="mr-1 flex h-3.5 w-3.5 items-center justify-center rounded-full font-mono text-[7px] text-white" style={{ background: o.cor }}>
                          {i === 0 ? "A" : "B"}
                        </span>
                        Lado {i === 0 ? "A" : "B"}
                      </Label>
                      <div className="mt-2 text-[9px] text-fg-3">Oferta</div>
                      <SelectBox className="mt-1 w-full">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red/20 font-mono text-[7px] font-bold text-red">{o.initials}</span>
                        {o.name}
                      </SelectBox>
                      <div className="mt-2 text-[9px] text-fg-3">Período</div>
                      <SelectBox className="mt-1 w-full">Últimos 7 dias</SelectBox>
                    </div>
                  ))}
                  <span className="order-first flex h-7 w-7 items-center justify-center justify-self-center rounded-full border border-white/10 bg-card text-fg-2 sm:order-none sm:col-start-2 sm:row-start-1">
                    <ArrowLeftRight className="h-3 w-3" />
                  </span>
                </div>
                <div className="mt-2 hidden justify-end sm:flex">
                  <PBtn tone="ghost" size="sm" icon={Bookmark}>Salvar comparação</PBtn>
                </div>

                {/* Cards A × B */}
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
                  {[A, B].map((o, i) => {
                    const isA = i === 0;
                    const shown = step >= 0;
                    const win = step >= 1 && isA;
                    return (
                      <motion.div
                        key={o.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={shown ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                        className={clsx(
                          "relative rounded-xl border border-white/[0.06] border-t-2 p-4 transition-colors duration-500",
                          isA ? "border-t-blue sm:col-start-1" : "border-t-orange sm:col-start-3",
                          win ? "bg-[#0f1a12]" : "bg-card",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span>
                            <span className="block text-[12px] font-bold">{o.name}</span>
                            <span className="block text-[8.5px] text-fg-3">Últimos 7 dias · 7 dias</span>
                          </span>
                          <motion.span initial={{ scale: 0, opacity: 0 }} animate={win ? { scale: 1, opacity: 1 } : {}} transition={{ type: "spring", stiffness: 400, damping: 22 }}>
                            <StatusPill tone="green"><Trophy className="h-2 w-2" /> Vence</StatusPill>
                          </motion.span>
                        </div>
                        <Label className="mt-3">Lucro</Label>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                          <span className="text-[26px] font-bold leading-none tracking-tight text-green"><Money v={o.lucro} /></span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={step >= 1 ? { opacity: 1 } : {}}
                            className={clsx("rounded-full px-1.5 py-[2px] font-mono text-[8.5px]", isA ? "bg-green/15 text-green" : "bg-red/15 text-red")}
                          >
                            {isA ? "↑" : "↓"} {isA ? PCT.toFixed(1) : ((1 - B.lucro / A.lucro) * 100).toFixed(1)}%
                          </motion.span>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {[
                            { l: "Faturamento", v: <Money v={o.fat} /> },
                            { l: "Anúncios", v: <Money v={o.ads} /> },
                            { l: "ROAS", v: `${o.roas.toFixed(2)}x` },
                          ].map((m) => (
                            <span key={m.l}>
                              <Label>{m.l}</Label>
                              <span className="mt-0.5 block text-[11px] font-semibold tabular">{m.v}</span>
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                  <span className="order-first justify-self-center rounded-md border border-white/10 bg-card px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-fg-3 sm:order-none sm:col-start-2 sm:row-start-1 sm:self-center">
                    Versus
                  </span>
                </div>

                {/* Resumo */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={step >= 2 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mt-3 rounded-xl border border-white/[0.06] border-l-2 border-l-red bg-card p-4"
                >
                  <div className="flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]">
                    <Trophy className="h-3 w-3 text-red" /> Resumo da comparação
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-green px-2 py-[3px] font-mono text-[8.5px] font-bold uppercase tracking-wider text-black">Lado A vence</span>
                    <span className="text-[12px] font-bold">{A.name} rendeu mais</span>
                  </div>
                  <p className="mt-2 text-[10.5px] leading-relaxed text-fg-2">
                    {A.name} (Últimos 7 dias) lucrou <span className="text-fg"><Money v={A.lucro - B.lucro} /></span> a mais que {B.name} (Últimos 7 dias) —{" "}
                    {PCT.toFixed(1)}% acima. O que mais pesou foi o faturamento: <span className="text-fg"><Money v={A.fat - B.fat} /></span> de diferença a favor dele.
                  </p>

                  <div className="mt-3 rounded-lg border border-white/[0.05] bg-[#0f0f0f] p-3">
                    <Label>De onde veio a diferença</Label>
                    <div className="mt-2 space-y-2">
                      {DIFF.map((d, i) => (
                        <div key={d.l} className="grid grid-cols-[110px_1fr_auto] items-center gap-3 text-[10px]">
                          <span className="text-fg-2">{d.l}</span>
                          <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <motion.span
                              className="block h-full rounded-full bg-green"
                              initial={{ width: 0 }}
                              animate={step >= 3 + i ? { width: `${Math.max(2, (Math.abs(d.v) / DIFF_MAX) * 100)}%` } : {}}
                              transition={{ duration: 0.8, ease: EASE }}
                            />
                          </span>
                          <motion.span initial={{ opacity: 0 }} animate={step >= 3 + i ? { opacity: 1 } : {}} className="font-mono tabular text-green">
                            +<Money v={Math.abs(d.v)} />
                          </motion.span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-[8.5px] text-fg-3">As três parcelas somam exatamente a diferença de lucro: faturamento a mais, menos anúncio e menos custos e impostos.</div>
                  </div>
                </motion.div>

                {/* Resultado — barras A × B */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={done ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mt-3 grid gap-3 sm:grid-cols-2"
                >
                  {[
                    { t: "Resultado", s: "o dinheiro que entrou e saiu", rows: [{ l: "Lucro", a: A.lucro, b: B.lucro }, { l: "Faturamento", a: A.fat, b: B.fat }] },
                    { t: "Eficiência", s: "o quanto cada real trabalhou", rows: [{ l: "ROAS", a: A.roas, b: B.roas, x: true }, { l: "Margem", a: (A.lucro / A.fat) * 100, b: (B.lucro / B.fat) * 100, pct: true }] },
                  ].map((g) => (
                    <div key={g.t} className="rounded-xl border border-white/[0.06] bg-card p-4">
                      <div className="text-[11px] font-bold">{g.t}</div>
                      <div className="text-[8.5px] text-fg-3">{g.s}</div>
                      <div className="mt-3 space-y-3">
                        {g.rows.map((r) => {
                          const max = Math.max(r.a, r.b);
                          const fmt = (v: number) => ("x" in r && r.x ? `${v.toFixed(2)}x` : "pct" in r && r.pct ? `${v.toFixed(1)}%` : <Money v={v} />);
                          return (
                            <div key={r.l}>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-semibold">{r.l}</span>
                                <span className="font-mono text-[8.5px] text-green">↑ {(((r.a - r.b) / r.b) * 100).toFixed(1)}% A vs B</span>
                              </div>
                              {(["a", "b"] as const).map((k) => (
                                <div key={k} className="mt-1 flex items-center gap-2">
                                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-sm font-mono text-[7px] font-bold text-white" style={{ background: k === "a" ? A.cor : B.cor }}>
                                    {k.toUpperCase()}
                                  </span>
                                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                                    <motion.span
                                      className="block h-full rounded-full"
                                      style={{ background: k === "a" ? A.cor : B.cor }}
                                      initial={{ width: 0 }}
                                      animate={done ? { width: `${((k === "a" ? r.a : r.b) / max) * 100}%` } : {}}
                                      transition={{ duration: 0.9, ease: EASE }}
                                    />
                                  </span>
                                  <span className="w-16 text-right font-mono text-[9.5px] tabular">{fmt(k === "a" ? r.a : r.b)}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </Window>
          </div>
        </Reveal>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="display mx-auto mt-10 max-w-2xl text-center text-2xl text-balance sm:text-3xl"
        >
          A que mais fatura <span className="text-fg-3">nem sempre é</span> a que mais coloca dinheiro no seu bolso.
        </motion.p>
      </Container>
    </Section>
  );
}
