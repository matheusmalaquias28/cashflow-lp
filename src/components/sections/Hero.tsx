"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Button, Container, Eyebrow, SplitWords } from "../ui/primitives";
import { Dashboard } from "../mock/Dashboard";
import { ScaledFrame } from "../mock/ScaledFrame";
import { CTA_PRIMARY_HREF, INTEGRATIONS } from "@/lib/data";
import { BrandMark } from "./Integrations";
import { Velaris } from "../ui/velaris";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const rotateX = useTransform(scrollYProgress, [0, 0.45], reduce ? [0, 0] : [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], reduce ? [1, 1] : [0.88, 1]);
  const y = useTransform(scrollYProgress, [0, 0.45], reduce ? [0, 0] : [80, 0]);
  const glow = useTransform(scrollYProgress, [0, 0.45], [0.3, 1]);

  return (
    <section className="relative overflow-hidden pt-44 sm:pt-52">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Velaris
          height="100%"
          bg="#050505"
          colors={["#1c0002", "#5c0004", "#090001", "#050505"]}
          speed={0.55}
          grain={0.18}
          className="absolute inset-x-0 top-0 h-[105vh] opacity-70 [mask-image:radial-gradient(120%_85%_at_50%_10%,black_0%,black_35%,transparent_78%)]"
        />
        <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute left-1/2 top-[-14%] h-[62vh] w-[120vw] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(131,0,6,.4),transparent_68%)] blur-3xl" />
      </div>

      <Container className="relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto inline-flex items-center gap-3 rounded-full border border-line-2 bg-white/[0.03] py-1.5 pl-2 pr-4 text-xs text-fg-2 backdrop-blur"
        >
          <span className="rounded-full bg-red px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
            Fundadores
          </span>
          Membros fundadores têm condições especiais de entrada.
        </motion.div>

        <SplitWords
          as="h1"
          text="Sua operação de Lowticket. // *Sob *controle."
          delay={0.4}
          className="display mx-auto mt-8 max-w-5xl text-balance text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-7 max-w-2xl text-balance text-base leading-relaxed text-fg-2 sm:text-lg md:text-xl"
        >
          <span className="text-fg">Vendas, tráfego, ofertas e financeiro em um único lugar.</span> Tenha uma visão
          clara do que está acontecendo em cada oferta e tome decisões com dados reais, sem depender de
          planilhas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button href={CTA_PRIMARY_HREF} size="lg" event="ViewContent" eventParams={{ content_name: "hero_cta" }}>
            Quero conhecer o Cashflow
          </Button>
          <a
            href="#produto"
            className="inline-flex h-14 items-center gap-2 px-6 text-base text-fg-2 transition-colors hover:text-fg"
          >
            Ver como funciona
          </a>
        </motion.div>
      </Container>

      {/* Dashboard */}
      <div ref={ref} className="relative mx-auto mt-16 w-full max-w-[1280px] px-4 sm:mt-24 sm:px-8 [perspective:1600px]">
        <motion.div
          style={{ opacity: glow }}
          className="pointer-events-none absolute inset-x-[10%] top-[10%] -z-10 h-[60%] rounded-[100%] bg-red-deep/60 blur-[100px]"
        />
        <motion.div
          style={{ rotateX, scale, y, transformOrigin: "50% 0%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="will-change-transform"
        >
          <div className="glow-red rounded-2xl">
            <ScaledFrame width={1216} ratio={16 / 10} className="overflow-hidden rounded-2xl">
              <Dashboard />
            </ScaledFrame>
          </div>
        </motion.div>
      </div>

      {/* Integrations marquee */}
      <div className="relative mt-20 sm:mt-28">
        <Container>
          <Eyebrow className="justify-center">Integrado às plataformas que sua operação já usa</Eyebrow>
        </Container>
        <div className="mt-6 overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee gap-3 pr-3">
            {[...INTEGRATIONS, "Meta Ads", ...INTEGRATIONS, "Meta Ads"].map((n, i) => (
              <div
                key={i}
                className="flex h-12 items-center rounded-full border border-line bg-white/[0.02] px-5"
              >
                <BrandMark name={n} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
