"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { Button, Logo } from "../ui/primitives";
import { CTA_PRIMARY_HREF } from "@/lib/data";
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
      className="fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 px-4 pt-4"
    >
      <div
        className={clsx(
          "flex w-full max-w-[1200px] items-center justify-between rounded-full border px-3 py-2 pl-5 transition-all duration-500 ease-out-expo",
          scrolled
            ? "border-line-2 bg-[#0a0a0b]/70 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(0,0,0,.9)]"
            : "border-transparent bg-transparent",
        )}
      >
        <Link href="#" aria-label="Cashflow">
          <Logo className="h-6 sm:h-7" />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm text-fg-2 transition-colors hover:bg-white/[0.05] hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Button href={CTA_PRIMARY_HREF} className="!h-10 !px-5 !text-sm">
          Quero conhecer
        </Button>
      </div>
      <StatsBar />
    </motion.header>
  );
}
