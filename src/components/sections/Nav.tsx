"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { Logo } from "../ui/primitives";
import { StatsBar } from "../ui/StatsBar";

const LINKS = [
  { href: "#produto", label: "Produto" },
  { href: "#financeiro", label: "Financeiro" },
  { href: "#integracoes", label: "Integrações" },
  { href: "#planos", label: "Planos" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={clsx(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ease-out-expo",
        scrolled
          ? "border-line bg-[#0a0a0b]/80 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="relative flex h-16 w-full items-center px-5 sm:h-[68px] sm:px-8">
        <Link href="#" aria-label="Cashflow" className="mx-auto shrink-0 md:mx-0">
          <Logo className="h-6 sm:h-7" />
        </Link>

        {/* Absolutely centred so the logo and the live stats can be any width. */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm text-fg-2 transition-colors hover:bg-white/[0.05] hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <StatsBar className="ml-auto hidden md:flex" />
      </div>
    </motion.header>
  );
}
