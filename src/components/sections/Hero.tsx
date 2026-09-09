"use client";

import { motion } from "motion/react";
import { Button, Container, Eyebrow, Logo, SocialProof, SplitWords } from "../ui/primitives";
import { CTA_PRIMARY_HREF, INTEGRATIONS, SOCIAL_PROOF } from "@/lib/data";
import { BrandMark } from "./Integrations";
import { Velaris } from "../ui/velaris";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Hero — 100vh no mobile, conteúdo no topo e vídeo na parte inferior */}
      <div className="relative flex min-h-[120svh] flex-col overflow-hidden pt-[15px] sm:block sm:min-h-0 sm:pt-40 min-[1921px]:flex! min-[1921px]:min-h-screen! min-[1921px]:flex-col! min-[1921px]:justify-center! min-[1921px]:pt-0!">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Cor de fundo atrás do vídeo (mobile #020101, desktop #020300) */}
        <div className="absolute inset-0 bg-[#020101] sm:bg-[#020300]" />
        <Velaris
          height="100%"
          bg="#130505"
          colors={["#1c0002", "#5c0004", "#090001", "#130505"]}
          speed={0.55}
          grain={0.18}
          className="absolute inset-x-0 top-0 hidden h-[105vh] opacity-70 sm:block [mask-image:radial-gradient(120%_85%_at_50%_10%,black_0%,black_35%,transparent_78%)]"
        />
        <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        {/* Vídeo mobile — fundo (retrato), ancorado à parte inferior da hero */}
        <video
          className="absolute inset-0 h-full w-full object-contain object-bottom sm:hidden"
          src="/video/bg-video-mobile-cash.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        {/* Vídeo desktop */}
        <video
          className="absolute inset-y-0 right-0 hidden h-full w-full bg-[#020300] object-contain object-right [clip-path:inset(0_4px)] sm:block"
          src="/video/video-bg-desktop-cashflow.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        {/* Mescla a borda esquerda do vídeo com o fundo preto da hero (desktop) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 bg-gradient-to-r from-[#020300] via-[#020300]/80 to-transparent lg:block" />
      </div>

      <div className="relative w-full px-6 text-center sm:px-10 sm:text-left lg:pl-[100px] lg:pr-8">
        {/* Logo no topo da hero — só no mobile (o nav fixo fica oculto) */}
        <Logo className="mx-auto mb-7 h-7 sm:hidden" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <SocialProof text={SOCIAL_PROOF.text} avatars={SOCIAL_PROOF.avatars} align="left" />
        </motion.div>

        <SplitWords
          as="h1"
          text="Sua operação de Lowticket. // *Sob *controle."
          delay={0.4}
          className="display mt-6 max-w-5xl text-balance text-[40px] sm:mt-8 sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-2xl text-balance text-sm leading-relaxed text-fg-2 sm:mt-7 sm:text-lg md:text-xl"
        >
          <span className="text-fg">Vendas, tráfego, ofertas e financeiro em um único lugar.</span> Tenha uma visão
          clara do que está acontecendo em cada oferta e tome decisões com dados reais, sem depender de
          planilhas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex flex-col items-center justify-center gap-2 sm:mt-10 sm:flex-row sm:items-start sm:justify-start sm:gap-3"
        >
          <Button href={CTA_PRIMARY_HREF} size="lg" event="ViewContent" eventParams={{ content_name: "hero_cta" }}>
            Quero conhecer o Cashflow
          </Button>
          <a
            href="#produto"
            className="inline-flex h-11 items-center gap-2 px-6 text-base text-fg-2 transition-colors hover:text-fg sm:h-14"
          >
            Ver como funciona
          </a>
        </motion.div>
        </div>

        {/* Espaço inferior no mobile — deixa o vídeo de fundo aparecer */}
        <div className="flex-1 sm:hidden" />
      </div>

      {/* Integrations marquee — abaixo da hero no mobile (invade levemente o vídeo) */}
      <div className="relative z-10 -mt-24 sm:mt-28">
        <Container>
          <Eyebrow dot={false} className="mx-auto max-w-xs text-center sm:max-w-none">
            Integrado às plataformas que sua operação já usa
          </Eyebrow>
        </Container>
        <div className="mt-6 overflow-hidden mask-fade-x">
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {[...INTEGRATIONS, "Meta Ads", ...INTEGRATIONS, "Meta Ads"].map((n, i) => (
              <div key={i} className="flex h-12 items-center">
                <BrandMark name={n} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
