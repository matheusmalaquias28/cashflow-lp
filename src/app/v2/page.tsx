import { Nav } from "@/components/sections/Nav";
import { HeroV2 } from "@/components/sections/HeroV2";
import { Pillars } from "@/components/sections/Pillars";
import { Testimonials } from "@/components/sections/Testimonials";
import { Method } from "@/components/sections/Method";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Compare } from "@/components/sections/Compare";
import { OffersOverview, MetaAds } from "@/components/sections/OffersSuite";
import { FinanceBlock } from "@/components/sections/Finance";
import { Integrations } from "@/components/sections/Integrations";
import { Manifesto, Pricing, Faq, FinalCta } from "@/components/sections/Closing";
import { Features } from "@/components/sections/Features";
import { LampGlow } from "@/components/ui/lamp";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { MobileToPlans } from "@/components/ui/MobileToPlans";

export default function Page() {
  return (
    <main className="relative">
      <MobileToPlans />
      <Nav />
      <HeroV2 />
      <Pillars />
      <Testimonials />
      <Method />
      <BeforeAfter />
      <Integrations />
      <Compare />
      <OffersOverview />
      <MetaAds />
      <FinanceBlock />
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
