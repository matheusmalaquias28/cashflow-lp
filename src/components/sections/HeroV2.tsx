"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Button, Logo, SplitWords } from "../ui/primitives";
import { CTA_PRIMARY_HREF } from "@/lib/data";

const DEMO_VIDEO_ID = "G7at_p0klTQ";

/**
 * Hero da LP v2 — ordem: headline, vídeo do YouTube, subheadline e botão.
 * Sem imagem/vídeo de fundo; conteúdo centralizado também no desktop.
 */
export function HeroV2() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <div className="relative flex flex-col pt-[15px] sm:pt-40">
        {/* Backdrop — apenas cor/grade/brilho, sem imagem de fundo */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[#020101] sm:bg-[#020300]" />
          <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
          <div className="pointer-events-none absolute inset-x-0 top-[8%] h-[520px] bg-[radial-gradient(ellipse_55%_60%_at_50%_50%,rgba(131,0,6,.3),transparent_72%)]" />
        </div>

        <div className="relative mx-auto w-full max-w-4xl px-6 text-center sm:px-10 min-[1921px]:max-w-5xl">
          {/* Logo no topo da hero — só no mobile (o nav fixo fica oculto) */}
          <Logo className="mx-auto mb-7 h-7 sm:hidden" />

          <SplitWords
            as="h1"
            text="1ª Ferramenta para *Gestão *de *Múltiplas *Ofertas *Low *Ticket com *Trackeamento *Avançado no MetaAds"
            delay={0.4}
            className="display mx-auto mt-6 max-w-3xl text-balance text-[24px] sm:mt-8 sm:text-4xl md:text-5xl lg:text-[clamp(2.25rem,5vw,3.25rem)]"
          />

          {/* Vídeo do YouTube — player 16:9 */}
          <div className="mx-auto mt-10 w-full max-w-3xl min-[1921px]:max-w-4xl">
            <div className="glow-red relative aspect-video w-full overflow-hidden rounded-2xl border border-line-2 bg-[#08080a]">
              {playing ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${DEMO_VIDEO_ID}?autoplay=1&rel=0`}
                  title="Demonstração da Cashflow"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="group absolute inset-0 cursor-pointer"
                  aria-label="Reproduzir demonstração da Cashflow"
                >
                  <Image
                    src="/video/demo-cover.png"
                    alt="Prévia da demonstração da Cashflow"
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, 768px"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
                  <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-red/50 bg-red/20 text-red backdrop-blur-sm transition-transform group-hover:scale-105 sm:h-20 sm:w-20">
                    <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />
                  </span>
                </button>
              )}
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-balance text-sm leading-relaxed text-fg-2 sm:text-lg md:text-xl">
            <span className="text-fg">Mais lucro, estabilidade e controle da sua operação.</span> Saiba quais ofertas
            dão resultado e tenha mais confiança nos dados para decidir o que escalar, ajustar ou pausar — tudo em um
            só lugar com poucos cliques.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
            <Button
              href={CTA_PRIMARY_HREF}
              size="lg"
              event="ViewContent"
              eventParams={{ content_name: "hero_cta" }}
            >
              Quero garantir meu acesso
            </Button>
            <a
              href="#produto"
              className="inline-flex h-11 items-center gap-2 px-6 text-base text-fg-2 transition-colors hover:text-fg sm:h-14"
            >
              Ver como funciona
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
