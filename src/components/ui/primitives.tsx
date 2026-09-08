"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { track } from "./MetaPixel";
import { useImageOk } from "@/lib/use-image-ok";

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

/** Pixel-dot arrow that pulses left → right toward the tip. */
const DOTS = [
  { cx: 1.8, cy: 10.6, d: 0 },
  { cx: 6.2, cy: 10.6, d: 0.12 },
  { cx: 10.6, cy: 1.8, d: 0.24 },
  { cx: 10.6, cy: 10.6, d: 0.24 },
  { cx: 10.6, cy: 19.4, d: 0.24 },
  { cx: 15.0, cy: 6.2, d: 0.36 },
  { cx: 15.0, cy: 10.6, d: 0.36 },
  { cx: 15.0, cy: 15.0, d: 0.36 },
  { cx: 19.4, cy: 10.6, d: 0.48 },
];

const SIZES = {
  sm: { h: 44, text: "text-sm" },
  md: { h: 54, text: "text-[15px]" },
  lg: { h: 64, text: "text-base" },
} as const;

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
  size?: "sm" | "md" | "lg";
  className?: string;
  event?: string;
  eventParams?: Record<string, unknown>;
}) {
  const external = href.startsWith("http");
  const { h, text } = SIZES[size];
  const iconW = h - 6;
  const padLeft = iconW + 19;

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => event && track(event, eventParams)}
      style={{ height: h, paddingLeft: padLeft }}
      className={clsx(
        "group relative inline-flex items-center whitespace-nowrap rounded-[13px] border pr-6 font-medium",
        "transition-transform duration-300 ease-out-expo hover:-translate-y-0.5 active:translate-y-0",
        text,
        variant === "primary" && "border-white/10 bg-[#111114] text-white shadow-[0_18px_40px_-18px_rgba(0,0,0,.9)]",
        variant === "ghost" && "border-line-2 bg-white/[0.03] text-fg hover:bg-white/[0.06]",
        variant === "white" && "border-black/10 bg-white text-black",
        className,
      )}
    >
      <span
        aria-hidden
        style={{ width: iconW }}
        className={clsx(
          "absolute inset-y-[3px] left-[3px] flex items-center justify-center rounded-[10px]",
          variant === "ghost"
            ? "bg-white/[0.09] shadow-[inset_0_0_8px_1px_rgba(255,255,255,.08)]"
            : "bg-gradient-to-b from-[#FF3B44] to-[#FA0A15] shadow-[inset_0_0_8px_1px_rgba(255,150,155,.55),0_12px_20px_0_rgba(0,0,0,.3)]",
        )}
      >
        <svg viewBox="0 0 21.2 21.2" className="h-[46%] w-auto overflow-visible" fill="none">
          {DOTS.map((dot, i) => (
            <circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r="1.7"
              fill={variant === "ghost" ? "#ffffff" : "#6b0005"}
              style={{ animation: `dot-wave 1.4s ease-in-out ${dot.d}s infinite` }}
            />
          ))}
        </svg>
      </span>
      <span className="relative">{children}</span>
    </Link>
  );
}

/* ---------- Social proof ---------- */

/**
 * Overlapping avatars beside a short line. Hovering one slides it aside so the
 * face underneath shows. Missing files fall back to a neutral placeholder —
 * drop real photos in /public/avatars before publishing a recommendation claim.
 */
export function SocialProof({
  text,
  avatars = [],
  className,
}: {
  text: string;
  avatars?: string[];
  className?: string;
}) {
  const list = avatars.length ? avatars : [null, null, null];
  return (
    <div className={clsx("flex items-center justify-center gap-3.5", className)}>
      <div className="flex pl-3">
        {list.map((src, i) => (
          <Avatar key={i} src={src} z={list.length - i} />
        ))}
      </div>
      <p className="max-w-[15rem] text-left text-sm leading-snug text-fg-2">{text}</p>
    </div>
  );
}

function Avatar({ src, z }: { src: string | null; z: number }) {
  const ok = useImageOk(src);
  return (
    <span
      style={{ zIndex: z }}
      className="relative -ml-3 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-white/[0.18] to-white/[0.05] ring-2 ring-white/15 transition-transform duration-500 ease-out-expo hover:-translate-x-3"
    >
      {ok && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
      ) : (
        <User className="h-5 w-5 text-white/45" />
      )}
    </span>
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
