"use client";

import clsx from "clsx";
import { Quote } from "lucide-react";
import { Container, Reveal, Section, SplitWords } from "../ui/primitives";
import { useImageOk } from "@/lib/use-image-ok";
import { TESTIMONIALS } from "@/lib/data";

/**
 * Prova social em carrossel contínuo. A faixa anda sozinha e não responde a
 * toque nem a arrasto — é uma vitrine, não um controle. Em
 * prefers-reduced-motion ela para e as fotos ficam legíveis do mesmo jeito.
 */
export function Testimonials() {
  return (
    <Section className="theme-light overflow-hidden bg-white pb-12 text-fg sm:pb-14 lg:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,11,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,11,.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 78%)",
        }}
      />

      <Container className="text-center">
        <SplitWords
          text="Players que escalam // de verdade confiam na *Cashflow"
          className="display mx-auto max-w-4xl text-balance text-4xl sm:text-5xl lg:text-6xl min-[1921px]:max-w-5xl min-[1921px]:text-7xl"
        />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-fg-2 sm:text-lg min-[1921px]:text-xl">
            Relatos reais de melhoria na operação, na gestão e na escala de ofertas
          </p>
        </Reveal>
      </Container>

      {/* Sai do Container: a faixa vai de borda a borda */}
      <Reveal delay={0.15} amount={0.15} className="mt-12 block">
        <div className="overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee-slow gap-4 pr-4 motion-reduce:animate-none sm:gap-5 sm:pr-5">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((src, i) => (
              <TestimonialCard key={i} src={src} index={i % TESTIMONIALS.length} />
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function TestimonialCard({ src, index }: { src: string; index: number }) {
  const ok = useImageOk(src);
  return (
    <figure
      className={clsx(
        // 62vw deixa uma foto e meia à vista no telefone; em telas maiores o
        // cartão para de crescer e aparecem mais.
        "relative aspect-[3/4] w-[62vw] shrink-0 overflow-hidden rounded-2xl border border-[#0a0a0b]/10 bg-[#f4f4f5]",
        "shadow-[0_18px_50px_-30px_rgba(10,10,11,.45)] sm:w-[38vw] lg:w-[26vw] lg:max-w-[300px]",
      )}
    >
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-fg-3">
          <Quote className="h-8 w-8 opacity-40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Depoimento {index + 1}</span>
        </div>
      )}
    </figure>
  );
}
