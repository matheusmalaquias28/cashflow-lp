"use client";

import { Play } from "lucide-react";
import { Button, Container, Eyebrow, Reveal, Section, SplitWords } from "../ui/primitives";
import { CTA_PRIMARY_HREF } from "@/lib/data";

/**
 * Demonstração em vídeo. O quadro abaixo é um placeholder: troque o conteúdo
 * do <div data-video> por um <video> ou pelo iframe do player quando o vídeo
 * estiver pronto — a moldura e a proporção 16:9 já ficam prontas.
 */
export function VideoDemo() {
  return (
    <Section className="!pt-0">
      <div className="pointer-events-none absolute inset-x-0 top-[12%] -z-10 h-[520px] bg-[radial-gradient(ellipse_55%_60%_at_50%_50%,rgba(131,0,6,.3),transparent_72%)]" />
      <Container className="text-center">
        <Reveal>
          <Eyebrow dot={false} className="mx-auto max-w-xs text-center sm:max-w-none">
            Veja todas as funcionalidades da Cashflow
          </Eyebrow>
        </Reveal>

        <SplitWords
          text="Transforme suas ofertas bagunçadas em uma operação organizada, rastreada e *lucrativa."
          className="display mx-auto mt-5 max-w-4xl text-balance text-3xl sm:text-4xl lg:text-5xl min-[1921px]:max-w-5xl min-[1921px]:text-6xl"
        />

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-fg-2 sm:text-lg">
            Assista à demonstração completa da Cashflow e veja como ela vai te ajudar a gerir múltiplas ofertas com
            eficiência e trackear +99% das suas vendas, garantindo estabilidade, escala e lucro.
          </p>
        </Reveal>

        <Reveal delay={0.18} amount={0.2}>
          <div className="mx-auto mt-12 w-full max-w-4xl min-[1921px]:max-w-5xl">
            <div className="glow-red relative aspect-video w-full overflow-hidden rounded-2xl border border-line-2 bg-[#08080a]">
              <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(131,0,6,.45),transparent_70%)]"
              />
              {/* placeholder — substituir pelo player */}
              <div data-video className="relative flex h-full w-full flex-col items-center justify-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-red/50 bg-red/15 text-red backdrop-blur-sm sm:h-20 sm:w-20">
                  <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-fg-3">Vídeo de demonstração</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex justify-center">
            <Button href={CTA_PRIMARY_HREF} size="lg" event="ViewContent" eventParams={{ content_name: "video_cta" }}>
              QUERO GARANTIR MEU ACESSO
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
