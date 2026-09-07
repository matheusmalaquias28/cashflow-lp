"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Crown } from "lucide-react";
import { Container, Reveal, Section, SectionHeader } from "../ui/primitives";

type Row = { label: string; a: string; b: string; aRaw: number; bRaw: number; winner: "a" | "b"; result?: boolean };

const ROWS: Row[] = [
  { label: "Faturamento", a: "R$ 42.800", b: "R$ 38.500", aRaw: 42800, bRaw: 38500, winner: "a" },
  { label: "Investimento", a: "R$ 18.200", b: "R$ 11.400", aRaw: 18200, bRaw: 11400, winner: "b" },
  { label: "ROAS", a: "2,35", b: "3,38", aRaw: 2.35, bRaw: 3.38, winner: "b" },
  { label: "Lucro", a: "R$ 7.640", b: "R$ 12.180", aRaw: 7640, bRaw: 12180, winner: "b", result: true },
  { label: "Margem", a: "17,8%", b: "31,6%", aRaw: 17.8, bRaw: 31.6, winner: "b", result: true },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Compare() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setInterval(() => {
      setStep(i);
      i++;
      if (i > ROWS.length) clearInterval(t);
    }, 700);
    return () => clearInterval(t);
  }, [inView]);

  const crown: "a" | "b" | null = step < 0 ? null : step === 0 ? "a" : "b";
  const done = step >= ROWS.length;

  return (
    <Section className="!pt-0">
      <Container>
        <SectionHeader
          eyebrow="Comparação de ofertas"
          title="Qual oferta você *escalaria?"
          lead="Compare suas ofertas lado a lado e encontre as melhores oportunidades da operação."
        />

        <Reveal className="mx-auto mt-16 max-w-4xl" amount={0.2}>
          <div ref={ref} className="panel overflow-hidden">
            {/* Head */}
            <div className="grid grid-cols-[0.9fr_1fr_1fr] sm:grid-cols-[1.1fr_1fr_1fr] border-b border-line">
              <div className="px-5 py-5 sm:px-7" />
              {(["a", "b"] as const).map((k) => (
                <div key={k} className="relative flex items-center justify-center gap-2 border-l border-line px-4 py-5 text-center">
                  <span className="text-base font-bold tracking-tight sm:text-lg">Oferta {k.toUpperCase()}</span>
                  <AnimatePresence>
                    {crown === k && (
                      <motion.span
                        layoutId="crown"
                        initial={{ scale: 0.5, opacity: 0, y: -6 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red text-white shadow-[0_0_24px_rgba(250,10,21,.6)]"
                      >
                        <Crown className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Rows */}
            {ROWS.map((r, i) => {
              const active = step >= i;
              const max = Math.max(r.aRaw, r.bRaw);
              return (
                <div
                  key={r.label}
                  className={clsx(
                    "grid grid-cols-[0.9fr_1fr_1fr] sm:grid-cols-[1.1fr_1fr_1fr] border-b border-line last:border-0 transition-colors duration-500",
                    active && r.result && "bg-green/[0.05]",
                  )}
                >
                  <div className="flex items-center px-3 py-4 text-xs font-medium text-fg-2 sm:px-7 sm:text-base">
                    {r.label}
                  </div>
                  {(["a", "b"] as const).map((k) => {
                    const raw = k === "a" ? r.aRaw : r.bRaw;
                    const val = k === "a" ? r.a : r.b;
                    const win = active && r.winner === k;
                    return (
                      <div key={k} className="relative border-l border-line px-2 py-4 sm:px-4">
                        <div className="relative z-10 flex items-center justify-center">
                          <motion.span
                            initial={false}
                            animate={{
                              opacity: active ? 1 : 0.15,
                              color: win ? "#ffffff" : "rgba(255,255,255,0.55)",
                              scale: win ? 1.04 : 1,
                            }}
                            transition={{ duration: 0.5 }}
                            className="whitespace-nowrap font-mono text-[13px] tabular sm:text-xl"
                          >
                            {val}
                          </motion.span>
                        </div>
                        <motion.div
                          className={clsx(
                            "absolute inset-y-2 left-2 rounded-md",
                            win ? (r.result ? "bg-green/25" : "bg-red/20") : "bg-white/[0.04]",
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: active ? `calc(${(raw / max) * 100}% - 16px)` : 0 }}
                          transition={{ duration: 0.9, ease: EASE }}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
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
