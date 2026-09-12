import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { BeyondRevenue } from "@/components/sections/BeyondRevenue";
import { Compare } from "@/components/sections/Compare";
import { OffersOverview, OfferConfig, MetaAds } from "@/components/sections/OffersSuite";
import { FinanceBlock } from "@/components/sections/Finance";
import { Integrations } from "@/components/sections/Integrations";
import { Manifesto, Pricing, Faq, FinalCta } from "@/components/sections/Closing";
import { Features } from "@/components/sections/Features";
import { LampGlow } from "@/components/ui/lamp";
import { CinematicFooter } from "@/components/ui/motion-footer";

export default function Page() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Pillars />
      <BeyondRevenue />
      <Compare />
      <OffersOverview />
      <OfferConfig />
      <MetaAds />
      <FinanceBlock />
      <Integrations />
      <Features />
      <Manifesto />
      <LampGlow />
      <Pricing />
      <Faq />
      <FinalCta />
      <CinematicFooter />
    </main>
  );
}
