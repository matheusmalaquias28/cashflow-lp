"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";

const ENDPOINT =
  process.env.NEXT_PUBLIC_STATS_URL ??
  "https://ammxcfiblpftphikndmk.supabase.co/functions/v1/stats-publicas";

const POLL_MS = 5000;

type Stats = {
  faturamento: number;
  vendas: number;
  trackeadas: number;
  pct: number;
};

const fmt = (n: number, digits = 0) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Tweens between the previous and the newly polled value. */
function Tween({
  value,
  prefix = "",
  suffix = "",
  digits = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  digits?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    const b = value;
    from.current = value;
    if (a === b) return;
    let raf = 0;
    const loop = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      const e = 1 - Math.pow(1 - p, 4);
      setShown(a + (b - a) * e);
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className={clsx("font-mono tabular", className)}>
      {prefix}
      {fmt(shown, digits)}
      {suffix}
    </span>
  );
}

export function StatsBar({ className }: { className?: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bump, setBump] = useState(0);
  const prevSales = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const load = async () => {
      // Skip polling while the tab is in the background.
      if (document.visibilityState === "hidden") return;
      try {
        const res = await fetch(ENDPOINT, { signal: controller.signal, cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Stats;
        if (!alive || typeof data?.vendas !== "number") return;
        if (prevSales.current !== null && data.vendas > prevSales.current) setBump((b) => b + 1);
        prevSales.current = data.vendas;
        setStats(data);
      } catch {
        // Network hiccup or offline: keep the last known values on screen.
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      alive = false;
      clearInterval(id);
      controller.abort();
      document.removeEventListener("visibilitychange", load);
    };
  }, []);

  return (
    <AnimatePresence>
      {stats && (
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={clsx("items-center gap-3 sm:gap-4", className)}
        >
          <span className="flex shrink-0 items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <motion.span
                key={bump}
                className="absolute inset-0 rounded-full bg-red"
                initial={{ scale: 1, opacity: 0.9 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
              <span className="h-1.5 w-1.5 rounded-full bg-red" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-3">Ao vivo</span>
          </span>

          <Item label="Processado">
            <Tween value={stats.faturamento} prefix="R$ " />
          </Item>
          <Item label="Vendas">
            <Tween value={stats.vendas} />
          </Item>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Item({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "flex shrink-0 items-baseline gap-1.5 border-l border-line pl-3 text-[11px] sm:pl-4 sm:text-xs",
        className,
      )}
    >
      <span className="text-fg-3">{label}</span>
      <span className="font-semibold text-fg">{children}</span>
    </span>
  );
}
