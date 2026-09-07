"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { track } from "./MetaPixel";

/* ---------- Layout ---------- */

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>;
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={clsx("relative py-24 sm:py-32 lg:py-40", className)}>
      {children}
    </section>
  );
}

/* ---------- Motion ---------- */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
  amount = 0.3,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0, rotateX: -40 },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.9, delay: 0.05 * i, ease: EASE },
  }),
};

const MOTION_TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p } as const;

/** Reveals text word by word. Prefix a word with * to color it red; use // for a line break. */
export function SplitWords({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const words = text.split(" ");
  const MotionTag = MOTION_TAGS[Tag];
  return (
    <MotionTag ref={ref as never} className={clsx("[perspective:800px]", className)} aria-label={text}>
      {words.map((w, i) => {
        const red = w.startsWith("*");
        const clean = w.replace(/\*/g, "");
        const isBreak = clean === "//";
        if (isBreak) return <br key={i} className="hidden sm:block" />;
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
            <motion.span
              className={clsx("inline-block will-change-transform", red && "text-red")}
              custom={i + delay * 10}
              variants={wordVariants}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
            >
              {clean}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}

/* ---------- Typography ---------- */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("eyebrow flex items-center gap-2", className)}>
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-red animate-pulse-dot" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-red" />
      </span>
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={clsx("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow className={align === "center" ? "justify-center" : undefined}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <SplitWords
        text={title}
        className="display mt-5 text-balance text-4xl sm:text-5xl lg:text-6xl"
      />
      {lead && (
        <Reveal delay={0.15}>
          <p className="mt-6 text-balance text-base text-fg-2 sm:text-lg leading-relaxed">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------- Button ---------- */

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  event,
  eventParams,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "white";
  size?: "md" | "lg";
  className?: string;
  event?: string;
  eventParams?: Record<string, unknown>;
}) {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => event && track(event, eventParams)}
      className={clsx(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-semibold transition-transform duration-300 ease-out-expo active:scale-[0.98]",
        size === "md" ? "h-12 px-6 text-[15px]" : "h-14 px-8 text-base",
        variant === "primary" && "bg-red text-white shadow-[0_0_0_1px_rgba(250,10,21,.6),0_12px_40px_-12px_rgba(250,10,21,.7)] hover:shadow-[0_0_0_1px_rgba(250,10,21,.8),0_16px_50px_-10px_rgba(250,10,21,.85)]",
        variant === "ghost" && "border border-line-2 bg-white/[0.03] text-fg hover:bg-white/[0.07]",
        variant === "white" && "bg-white text-black hover:bg-white/90",
        className,
      )}
    >
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out-expo group-hover:translate-x-full" />
      )}
      <span className="relative">{children}</span>
      <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  );
}

/* ---------- Brand ---------- */

export function Logo({ className, icon = false }: { className?: string; icon?: boolean }) {
  return icon ? (
    <Image src="/brand/logo-icon.svg" alt="Cashflow" width={40} height={40} className={className} priority />
  ) : (
    <Image
      src="/brand/logo-full.svg"
      alt="Cashflow"
      width={160}
      height={40}
      className={clsx("h-8 w-auto", className)}
      priority
    />
  );
}
