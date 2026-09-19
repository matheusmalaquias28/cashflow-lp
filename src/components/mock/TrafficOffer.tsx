"use client";

/**
 * Tráfego organizado por oferta: funil de conversão do Meta Ads da oferta
 * selecionada + os indicadores de gasto, ARPU, lucro e ROAS.
 * Todos os números são de uma operação fictícia de demonstração.
 */

import clsx from "clsx";
import { Funnel, Label } from "./product";

const STAGES = [
  { label: "Cliques", value: 312 },
  { label: "Vis. Página", value: 306 },
  { label: "ICs", value: 41 },
  { label: "Vendas Inic.", value: 68 },
  { label: "Vendas Apr.", value: 59 },
];

const METRICS = [
  { label: "Gastos com anúncios", value: "R$ 528,40", tone: "white" as const },
  { label: "ARPU", value: "R$ 44,60", tone: "white" as const },
  { label: "Lucro", value: "R$ 1.742,90", tone: "green" as const },
  { label: "ROAS", value: "4.98", tone: "green" as const },
];

export function TrafficOffer() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="rounded-xl border border-white/[0.06] bg-card p-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue" /> Funil de conversão (Meta Ads)
          </Label>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-fg-3">Hoje</span>
        </div>
        <Funnel stages={STAGES} height={150} className="mt-3" />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {METRICS.map((m) => (
          <div key={m.label} className="min-w-0 rounded-xl border border-white/[0.06] bg-[#0f0f0f] p-3">
            <span className="block break-words font-mono text-[8.5px] uppercase leading-tight tracking-[0.12em] text-fg-3">
              {m.label}
            </span>
            <div
              className={clsx(
                "mt-1.5 whitespace-nowrap text-[15px] font-bold leading-none tracking-tight sm:text-base",
                m.tone === "green" ? "text-green" : "text-fg",
              )}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
