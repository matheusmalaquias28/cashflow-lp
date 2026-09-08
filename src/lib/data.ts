export const CTA_PRIMARY_HREF = "#planos";

/**
 * Prova social da hero. `avatars` são caminhos em /public/avatars — enquanto
 * não existirem, o componente mostra um avatar neutro de placeholder.
 * Só troque o texto por uma recomendação quando ela for real.
 */
export const SOCIAL_PROOF = {
  text: "Membros fundadores têm condições especiais de entrada.",
  avatars: ["/avatars/1.jpg", "/avatars/2.jpg", "/avatars/3.jpg"],
};

/**
 * Ofertas fictícias usadas nos mockups de produto da página.
 * Trocar os nomes aqui atualiza todas as seções de uma vez.
 */
export const OFFER = {
  desafio: { name: "Desafio 21 Dias", short: "Desafio" },
  violao: { name: "Guia do Violão", short: "Violão" },
  rotina: { name: "Rotina Matinal", short: "Rotina" },
  churrasco: { name: "Manual do Churrasco", short: "Churrasco" },
  planner: { name: "Planner 2026", short: "Planner" },
} as const;

export type Plan = {
  id: "gold" | "diamond" | "ruby" | "master";
  name: string;
  tagline: string;
  firstPrice: string;
  monthly: string;
  features: string[];
  extraSale: string;
  highlight?: boolean;
  href: string;
};

const env = (k: string) => (typeof process !== "undefined" ? process.env[k] : undefined);

export const PLANS: Plan[] = [
  {
    id: "gold",
    name: "Gold",
    tagline: "Para começar a organizar sua operação.",
    firstPrice: "87,30",
    monthly: "97",
    features: [
      "Até 1.500 vendas/mês",
      "3 contas de anúncios",
      "3 Meta Pixels",
      "1 operação",
      "Ofertas ilimitadas",
      "Webhooks ilimitados",
      "Tracking avançado",
    ],
    extraSale: "R$ 0,10 por venda adicional",
    href: env("NEXT_PUBLIC_CHECKOUT_GOLD") ?? "#",
  },
  {
    id: "diamond",
    name: "Diamond",
    tagline: "Para quem já opera múltiplas ofertas.",
    firstPrice: "167,45",
    monthly: "197",
    features: [
      "Até 3.000 vendas/mês",
      "10 contas de anúncios",
      "10 Meta Pixels",
      "2 operações",
      "Ofertas ilimitadas",
      "Webhooks ilimitados",
      "Tracking avançado",
      "Suporte VIP",
    ],
    extraSale: "R$ 0,08 por venda adicional",
    highlight: true,
    href: env("NEXT_PUBLIC_CHECKOUT_DIAMOND") ?? "#",
  },
  {
    id: "ruby",
    name: "Ruby",
    tagline: "Para operações em escala.",
    firstPrice: "237,60",
    monthly: "297",
    features: [
      "Até 5.000 vendas/mês",
      "Contas de anúncios ilimitadas",
      "Meta Pixels ilimitados",
      "5 operações",
      "Ofertas ilimitadas",
      "Webhooks ilimitados",
      "Tracking avançado",
      "Suporte VIP",
    ],
    extraSale: "R$ 0,05 por venda adicional",
    href: env("NEXT_PUBLIC_CHECKOUT_RUBY") ?? "#",
  },
  {
    id: "master",
    name: "Master",
    tagline: "Para operações maiores e múltiplas estruturas.",
    firstPrice: "347,90",
    monthly: "497",
    features: [
      "Até 8.000 vendas/mês",
      "Contas de anúncios ilimitadas",
      "Meta Pixels ilimitados",
      "10 operações",
      "Ofertas ilimitadas",
      "Webhooks ilimitados",
      "Tracking avançado",
      "Suporte VIP",
    ],
    extraSale: "R$ 0,03 por venda adicional",
    href: env("NEXT_PUBLIC_CHECKOUT_MASTER") ?? "#",
  },
];

export const INTEGRATIONS = [
  "Hotmart",
  "Kiwify",
  "Kirvano",
  "Cakto",
  "Wiapy",
  "GGCheckout",
  "Kavoo",
  "Lastlink",
  "Payt",
  "Ticto",
  "Hubla",
  "Vega Checkout",
  "Doppus",
  "Greenn",
  "Zouti",
] as const;

/** Platforms with an official logo in /public/integrations/<slug>.png (normalized to 96px height). */
export const LOGOS: Record<string, string> = {
  Hotmart: "hotmart",
  Kiwify: "kiwify",
  Kirvano: "kirvano",
  Cakto: "cakto",
  Wiapy: "wiapy",
  GGCheckout: "ggcheckout",
  Kavoo: "kavoo",
  Lastlink: "lastlink",
  Payt: "payt",
  Ticto: "ticto",
  Hubla: "hubla",
  "Vega Checkout": "vega-checkout",
  Greenn: "greenn",
  Zouti: "zouti",
};

export const FAQ = [
  {
    q: "O Cashflow substitui a planilha de controle da operação?",
    a: "Sim. Vendas, tráfego, ofertas e financeiro entram em um só lugar, atualizados conforme acontecem. A planilha deixa de ser o centro da operação.",
  },
  {
    q: "Quais plataformas de checkout são integradas?",
    a: "Hotmart, Kiwify, Kirvano, Cakto, Wiapy, GGCheckout, Kavoo, Lastlink, Payt, Ticto, Hubla, Vega Checkout, Doppus, Greenn e Zouti, via webhook. Além disso, você conecta suas contas do Meta Ads para trazer os dados de tráfego.",
  },
  {
    q: "Quanto tempo leva para configurar?",
    a: "Você cadastra a operação, conecta o webhook do seu checkout e a conta de anúncios. Em poucos minutos as vendas já começam a aparecer no dashboard.",
  },
  {
    q: "O que acontece se eu passar do limite de vendas do plano?",
    a: "Nada trava. Cada venda adicional é cobrada pelo valor indicado no seu plano (de R$ 0,03 a R$ 0,10) e você pode migrar de plano a qualquer momento.",
  },
  {
    q: "O que é o preço de membro fundador?",
    a: "Quem entra agora paga um primeiro pagamento com desconto e garante as condições especiais de entrada. Depois, o valor mensal do plano escolhido.",
  },
  {
    q: "Posso mudar de plano depois?",
    a: "Sim. Você faz upgrade ou downgrade conforme sua operação cresce, sem perder histórico nem configurações.",
  },
];
