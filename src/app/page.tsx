import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { BeyondRevenue } from "@/components/sections/BeyondRevenue";
import { Compare } from "@/components/sections/Compare";
import { OffersOverview, OfferConfig, MetaAds } from "@/components/sections/OffersSuite";
import { Waterfall, Ledger, Commitments } from "@/components/sections/Finance";
import { Integrations } from "@/components/sections/Integrations";
import { Manifesto, Pricing, Faq, FinalCta, Footer } from "@/components/sections/Closing";
import { Features } from "@/components/sections/Features";

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
      <Waterfall />
      <Ledger />
      <Commitments />
      <Integrations />
      <Features />
      <Manifesto />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
