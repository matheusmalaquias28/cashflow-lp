"use client";

/**
 * Footer com "cortina": a seção ocupa uma tela de altura e recorta um footer
 * fixo, que vai sendo revelado conforme a página sobe. Adaptado do prompt de
 * referência para as convenções deste projeto — Motion no lugar do GSAP, clsx
 * no lugar do `cn` do shadcn e os tokens de cor do Cashflow no lugar dos do
 * shadcn. Respeita prefers-reduced-motion.
 */

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { ArrowUp } from "lucide-react";
import { Logo } from "./primitives";
import { CTA_PRIMARY_HREF } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- Botão magnético ---------- */

/** Mapa estático: criar componentes de motion durante o render quebra o lint. */
const MOTION = { a: motion.a, button: motion.button } as const;

type MagneticProps = {
  as?: keyof typeof MOTION;
  children: ReactNode;
  className?: string;
  /** Quanto o elemento persegue o cursor (fração do deslocamento). */
  strength?: number;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  "aria-label"?: string;
};

function Magnetic({ as = "button", children, className, strength = 0.35, ...rest }: MagneticProps) {
  const Tag = MOTION[as];
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 22, mass: 0.6 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * strength);
    my.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { x, y }}
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={clsx("glass-pill cursor-pointer", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------- Marquee ---------- */

const MARQUEE = [
  "Vendas em tempo real",
  "Gestão de ofertas",
  "Meta Ads integrado",
  "Caixa de verdade",
  "Sem planilha",
];

function MarqueeRow() {
  return (
    <div className="flex shrink-0 items-center">
      {MARQUEE.map((t) => (
        <span key={t} className="flex items-center whitespace-nowrap">
          <span className="px-6">{t}</span>
          <span className="text-red/70">✦</span>
        </span>
      ))}
    </div>
  );
}

/* ---------- Footer ---------- */

const LINKS = [
  { href: "#produto", label: "Produto" },
  { href: "#financeiro", label: "Financeiro" },
  { href: "#integracoes", label: "Integrações" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
];

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 0 quando a cortina começa a aparecer, 1 quando está totalmente revelada.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end end"],
  });
  const p: MotionValue<number> = scrollYProgress;

  const giantY = useTransform(p, [0, 1], reduce ? ["0vh", "0vh"] : ["14vh", "0vh"]);
  const giantScale = useTransform(p, [0, 1], reduce ? [1, 1] : [0.86, 1]);
  const giantOpacity = useTransform(p, [0, 0.55, 1], reduce ? [1, 1, 1] : [0, 0.5, 1]);
  // O miolo entra com whileInView (mesmo mecanismo do resto da página); só o
  // texto gigante acompanha o scroll, para dar a sensação de profundidade.
  // Sempre define o alvo visível: sem isso, com prefers-reduced-motion o
  // elemento ficaria preso no opacity:0 renderizado no servidor.
  const rise = (delay: number) => ({
    initial: reduce ? { y: 0, opacity: 1 } : { y: 44, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true, amount: 0.4 },
    transition: reduce ? { duration: 0 } : { duration: 0.9, delay, ease: EASE },
  });

  const toTop = () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });

  return (
    // O clip-path faz esta caixa virar o bloco de contenção do footer fixo:
    // ele só aparece dentro dela, criando a revelação em cortina.
    <div
      ref={wrapperRef}
      className="relative h-screen w-full"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-bg text-fg">
        {/* Brilho ambiente + grade */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[60vh] w-[85vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] bg-[radial-gradient(circle_at_50%_50%,rgba(250,10,21,.22)_0%,rgba(131,0,6,.18)_42%,transparent_70%)] blur-[80px]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 footer-grid" />

        {/* Palavra gigante ao fundo */}
        <motion.div
          aria-hidden
          style={{ y: giantY, scale: giantScale, opacity: giantOpacity }}
          className="footer-giant pointer-events-none absolute -bottom-[4vh] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap"
        >
          CASHFLOW
        </motion.div>

        {/* Marquee diagonal */}
        <div className="absolute inset-x-0 top-24 z-10 -rotate-2 scale-110 overflow-hidden border-y border-line bg-bg/60 py-4 shadow-2xl backdrop-blur-md">
          <div className="flex w-max animate-footer-marquee font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-fg-3 sm:text-xs">
            <MarqueeRow />
            <MarqueeRow />
          </div>
        </div>

        {/* Miolo */}
        <div className="relative z-10 mx-auto mt-20 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6">
          <motion.h2
            {...rise(0)}
            className="display footer-shine mb-10 text-balance text-center text-[2.6rem] leading-[0.95] tracking-tight sm:text-6xl md:text-7xl"
          >
            Pronto para assumir o controle?
          </motion.h2>

          <motion.div {...rise(0.12)} className="flex w-full flex-col items-center gap-5">
            <Magnetic
              as="a"
              href={CTA_PRIMARY_HREF}
              strength={0.28}
              className="flex items-center gap-3 rounded-full border border-[rgba(255,97,105,0.45)] bg-[linear-gradient(180deg,#FF3B44_0%,#D40510_100%)] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-[0_12px_32px_-6px_rgba(255,59,68,0.65),inset_0_1px_0_rgba(255,255,255,0.28)] transition-[transform,filter] hover:brightness-110 sm:px-10 sm:py-5 sm:text-base"
            >
              Quero garantir meu acesso
              <span className="text-white">→</span>
            </Magnetic>

            <div className="mt-1 flex flex-wrap justify-center gap-2 sm:gap-3">
              {LINKS.map((l) => (
                <Magnetic
                  key={l.href}
                  as="a"
                  href={l.href}
                  strength={0.22}
                  className="rounded-full px-5 py-2.5 text-xs font-medium text-fg-2 sm:px-6 sm:py-3 sm:text-sm"
                >
                  {l.label}
                </Magnetic>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Rodapé do rodapé */}
        <div className="relative z-20 flex w-full flex-col items-center justify-between gap-5 px-6 pb-8 md:flex-row md:px-12">
          <div className="order-2 flex items-center gap-3 md:order-1">
            <Logo className="h-5" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-fg-3 md:text-[11px]">
              © {new Date().getFullYear()} Cashflow
            </span>
          </div>

          <Magnetic
            as="a"
            href="https://www.energymidia.com.br/?utm_source=google&utm_id=cashflowlp"
            target="_blank"
            rel="noopener noreferrer"
            strength={0.2}
            className="order-1 flex items-center gap-2 rounded-full px-5 py-3 md:order-2"
          >
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fg-3">Desenvolvido com</span>
            <span className="animate-footer-heartbeat text-sm">⚡</span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-fg-3">pela</span>
            <span className="ml-0.5 text-xs font-black tracking-normal text-orange">Energy</span>
          </Magnetic>

          <Magnetic
            as="button"
            type="button"
            onClick={toTop}
            aria-label="Voltar ao topo"
            strength={0.4}
            className="group order-3 flex h-12 w-12 items-center justify-center rounded-full text-fg-2"
          >
            <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1.5" />
          </Magnetic>
        </div>
      </footer>
    </div>
  );
}
