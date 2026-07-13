import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Showcase } from "@/components/sections/Showcase";
import { LiveDemo } from "@/components/sections/LiveDemo";
import { OrderCTA } from "@/components/sections/OrderCTA";
import { Features } from "@/components/sections/Features";
import { CustomerMarquee } from "@/components/sections/Marquee";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { Lookbook } from "@/components/sections/Lookbook";
import { Pricing } from "@/components/sections/Pricing";
import { ParallaxImage } from "@/components/sections/ParallaxImage";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { FooterCTA } from "@/components/sections/FooterCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AtomCard — NFC digital business card" },
      { name: "description", content: "AtomCard is an NFC-enabled business card that shares your profile and saves to contacts in a single tap. No app required." },
      { property: "og:title", content: "AtomCard — NFC digital business card" },
      { property: "og:description", content: "Tap to share your profile. One card, lifetime updates, works on any modern phone." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <Nav />
      <Hero />
      <LogoMarquee />
      <HowItWorks />
      <Showcase />
      <Lookbook />
      <LiveDemo />
      <OrderCTA />
      <Features />
      <CustomerMarquee />
      <Pricing />
      <ParallaxImage />
      <FAQ />
      <Contact />
      <FooterCTA />
    </main>
  );
}
