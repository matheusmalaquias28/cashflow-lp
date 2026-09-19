export const CTA_PRIMARY_HREF = "#planos";

/**
 * Prova social da hero. `avatars` são caminhos em /public/avatars — enquanto
 * não existirem, o componente mostra um avatar neutro de placeholder.
 * Só troque o texto por uma recomendação quando ela for real.
 */
/** Fotos dos depoimentos — solte os arquivos em /public/depoimentos. */
export const TESTIMONIALS = [
  "/depoimentos/1.jpg",
  "/depoimentos/2.jpg",
  "/depoimentos/3.jpg",
  "/depoimentos/4.jpg",
  "/depoimentos/5.jpg",
  "/depoimentos/6.jpg",
];

export const SOCIAL_PROOF = {
  text: "+350 usuários ativos",
  avatars: ["/avatars/1.jpg", "/avatars/2.jpg", "/avatars/3.jpg", "/avatars/4.jpg"],
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
  monthly: string;
  /** Vendas/mês incluídas — usado para mostrar o salto entre planos. */
  salesLimit: number;
  features: string[];
  /** Recursos que este plano NÃO tem, listados tachados. */
  lockedFeatures?: string[];
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
    monthly: "97",
    salesLimit: 1500,
    features: [
      "3 contas de anúncios",
      "3 Meta Pixels",
      "Ofertas ilimitadas",
      "Webhooks ilimitados",
      "Tracking avançado",
    ],
    lockedFeatures: ["Suporte VIP"],
    extraSale: "R$ 0,10 por venda adicional",
    href: env("NEXT_PUBLIC_CHECKOUT_GOLD") || "https://cashflow.mentoriaprocesso.com/assinatura?plano=gold",
  },
  {
    id: "diamond",
    name: "Diamond",
    tagline: "Para quem já opera múltiplas ofertas.",
    monthly: "197",
    salesLimit: 3000,
    features: [
      "10 contas de anúncios",
      "10 Meta Pixels",
      "Ofertas ilimitadas",
      "Webhooks ilimitados",
      "Tracking avançado",
      "Suporte VIP",
    ],
    extraSale: "R$ 0,08 por venda adicional",
    highlight: true,
    href: env("NEXT_PUBLIC_CHECKOUT_DIAMOND") || "https://cashflow.mentoriaprocesso.com/assinatura?plano=diamond",
  },
  {
    id: "ruby",
    name: "Ruby",
    tagline: "Para operações em escala.",
    monthly: "297",
    salesLimit: 5000,
    features: [
      "Contas de anúncios ilimitadas",
      "Meta Pixels ilimitados",
      "Ofertas ilimitadas",
      "Webhooks ilimitados",
      "Tracking avançado",
      "Suporte VIP",
    ],
    extraSale: "R$ 0,05 por venda adicional",
    href: env("NEXT_PUBLIC_CHECKOUT_RUBY") || "https://cashflow.mentoriaprocesso.com/assinatura?plano=ruby",
  },
  {
    id: "master",
    name: "Master",
    tagline: "Para operações maiores e múltiplas estruturas.",
    monthly: "497",
    salesLimit: 8000,
    features: [
      "Contas de anúncios ilimitadas",
      "Meta Pixels ilimitados",
      "Ofertas ilimitadas",
      "Webhooks ilimitados",
      "Tracking avançado",
      "Suporte VIP",
    ],
    extraSale: "R$ 0,03 por venda adicional",
    href: env("NEXT_PUBLIC_CHECKOUT_MASTER") || "https://cashflow.mentoriaprocesso.com/assinatura?plano=master",
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

export const FAQ: { q: string; a: string[] }[] = [
  {
    q: "O que é a Cashflow?",
    a: [
      "A Cashflow é uma plataforma criada para quem trabalha com múltiplas ofertas low ticket e precisa acompanhar, em um só lugar, os dados de vendas, campanhas, tracking e resultado financeiro da operação.",
      "Com ela, você consegue separar os números de cada oferta e identificar quanto cada uma investiu, vendeu, faturou e deixou de resultado.",
    ],
  },
  {
    q: "Qual é o diferencial da Cashflow em relação a outras ferramentas de tracking?",
    a: [
      "A maioria das ferramentas concentra-se apenas em rastrear conversões ou exibir métricas de campanhas.",
      "A Cashflow foi desenvolvida para conectar três áreas da operação:",
      "1) gestão de múltiplas ofertas;\n2) tracking avançado e tráfego pago;\n3) gestão financeira empresarial.",
      "Além de identificar a origem das vendas, você consegue visualizar o resultado individual de cada oferta e da empresa inteira.",
      "Assim, você não vê apenas qual anúncio gerou uma compra, mas também quanto aquela oferta investiu, faturou e deixou de resultado.",
    ],
  },
  {
    q: "A Cashflow serve para quem possui apenas uma oferta?",
    a: [
      "Sim. Você pode começar utilizando a Cashflow com apenas uma oferta e organizar sua operação desde o início.",
      "Mas o maior diferencial da plataforma aparece quando você começa a empilhar produtos e precisa separar campanhas, vendas e resultados de várias ofertas sem depender de diferentes planilhas e dashboards.",
      "Para iniciantes, ela ajuda a estruturar corretamente a operação. Para usuários mais avançados, facilita a separação, comparação e gestão de um portfólio maior de ofertas.",
    ],
  },
  {
    q: "Consigo acompanhar várias ofertas dentro da mesma conta?",
    a: [
      "Sim. Cada oferta pode ser cadastrada e vinculada às suas respectivas páginas, campanhas, UTMs, Pixel e API de Conversões.",
      "Dessa forma, os resultados ficam organizados separadamente, enquanto você também mantém uma visão consolidada da operação inteira.",
    ],
  },
  {
    q: "Quais plataformas de Checkout estão integradas no momento?",
    a: [
      "Hotmart, Kiwify, Kirvano, Cakto, Wiapy, GGCheckout, Kavoo, Lastlink, Payt, Ticto, Hubla, Vega Checkout, Doppus, Greenn e Zouti, via webhook. Além disso, você conecta suas contas do Meta Ads para trazer os dados de tráfego.",
    ],
  },
  {
    q: "Vou conseguir conferir se o tracking foi configurado corretamente?",
    a: [
      "Sim. A Cashflow possui uma área de configuração do rastreamento para você acompanhar as etapas necessárias e identificar possíveis pendências.",
      "Você poderá verificar elementos como:",
      "integração da plataforma de vendas;\nconexão com o Meta Ads;\noferta cadastrada;\nPixel vinculado;\nAPI de Conversões;\ninstalação do script;\nparâmetros UTM;\ncampanha vinculada à oferta.",
      "Isso reduz a necessidade de configurar tudo sem saber se alguma etapa ficou faltando.",
    ],
  },
  {
    q: "Preciso continuar usando planilhas?",
    a: [
      "Não. Vendas, tráfego, ofertas e financeiro entram em um só lugar, atualizados conforme acontecem. A planilha deixa de ser o centro da operação.",
    ],
  },
  {
    q: "Posso acessar a Cashflow pelo celular?",
    a: [
      "Sim. A plataforma possui interface responsiva para que você possa acompanhar as principais informações da operação pelo computador, tablet ou celular.",
      "Para configurações mais técnicas e análises detalhadas, a experiência em uma tela maior pode ser mais confortável.",
    ],
  },
  {
    q: "A Cashflow continua recebendo atualizações?",
    a: [
      "Sim. A Cashflow está em evolução contínua, com melhorias na experiência, no rastreamento, nas integrações e na gestão das ofertas.",
      "As atualizações são desenvolvidas para tornar os dados mais confiáveis, a operação mais organizada e as decisões mais rápidas.",
    ],
  },
  {
    q: "Quanto tempo para configurar?",
    a: [
      "Você cadastra a operação, conecta o webhook do seu checkout e a conta de anúncios. Em poucos minutos as vendas já começam a aparecer no dashboard.",
    ],
  },
  {
    q: "O que acontece se eu passar do limite de vendas?",
    a: [
      "Nada trava. Cada venda adicional é cobrada pelo valor indicado no seu plano (de R$ 0,03 a R$ 0,10) e você pode migrar de plano a qualquer momento.",
    ],
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: ["Sim, você pode cancelar a qualquer momento, sem dificuldades. Você não tem nenhuma fidelidade."],
  },
];
