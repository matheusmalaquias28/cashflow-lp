"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import clsx from "clsx";
import { Check, Plus } from "lucide-react";
import { Button, Container, Eyebrow, Logo, Reveal, Section, SectionHeader, SplitWords } from "../ui/primitives";

import { CTA_PRIMARY_HREF, FAQ, PLANS } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/* =====================================================================
   Manifesto
   ===================================================================== */

export function Manifesto() {
  return (
    <Section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(131,0,6,.45),transparent_70%)]" />
      <Container className="text-center">
        <Reveal>
          <Eyebrow className="justify-center">Feito para quem leva a operação a sério</Eyebrow>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-3xl text-balance text-xl leading-relaxed text-fg-2 sm:text-2xl">
            O Cashflow nasceu dentro do ecossistema de Lowticket criado por{" "}
            <span className="text-fg">Heitor Nogueira</span>, autor de <span className="text-fg">O Processo</span>.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-fg-3">
            Uma ferramenta construída para quem não quer apenas vender mais. Quer entender a operação, encontrar
            oportunidades e executar melhor.
          </p>
        </Reveal>
        <SplitWords
          as="p"
          text="É só *fazer."
          className="display mt-16 text-6xl sm:text-8xl lg:text-[9rem]"
        />
      </Container>
    </Section>
  );
}

/* =====================================================================
   Planos
   ===================================================================== */

export function Pricing() {
  return (
    <Section id="planos" className="!pt-0">
      <Container>
        <SectionHeader eyebrow="Planos" title="Escolha o plano da sua *operação." lead="Membros fundadores têm condições especiais de entrada." />

        <div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} amount={0.15} className="h-full">
              <div
                className={clsx(
                  "relative flex h-full flex-col rounded-2xl border p-6 transition-transform duration-500 ease-out-expo hover:-translate-y-1",
                  p.highlight
                    ? "border-red/60 bg-gradient-to-b from-red/[0.12] to-transparent glow-red"
                    : "panel hover:border-line-2",
                )}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-red px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                    Mais escolhido
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-fg-2">{p.name}</h3>
                  <span className={clsx("h-2 w-2 rounded-full", p.highlight ? "bg-red" : "bg-white/20")} />
                </div>
                <p className="mt-2 min-h-[40px] text-sm text-fg-3">{p.tagline}</p>

                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-sm text-fg-3">R$</span>
                    <span className="display text-5xl tabular">{p.firstPrice}</span>
                  </div>
                  <div className="mt-1 text-xs text-fg-3">primeiro pagamento</div>
                  <div className="mt-1 text-sm text-fg-2">
                    Depois, <span className="font-mono tabular text-fg">R$ {p.monthly}</span>/mês
                  </div>
                </div>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={clsx("mt-0.5 h-3.5 w-3.5 shrink-0", p.highlight ? "text-red" : "text-fg-3")} />
                      <span className={f.includes("VIP") ? "text-fg" : "text-fg-2"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-line pt-4 font-mono text-[11px] text-fg-3">{p.extraSale}</div>

                <div className="mt-6">
                  <Button
                    href={p.href}
                    variant={p.highlight ? "primary" : "ghost"}
                    className="w-full !px-4 !text-sm"
                    event="InitiateCheckout"
                    eventParams={{ content_name: p.name, value: Number(p.firstPrice.replace(",", ".")), currency: "BRL" }}
                  >
                    Quero ser membro fundador
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* =====================================================================
   FAQ
   ===================================================================== */

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" className="!pt-0">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
          </Reveal>
          <SplitWords text="Perguntas *frequentes." className="display mt-5 text-4xl sm:text-5xl" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-fg-2">O que quem está entrando agora costuma perguntar antes de virar membro fundador.</p>
          </Reveal>
        </div>
        <Reveal amount={0.1}>
          <div className="divide-y divide-line rounded-2xl border border-line">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
                  >
                    <span className={clsx("text-base font-semibold transition-colors", isOpen ? "text-fg" : "text-fg-2")}>{f.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} className={clsx("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", isOpen ? "border-red bg-red text-white" : "border-line text-fg-3")}>
                      <Plus className="h-3.5 w-3.5" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-fg-2">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* =====================================================================
   CTA final + Footer
   ===================================================================== */

export function FinalCta() {
  return (
    <Section className="!pt-0">
      <Container>
        <Reveal amount={0.2}>
          <div className="relative overflow-hidden rounded-[2rem] border border-red/30 px-6 py-20 text-center sm:px-12 sm:py-28">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_80%_at_50%_120%,rgba(250,10,21,.5),rgba(131,0,6,.25)_40%,transparent_75%)]" />
            <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black,transparent)]" />
            <SplitWords
              text="Quanto mais sua operação cresce, mais dados você precisa *controlar."
              className="display mx-auto max-w-4xl text-balance text-4xl sm:text-5xl lg:text-6xl"
            />
            <Reveal delay={0.15}>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-fg-2">
                Não deixe sua operação virar uma coleção de planilhas, abas e números espalhados.{" "}
                <span className="text-fg">Coloque tudo no Cashflow.</span>
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-10 flex flex-col items-center gap-4">
                <Button href={CTA_PRIMARY_HREF} size="lg" event="ViewContent" eventParams={{ content_name: "final_cta" }}>
                  Quero começar agora
                </Button>
                <span className="text-sm text-fg-3">Membros fundadores têm condições especiais de entrada.</span>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Logo className="h-6" />
          <span className="hidden text-sm text-fg-3 sm:inline">Sua operação de Lowticket. Sob controle.</span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-3">
          <a href="#produto" className="hover:text-fg">Produto</a>
          <a href="#financeiro" className="hover:text-fg">Financeiro</a>
          <a href="#integracoes" className="hover:text-fg">Integrações</a>
          <a href="#planos" className="hover:text-fg">Planos</a>
          <a href="#faq" className="hover:text-fg">FAQ</a>
        </nav>
        <div className="font-mono text-[11px] text-fg-3">© {new Date().getFullYear()} Cashflow. Todos os direitos reservados.</div>
      </Container>
    </footer>
  );
}
