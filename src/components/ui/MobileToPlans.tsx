"use client";

import { useEffect } from "react";

/**
 * No mobile, qualquer botão/link interno (âncora "#...") que não seja um link
 * externo de compra (checkout dos planos, que começa com http) leva para a
 * seção de planos. Mantém o comportamento normal no desktop.
 */
export function MobileToPlans() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (!window.matchMedia("(max-width: 639px)").matches) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      // Só intercepta âncoras internas; links externos de compra (http) passam.
      if (!href.startsWith("#")) return;
      if (href === "#planos" || href === "#") return;

      const planos = document.getElementById("planos");
      if (!planos) return;

      e.preventDefault();
      planos.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", "#planos");
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
