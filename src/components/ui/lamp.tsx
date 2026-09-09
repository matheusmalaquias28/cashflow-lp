"use client";

import { motion } from "motion/react";
import clsx from "clsx";

/**
 * Lamp lighting effect (adapted): red conic beams converging into a glowing
 * full-width bar, used right on the divide between two sections. Background is
 * transparent so it blends with whatever sits above/below — no color seam.
 */
export function LampGlow({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "relative flex h-[18rem] w-full items-center justify-center overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "20rem" }}
          whileInView={{ opacity: 1, width: "55rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: "conic-gradient(var(--conic-position), var(--tw-gradient-stops))" }}
          className="absolute inset-auto right-1/2 h-56 w-[55rem] overflow-visible from-red via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-[100%] bg-[#050505] [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-[100%] w-40 bg-[#050505] [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "20rem" }}
          whileInView={{ opacity: 1, width: "55rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: "conic-gradient(var(--conic-position), var(--tw-gradient-stops))" }}
          className="absolute inset-auto left-1/2 h-56 w-[55rem] from-transparent via-transparent to-red text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute bottom-0 right-0 z-20 h-[100%] w-40 bg-[#050505] [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute bottom-0 right-0 z-20 h-40 w-[100%] bg-[#050505] [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-[#050505] blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-[46rem] -translate-y-1/2 rounded-full bg-red opacity-50 blur-3xl" />
        <motion.div
          initial={{ width: "12rem" }}
          whileInView={{ width: "24rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-96 -translate-y-[6rem] rounded-full bg-red blur-2xl"
        />
        <motion.div
          initial={{ scaleX: 0.4, opacity: 0.6 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-x-0 inset-auto z-50 h-0.5 w-full -translate-y-[7rem] bg-red"
        />
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-[#050505]" />
      </div>
    </div>
  );
}
